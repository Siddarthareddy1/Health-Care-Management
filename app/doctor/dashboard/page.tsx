"use client";

import React from "react";
import PrivateRoute from "@/components/common/PrivateRoute";
import DashboardLayout from "@/app/dashboard/layout";
import StatCard from "@/components/dashboard/StatCard";
import RecentAppointments from "@/components/dashboard/RecentAppointments";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useAppointments, usePatients, useUsers } from "@/hooks/useFirestore";
import { Calendar, Users, Stethoscope, Clock, CheckCircle, Star } from "lucide-react";

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const { appointments, updateAppStatus, refresh: refreshApps } = useAppointments();
  const { patients } = usePatients();
  const { users } = useUsers();

  const myAppointments = appointments.filter((a) => a.doctorId === user?.id);
  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppointments = myAppointments.filter((a) => a.date === todayStr);
  const pendingAppointments = myAppointments.filter((a) => a.status === "pending");
  const completedToday = todayAppointments.filter((a) => a.status === "completed").length;

  const getPatientName = (patientId: string) => {
    return users.find((u) => u.id === patientId)?.name || "Assigned Patient";
  };

  return (
    <PrivateRoute allowedRoles={["doctor"]}>
      <DashboardLayout>
        <div className="space-y-8 font-sans text-[#0F172A] animate-fade-in-up">
          {/* Doctor Welcome Banner */}
          <div className="bg-gradient-to-r from-white via-purple-50/40 to-indigo-50/40 border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-[#8B5CF6] border border-purple-200/80 text-xs font-bold font-mono mb-2">
                <span>👨‍⚕️ Physician Portal</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-ping" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-poppins tracking-tight">
                Welcome, Dr. {user?.name || "Doctor"} 👨‍⚕️
              </h1>
              <p className="text-sm text-[#475569] font-medium mt-1">
                You have <span className="font-bold text-[#8B5CF6]">{todayAppointments.length} consultations</span> scheduled for today.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Link href="/dashboard/patients">
                <Button variant="primary" className="gap-2">
                  <Users className="w-4 h-4" /> Assigned Patients
                </Button>
              </Link>
              <Link href="/dashboard/appointments">
                <Button variant="outline" className="gap-2">
                  <Calendar className="w-4 h-4 text-[#8B5CF6]" /> Schedule Calendar
                </Button>
              </Link>
            </div>
          </div>

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Today's Consultations"
              value={todayAppointments.length}
              icon={<Calendar className="w-6 h-6" />}
              color="indigo"
              change="Today's Schedule"
            />
            <StatCard
              title="Total Patients"
              value={patients.length || myAppointments.length}
              icon={<Users className="w-6 h-6" />}
              color="green"
              change="Active Cases"
            />
            <StatCard
              title="Completed Today"
              value={completedToday}
              icon={<CheckCircle className="w-6 h-6" />}
              color="purple"
              change="Reviewed"
            />
            <StatCard
              title="Pending Requests"
              value={pendingAppointments.length}
              icon={<Clock className="w-6 h-6" />}
              color="red"
              change={pendingAppointments.length > 0 ? "Requires Action" : "All Clear"}
            />
          </div>

          {/* Schedule Timeline & Patient Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Timeline View */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6">
                <div className="flex items-center justify-between mb-6 border-b border-[#F1F5F9] pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#0F172A] font-poppins">Today's Timeline Schedule</h2>
                    <p className="text-xs text-[#475569]">Chronological appointment slots</p>
                  </div>
                  <span className="text-xs font-bold text-[#8B5CF6] bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                    {todayAppointments.length} Today
                  </span>
                </div>

                <div className="space-y-4">
                  {todayAppointments.length > 0 ? (
                    todayAppointments.map((slot) => (
                      <ScheduleSlot
                        key={slot.id}
                        time={`${slot.time}`}
                        patient={getPatientName(slot.patientId)}
                        status={slot.status === 'completed' ? 'Completed' : slot.status === 'approved' ? 'In Progress' : 'Upcoming'}
                        reason={slot.reason}
                        onComplete={() => updateAppStatus(slot.id, { status: "completed" })}
                      />
                    ))
                  ) : (
                    <div className="space-y-3">
                      <ScheduleSlot
                        time="09:00 AM - 09:30 AM"
                        patient="John Doe"
                        status="Completed"
                        reason="Follow-up Blood Pressure Check"
                      />
                      <ScheduleSlot
                        time="10:00 AM - 10:30 AM"
                        patient="Sarah Jenkins"
                        status="In Progress"
                        reason="Routine Heart & Vascular Checkup"
                      />
                      <ScheduleSlot
                        time="11:15 AM - 11:45 AM"
                        patient="Michael Brown"
                        status="Upcoming"
                        reason="Lab Results Review"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Appointments Component */}
              <RecentAppointments
                appointments={myAppointments}
                users={users}
                role="doctor"
                onUpdateStatus={async (id, status) => {
                  await updateAppStatus(id, { status });
                  refreshApps();
                }}
              />
            </div>

            {/* Right Side Cards */}
            <div className="space-y-6">
              <Card title="Physician Performance" subtitle="Clinical ratings & metrics">
                <div className="space-y-4 pt-2">
                  <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[#475569]">Patient Satisfaction</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-extrabold text-[#0F172A] font-poppins">4.9</span>
                        <div className="flex text-amber-400 text-sm">★★★★★</div>
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 text-[#8B5CF6] rounded-xl border border-purple-100">
                      <Star size={24} />
                    </div>
                  </div>

                  <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                    <p className="text-xs font-semibold text-[#475569]">Consultation Fee</p>
                    <p className="text-2xl font-extrabold text-[#0F172A] font-poppins mt-0.5">$150 / session</p>
                    <p className="text-xs text-[#10B981] font-medium mt-1">Standard Specialty Rate</p>
                  </div>
                </div>
              </Card>

              <Card title="Quick Management" subtitle="Physician shortcuts">
                <div className="space-y-3 pt-2">
                  <Link href="/dashboard/patients">
                    <Button variant="primary" fullWidth className="justify-between text-xs py-2.5">
                      <span>View Assigned Patients</span>
                      <Users className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/dashboard/appointments">
                    <Button variant="outline" fullWidth className="justify-between text-xs py-2.5">
                      <span>Manage All Appointments</span>
                      <Calendar className="w-4 h-4 text-[#8B5CF6]" />
                    </Button>
                  </Link>
                  <Link href="/dashboard/profile">
                    <Button variant="outline" fullWidth className="justify-between text-xs py-2.5">
                      <span>Update Doctor Profile</span>
                      <Stethoscope className="w-4 h-4 text-[#8B5CF6]" />
                    </Button>
                  </Link>
                </div>
              </Card>

              <Card title="Clinical Security & Privacy" subtitle="HIPAA Physician Access Rules">
                <div className="p-4 bg-purple-50/60 border border-purple-200/80 rounded-xl text-xs text-[#0F172A] space-y-2">
                  <p className="font-bold flex items-center gap-2 text-sm text-[#8B5CF6] font-poppins">
                    <CheckCircle className="w-5 h-5" /> Authenticated Access
                  </p>
                  <p className="leading-relaxed text-[#475569]">
                    Medical record edits are logged with your session license token for compliance auditing.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </PrivateRoute>
  );
}

// Schedule Slot Item Component
function ScheduleSlot({ time, patient, status, reason, onComplete }: {
  time: string;
  patient: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  reason?: string;
  onComplete?: () => void;
}) {
  const statusColors = {
    'Completed': 'bg-emerald-50 text-[#10B981] border-emerald-200',
    'In Progress': 'bg-indigo-50 text-[#6366F1] border-indigo-200',
    'Upcoming': 'bg-slate-50 text-[#64748B] border-slate-200',
  };

  return (
    <div className="p-4 border border-[#E2E8F0] rounded-xl hover:shadow-md transition-all duration-200 bg-white">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold text-[#0F172A] text-base font-poppins">{patient}</p>
          {reason && <p className="text-xs text-[#475569] font-medium mt-0.5">{reason}</p>}
          <p className="text-xs text-[#64748B] mt-2 font-mono flex items-center gap-1">
            <Clock size={14} className="text-[#8B5CF6]" /> {time}
          </p>
        </div>
        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${statusColors[status]}`}>
          {status}
        </span>
      </div>

      <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex gap-2 justify-end">
        {onComplete && status !== 'Completed' && (
          <button
            onClick={onComplete}
            className="text-xs font-bold bg-[#10B981] text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition shadow-xs"
          >
            Mark Completed
          </button>
        )}
        <Link
          href="/dashboard/patients"
          className="text-xs font-bold text-[#6366F1] hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition"
        >
          Patient Notes
        </Link>
      </div>
    </div>
  );
}
