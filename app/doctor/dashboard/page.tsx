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
import { Calendar, Users, Stethoscope, Clock, CheckCircle } from "lucide-react";

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const { appointments, updateAppStatus, refresh: refreshApps } = useAppointments();
  const { patients } = usePatients();
  const { users } = useUsers();

  const myAppointments = appointments.filter((a) => a.doctorId === user?.id);
  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppointments = myAppointments.filter((a) => a.date === todayStr);
  const pendingAppointments = myAppointments.filter((a) => a.status === "pending");

  return (
    <PrivateRoute allowedRoles={["doctor"]}>
      <DashboardLayout>
        <div className="space-y-6 font-sans text-healthcare-textDark">
          {/* Welcome Banner */}
          <div className="bg-white border border-healthcare-border rounded-standard p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between shadow-subtle gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-purple-100 text-purple-800 border border-purple-200">
                  Medical Practitioner Portal
                </span>
                <span className="text-xs text-healthcare-textLight font-mono">Licensed Physician Session</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-healthcare-textDark font-display tracking-tight mt-1">
                Good day, <span className="text-healthcare-primary">{user?.name}</span>
              </h1>
              <p className="text-sm text-healthcare-textMedium font-medium mt-1">
                You have <span className="font-bold text-healthcare-primary">{todayAppointments.length} consultations</span> scheduled for today.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Link href="/dashboard/patients">
                <Button variant="primary" className="gap-2 shadow-sm">
                  <Users className="w-4 h-4" /> Assigned Patients
                </Button>
              </Link>
              <Link href="/dashboard/appointments">
                <Button variant="outline" className="gap-2">
                  <Calendar className="w-4 h-4" /> Schedule Calendar
                </Button>
              </Link>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard
              title="Today's Consultations"
              value={todayAppointments.length}
              icon={<Clock className="w-6 h-6" />}
              description="Scheduled Consultations Today"
            />
            <StatCard
              title="Pending Requests"
              value={pendingAppointments.length}
              icon={<Calendar className="w-6 h-6" />}
              description={pendingAppointments.length > 0 ? "Requires Doctor Confirmation" : "All Consultations Reviewed"}
            />
            <StatCard
              title="Total Assigned Patients"
              value={patients.length}
              icon={<Users className="w-6 h-6" />}
              description="Active Patient Cases"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
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

            <div className="space-y-6">
              <Card title="Physician Quick Actions" subtitle="Fast management of patient cases">
                <div className="space-y-3 pt-2">
                  <Link href="/dashboard/patients">
                    <Button variant="primary" fullWidth className="justify-between">
                      <span>View Patient Histories</span>
                      <Users className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/dashboard/appointments">
                    <Button variant="outline" fullWidth className="justify-between">
                      <span>Manage All Appointments</span>
                      <Calendar className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/dashboard/profile">
                    <Button variant="outline" fullWidth className="justify-between">
                      <span>Update Doctor Profile</span>
                      <Stethoscope className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </Card>

              <Card title="Clinical Privacy Notice" subtitle="HIPAA Compliance Rules">
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-standard text-xs text-purple-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-purple-700" /> Patient Record Safeguards
                  </p>
                  <p className="text-[11px] leading-relaxed text-purple-800">
                    Doctors can only read and update records for assigned patients or authorized consultations.
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
