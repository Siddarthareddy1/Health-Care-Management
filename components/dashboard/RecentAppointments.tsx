import React from "react";
import { Appointment, User } from "../../types";
import { Calendar, Check, X, Clock, MapPin, User as UserIcon } from "lucide-react";
import Button from "../common/Button";

interface RecentAppointmentsProps {
  appointments: Appointment[];
  users: User[];
  onUpdateStatus?: (id: string, status: Appointment["status"]) => void;
  role: string;
}

export default function RecentAppointments({
  appointments,
  users,
  onUpdateStatus,
  role,
}: RecentAppointmentsProps) {
  const getUserName = (id: string) => {
    return users.find((u) => u.id === id)?.name || "Patient";
  };

  const getStatusBadge = (status: Appointment["status"]) => {
    const styles = {
      pending: "bg-[#FFF4E5] text-[#FF9500] border-[#FF9500]/20",
      approved: "bg-[#DFF1FF] text-[#0051CC] border-[#007AFF]/20",
      completed: "bg-[#E8F8EC] text-[#34C759] border-[#34C759]/20",
      rejected: "bg-[#FFEBEA] text-[#FF3B30] border-[#FF3B30]/20",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border inline-flex items-center gap-1 uppercase tracking-wider ${styles[status] || "bg-gray-100 text-gray-700"}`}>
        {status}
      </span>
    );
  };

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-[#E5E7EB] p-8">
        <Calendar className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
        <p className="text-sm font-semibold text-[#1F2937]">No appointments found</p>
        <p className="text-xs text-[#6B7280] mt-1">Scheduled checkups and consultations will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden font-sans">
      <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
        <h3 className="font-bold text-lg text-[#1F2937] font-display">Appointments Schedule</h3>
        <span className="text-xs font-semibold text-[#007AFF] bg-[#DFF1FF] px-2.5 py-1 rounded-full">
          {appointments.length} Total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F8FAFB] text-xs text-[#6B7280] uppercase font-semibold">
              <th className="py-3.5 px-5">Patient</th>
              <th className="py-3.5 px-5">Doctor</th>
              <th className="py-3.5 px-5">Date & Time</th>
              <th className="py-3.5 px-5">Reason</th>
              <th className="py-3.5 px-5">Status</th>
              {onUpdateStatus && <th className="py-3.5 px-5 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] text-sm text-[#1F2937]">
            {appointments.map((app) => (
              <tr key={app.id} className="hover:bg-[#F8FAFB] transition-colors">
                <td className="py-4 px-5 font-semibold text-[#1F2937]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#DFF1FF] text-[#007AFF] rounded-full flex items-center justify-center text-xs font-bold">
                      {getUserName(app.patientId)[0]}
                    </div>
                    <span>{getUserName(app.patientId)}</span>
                  </div>
                </td>
                <td className="py-4 px-5 text-[#6B7280] font-medium">
                  Dr. {getUserName(app.doctorId)}
                </td>
                <td className="py-4 px-5 font-mono text-xs text-[#6B7280]">
                  <div className="flex flex-col">
                    <span className="font-semibold text-[#1F2937]">📅 {app.date}</span>
                    <span>⏰ {app.time}</span>
                  </div>
                </td>
                <td className="py-4 px-5 max-w-xs truncate text-[#6B7280] text-xs">
                  {app.reason}
                </td>
                <td className="py-4 px-5">{getStatusBadge(app.status)}</td>
                {onUpdateStatus && (
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Admin actions */}
                      {role === "admin" && app.status === "pending" && (
                        <>
                          <button
                            onClick={() => onUpdateStatus(app.id, "approved")}
                            className="p-2 rounded-lg bg-[#34C759] hover:bg-[#2DB04F] text-white transition shadow-xs"
                            title="Approve Appointment"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onUpdateStatus(app.id, "rejected")}
                            className="p-2 rounded-lg bg-[#FF3B30] hover:bg-[#E63C32] text-white transition shadow-xs"
                            title="Reject Appointment"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {/* Doctor actions */}
                      {role === "doctor" && app.status === "approved" && (
                        <>
                          <button
                            onClick={() => onUpdateStatus(app.id, "completed")}
                            className="p-2 rounded-lg bg-[#34C759] hover:bg-[#2DB04F] text-white transition shadow-xs"
                            title="Complete Consultation"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onUpdateStatus(app.id, "rejected")}
                            className="p-2 rounded-lg bg-[#FF3B30] hover:bg-[#E63C32] text-white transition shadow-xs"
                            title="Cancel Session"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {/* Patient actions */}
                      {role === "patient" && (app.status === "pending" || app.status === "approved") && (
                        <button
                          onClick={() => onUpdateStatus(app.id, "rejected")}
                          className="px-3 py-1.5 rounded-lg bg-[#FF3B30] hover:bg-[#E63C32] text-white text-xs font-semibold transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

