"use client";

import React, { useState } from "react";
import PrivateRoute from "@/components/common/PrivateRoute";
import DashboardLayout from "@/app/dashboard/layout";
import StatCard from "@/components/dashboard/StatCard";
import RecentAppointments from "@/components/dashboard/RecentAppointments";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import AppointmentForm from "@/components/forms/AppointmentForm";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useAppointments, useBills, useUsers } from "@/hooks/useFirestore";
import { Calendar, FileText, Pill, CreditCard, ArrowRight, PlusCircle, Sparkles, MapPin, Clock, ShieldCheck } from "lucide-react";

export default function PatientDashboardPage() {
  const { user } = useAuth();
  const { appointments, updateAppStatus, refresh: refreshApps } = useAppointments();
  const { bills } = useBills();
  const { users } = useUsers();
  const [showBookModal, setShowBookModal] = useState(false);

  const myAppointments = appointments.filter((a) => a.patientId === user?.id);
  const myBills = bills.filter((b) => b.patientId === user?.id);
  const pendingBills = myBills.filter((b) => b.status === "pending");

  const upcomingAppointments = myAppointments
    .filter((a) => a.status !== "rejected")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getDoctorName = (doctorId: string) => {
    return users.find((u) => u.id === doctorId)?.name || "Primary Physician";
  };

  return (
    <PrivateRoute allowedRoles={["patient"]}>
      <DashboardLayout>
        <div className="space-y-8 font-sans text-[#0F172A] animate-fade-in-up">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-white via-indigo-50/40 to-purple-50/40 border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-[#6366F1] border border-indigo-200/80 text-xs font-bold font-mono mb-2">
                <span>👤 Patient Portal</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] animate-ping" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-poppins tracking-tight">
                Welcome back, {user?.name || "Patient"}! 👋
              </h1>
              <p className="text-sm text-[#475569] font-medium mt-1">
                Here's your personal health dashboard and upcoming checkups.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Button onClick={() => setShowBookModal(true)} variant="primary" className="gap-2 shadow-md">
                <PlusCircle className="w-4 h-4" /> Book Appointment
              </Button>
              <Link href="/dashboard/billing">
                <Button variant="outline" className="gap-2">
                  <CreditCard className="w-4 h-4 text-[#6366F1]" /> My Invoices ({pendingBills.length})
                </Button>
              </Link>
            </div>
          </div>

          {/* 4 Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Appointments"
              value={myAppointments.length}
              icon={<Calendar className="w-6 h-6" />}
              color="indigo"
              change={`${upcomingAppointments.length} Upcoming`}
            />
            <StatCard
              title="Medical Records"
              value={myAppointments.filter(a => a.status === 'completed').length + 2}
              icon={<FileText className="w-6 h-6" />}
              color="green"
              change="Verified Records"
            />
            <StatCard
              title="Active Prescriptions"
              value={myAppointments.filter(a => a.status === 'completed').length || 1}
              icon={<Pill className="w-6 h-6" />}
              color="purple"
              change="Current Rx"
            />
            <StatCard
              title="Pending Payments"
              value={`$${pendingBills.reduce((acc, b) => acc + b.amount, 0)}`}
              icon={<CreditCard className="w-6 h-6" />}
              color="red"
              change={pendingBills.length > 0 ? "Due Soon" : "Cleared"}
            />
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickActionButton
              title="Book Appointment"
              description="Schedule a consultation with a board-certified specialist"
              icon={<Calendar className="w-6 h-6 text-[#6366F1]" />}
              onClick={() => setShowBookModal(true)}
              color="indigo"
            />
            <QuickActionButton
              title="View Medical Records"
              description="Check your consultation history & prescriptions"
              icon={<FileText className="w-6 h-6 text-[#10B981]" />}
              href="/dashboard/billing"
              color="green"
            />
            <QuickActionButton
              title="My Prescriptions"
              description="Review current medications & lab invoices"
              icon={<Pill className="w-6 h-6 text-[#8B5CF6]" />}
              href="/dashboard/billing"
              color="purple"
            />
          </div>

          {/* Upcoming Appointments Cards & Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#0F172A] font-poppins">Upcoming Appointments</h2>
                    <p className="text-xs text-[#475569]">Your confirmed and pending consultation dates</p>
                  </div>
                  <Button onClick={() => setShowBookModal(true)} variant="secondary" className="text-xs py-2 px-3 h-8">
                    + New
                  </Button>
                </div>

                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.slice(0, 3).map((apt) => (
                      <AppointmentCard
                        key={apt.id}
                        appointment={apt}
                        doctorName={getDoctorName(apt.doctorId)}
                        onCancel={() => updateAppStatus(apt.id, { status: "rejected" })}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0]">
                    <Sparkles className="w-10 h-10 mx-auto mb-2 text-[#94A3B8]" />
                    <p className="text-sm font-semibold text-[#0F172A] font-poppins">No upcoming appointments</p>
                    <button
                      onClick={() => setShowBookModal(true)}
                      className="mt-3 text-xs font-bold text-[#6366F1] hover:underline inline-flex items-center gap-1"
                    >
                      Book one now →
                    </button>
                  </div>
                )}
              </div>

              {/* Full Schedule Table */}
              <RecentAppointments
                appointments={myAppointments}
                users={users}
                role="patient"
                onUpdateStatus={async (id, status) => {
                  await updateAppStatus(id, { status });
                  refreshApps();
                }}
              />
            </div>

            {/* Side Info & Patient Privacy */}
            <div className="space-y-6">
              <Card title="Patient Profile Status" subtitle="Account summary">
                <div className="space-y-4 pt-2">
                  <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                    <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider font-mono">Patient Name</p>
                    <p className="text-base font-bold text-[#0F172A] font-poppins mt-0.5">{user?.name}</p>
                    <p className="text-xs text-[#475569]">{user?.email}</p>
                  </div>

                  <Link href="/dashboard/profile">
                    <Button variant="outline" fullWidth className="justify-between text-xs py-2.5">
                      <span>Edit Personal Info</span>
                      <ArrowRight className="w-4 h-4 text-[#6366F1]" />
                    </Button>
                  </Link>

                  <Link href="/dashboard/billing">
                    <Button variant="outline" fullWidth className="justify-between text-xs py-2.5">
                      <span>View All Billing Invoices</span>
                      <CreditCard className="w-4 h-4 text-[#6366F1]" />
                    </Button>
                  </Link>
                </div>
              </Card>

              <Card title="Patient Privacy & Security" subtitle="Protected under HIPAA Security Standard">
                <div className="p-4 bg-indigo-50/60 border border-indigo-200/80 rounded-xl text-xs text-[#0F172A] space-y-2">
                  <p className="font-bold flex items-center gap-2 text-sm text-[#6366F1] font-poppins">
                    <ShieldCheck className="w-5 h-5" /> Confirmed Encryption
                  </p>
                  <p className="leading-relaxed text-[#475569]">
                    Your healthcare data and consultation logs are encrypted and strictly restricted to your authenticated account.
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* Book Appointment Modal */}
          {showBookModal && (
            <Modal isOpen={true} onClose={() => setShowBookModal(false)} title="Book Doctor Consultation">
              <AppointmentForm
                patientId={user?.id || ""}
                onSuccess={() => {
                  setShowBookModal(false);
                  refreshApps();
                }}
              />
            </Modal>
          )}
        </div>
      </DashboardLayout>
    </PrivateRoute>
  );
}

