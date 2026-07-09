import React from "react";
import { Appointment, User } from "../../types";
import { Calendar, Check, X } from "lucide-react";
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
    return users.find((u) => u.id === id)?.name || "Demo Patient";
  };

  const getStatusBadge = (status: Appointment["status"]) => {
    const styles = {
      scheduled: "bg-blue-50 text-healthcare-primary border border-blue-200",
      completed: "bg-emerald-50 text-healthcare-success border border-emerald-200",
      cancelled: "bg-red-50 text-healthcare-error border border-red-200",
    };
    return (
      <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${styles[status]}`}>
        {status}
      </span>
    );
  };

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12 text-healthcare-textMedium">
        <Calendar className="w-10 h-10 text-healthcare-textLight mx-auto mb-3" />
        <p className="text-sm font-semibold">No recent appointments found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-healthcare-border text-xs text-healthcare-textMedium uppercase font-bold">
            <th className="py-3 px-4">Patient</th>
            <th className="py-3 px-4">Doctor</th>
            <th className="py-3 px-4">Date & Time</th>
            <th className="py-3 px-4">Reason</th>
            <th className="py-3 px-4">Status</th>
            {onUpdateStatus && role !== "patient" && <th className="py-3 px-4 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-healthcare-border text-sm text-healthcare-textDark font-medium">
          {appointments.map((app) => (
            <tr key={app.id} className="hover:bg-healthcare-bgSecondary transition-all">
              <td className="py-4 px-4 font-bold text-healthcare-textDark">{getUserName(app.patientId)}</td>
              <td className="py-4 px-4">{getUserName(app.doctorId)}</td>
              <td className="py-4 px-4 font-mono text-xs text-healthcare-textMedium">
                {app.date} @ {app.time}
              </td>
              <td className="py-4 px-4 max-w-xs truncate text-healthcare-textMedium">{app.reason}</td>
              <td className="py-4 px-4">{getStatusBadge(app.status)}</td>
              {onUpdateStatus && role !== "patient" && app.status === "scheduled" && (
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onUpdateStatus(app.id, "completed")}
                      className="p-1.5 rounded-md bg-healthcare-success hover:bg-emerald-600 text-white shadow-subtle transition-all"
                      title="Complete Appointment"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onUpdateStatus(app.id, "cancelled")}
                      className="p-1.5 rounded-md bg-healthcare-error hover:bg-red-700 text-white shadow-subtle transition-all"
                      title="Cancel Appointment"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
