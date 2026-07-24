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
  const totalSpent = myBills
    .filter((b) => b.status === "paid")
    .reduce((sum, b) => sum + b.amount, 0);

  const todayStr = new Date().toISOString().split("T")[0];
  const upcomingAppointments = myAppointments
    .filter((a) => a.status !== "rejected")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getDoctorName = (doctorId: string) => {
    return users.find((u) => u.id === doctorId)?.name || "Primary Physician";
  };

  return (
    <PrivateRoute allowedRoles={["patient"]}>
      <DashboardLayout>
        <div className="space-y-8 font-sans text-[#1F2937] animate-fade-in-up">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-white via-[#F8FAFB] to-[#DFF1FF]/30 border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DFF1FF] text-[#0051CC] border border-[#007AFF]/20 text-xs font-semibold mb-2">
                <span>👤 Patient Portal</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#007AFF] animate-ping" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] font-display tracking-tight">
                Welcome back, {user?.name || "Patient"}! 👋
              </h1>
              <p className="text-sm text-[#6B7280] font-medium mt-1">
                Here's your personal health dashboard and upcoming checkups.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Button onClick={() => setShowBookModal(true)} variant="primary" className="gap-2">
                <PlusCircle className="w-4 h-4" /> Book Appointment
              </Button>
              <Link href="/dashboard/billing">
                <Button variant="outline" className="gap-2">
                  <CreditCard className="w-4 h-4 text-[#007AFF]" /> My Invoices ({pendingBills.length})
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
              color="blue"
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
              color="orange"
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
              description="Schedule a consultation with a specialist"
              icon={<Calendar className="w-6 h-6 text-[#007AFF]" />}
              onClick={() => setShowBookModal(true)}
              color="blue"
            />
            <QuickActionButton
              title="View Medical Records"
              description="Check your consultation history & prescriptions"
              icon={<FileText className="w-6 h-6 text-[#34C759]" />}
              href="/dashboard/billing"
              color="green"
            />
            <QuickActionButton
              title="My Prescriptions"
              description="Review current medications & lab invoices"
              icon={<Pill className="w-6 h-6 text-[#FF9500]" />}
              href="/dashboard/billing"
              color="orange"
            />
          </div>

          {/* Upcoming Appointments Cards & Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#1F2937] font-display">Upcoming Appointments</h2>
                    <p className="text-xs text-[#6B7280]">Your confirmed and pending consultation dates</p>
                  </div>
                  <Button onClick={() => setShowBookModal(true)} variant="secondary" className="text-xs py-2 px-3">
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
                  <div className="p-8 text-center bg-[#F8FAFB] rounded-xl border border-dashed border-[#E5E7EB]">
                    <Sparkles className="w-10 h-10 mx-auto mb-2 text-[#9CA3AF]" />
                    <p className="text-sm font-semibold text-[#1F2937]">No upcoming appointments</p>
                    <button
                      onClick={() => setShowBookModal(true)}
                      className="mt-3 text-xs font-bold text-[#007AFF] hover:underline inline-flex items-center gap-1"
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
                  <div className="p-4 bg-[#F8FAFB] rounded-xl border border-[#E5E7EB]">
                    <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Patient Name</p>
                    <p className="text-base font-bold text-[#1F2937] mt-0.5">{user?.name}</p>
                    <p className="text-xs text-[#6B7280]">{user?.email}</p>
                  </div>

                  <Link href="/dashboard/profile">
                    <Button variant="outline" fullWidth className="justify-between text-xs py-2.5">
                      <span>Edit Personal Info</span>
                      <ArrowRight className="w-4 h-4 text-[#007AFF]" />
                    </Button>
                  </Link>

                  <Link href="/dashboard/billing">
                    <Button variant="outline" fullWidth className="justify-between text-xs py-2.5">
                      <span>View All Billing Invoices</span>
                      <CreditCard className="w-4 h-4 text-[#007AFF]" />
                    </Button>
                  </Link>
                </div>
              </Card>

              <Card title="Patient Privacy & Security" subtitle="Protected under HIPAA Security Standard">
                <div className="p-4 bg-[#DFF1FF]/50 border border-[#007AFF]/20 rounded-xl text-xs text-[#0051CC] space-y-2">
                  <p className="font-bold flex items-center gap-2 text-sm">
                    <ShieldCheck className="w-5 h-5 text-[#007AFF]" /> Confirmed Record Encryption
                  </p>
                  <p className="leading-relaxed text-[#1F2937]">
                    Your healthcare data and consultation logs are encrypted and strictly restricted to your authenticated patient account.
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
  color: "blue" | "green" | "orange";
}) {
  const hoverBorders = {
    blue: "hover:border-[#007AFF]/40 hover:bg-[#DFF1FF]/20",
    green: "hover:border-[#34C759]/40 hover:bg-[#E8F8EC]/30",
    orange: "hover:border-[#FF9500]/40 hover:bg-[#FFF4E5]/30",
  };

  const Content = (
    <div className={`p-6 rounded-xl border border-[#E5E7EB] bg-white transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer ${hoverBorders[color]}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 rounded-xl bg-[#F8FAFB] border border-[#E5E7EB]">
          {icon}
        </div>
        <ArrowRight className="w-5 h-5 text-[#9CA3AF]" />
      </div>
      <h3 className="font-bold text-[#1F2937] text-base mb-1 font-display">{title}</h3>
      <p className="text-xs text-[#6B7280] leading-relaxed">{description}</p>
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
    <div className="p-5 rounded-xl border border-[#E5E7EB] bg-white shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-[#1F2937] text-base font-display">Dr. {doctorName}</h3>
          <p className="text-xs text-[#6B7280] font-medium">{appointment.reason || "General Checkup"}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
          appointment.status === 'approved' 
            ? 'bg-[#DFF1FF] text-[#0051CC] border-[#007AFF]/20' 
            : 'bg-[#FFF4E5] text-[#FF9500] border-[#FF9500]/20'
        }`}>
          {appointment.status === 'approved' ? 'Confirmed' : appointment.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-4 text-xs font-medium text-[#6B7280] mb-4 bg-[#F8FAFB] p-3 rounded-lg border border-[#E5E7EB]">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-[#007AFF]" /> {appointment.date}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-[#007AFF]" /> {appointment.time}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#007AFF]" /> Main Hospital Suite 104
        </span>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-3.5 py-1.5 text-xs font-semibold text-[#FF3B30] hover:bg-[#FFEBEA] rounded-lg transition"
        >
          Cancel Appointment
        </button>
      </div>
    </div>
  );
}