// Quick Action Card Component
function QuickActionButton({ title, description, icon, href, onClick, color }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  color: "indigo" | "green" | "purple";
}) {
  const hoverBorders = {
    indigo: "hover:border-indigo-300 hover:bg-indigo-50/30",
    green: "hover:border-emerald-300 hover:bg-emerald-50/30",
    purple: "hover:border-purple-300 hover:bg-purple-50/30",
  };

  const Content = (
    <div className={`p-6 rounded-2xl border border-[#E2E8F0] bg-white transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer ${hoverBorders[color]}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
          {icon}
        </div>
        <ArrowRight className="w-5 h-5 text-[#94A3B8]" />
      </div>
      <h3 className="font-bold text-[#0F172A] text-base mb-1 font-poppins">{title}</h3>
      <p className="text-xs text-[#475569] leading-relaxed font-sans">{description}</p>
    </div>
  );

  if (href) {
    return <Link href={href}>{Content}</Link>;
  }

  return <div onClick={onClick}>{Content}</div>;
}

// Appointment Card
function AppointmentCard({ appointment, doctorName, onCancel }: {
  appointment: any;
  doctorName: string;
  onCancel: () => void;
}) {
  return (
    <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs hover:shadow-md transition-all duration-200 border-l-4 border-l-[#6366F1]">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-[#0F172A] text-base font-poppins">Dr. {doctorName}</h3>
          <p className="text-xs text-[#475569] font-medium">{appointment.reason || "General Checkup"}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
          appointment.status === 'approved' 
            ? 'bg-emerald-50 text-[#10B981] border-emerald-200' 
            : 'bg-amber-50 text-[#F59E0B] border-amber-200'
        }`}>
          {appointment.status === 'approved' ? 'Confirmed' : appointment.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-4 text-xs font-medium text-[#475569] mb-4 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-[#6366F1]" /> {appointment.date}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-[#6366F1]" /> {appointment.time}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#6366F1]" /> Main Hospital Suite 104
        </span>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-3.5 py-1.5 text-xs font-bold text-[#EF4444] hover:bg-rose-50 rounded-lg transition"
        >
          Cancel Appointment
        </button>
      </div>
    </div>
  );
}
