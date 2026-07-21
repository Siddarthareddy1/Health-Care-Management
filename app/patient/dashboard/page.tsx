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
import { Calendar, DollarSign, PlusCircle, CreditCard, User, HeartPulse } from "lucide-react";

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
  const upcomingCount = myAppointments.filter((a) => a.date >= todayStr && a.status !== "rejected").length;

  return (
    <PrivateRoute allowedRoles={["patient"]}>
      <DashboardLayout>
        <div className="space-y-6 font-sans text-healthcare-textDark">
          {/* Welcome Banner */}
          <div className="bg-white border border-healthcare-border rounded-standard p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between shadow-subtle gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-blue-100 text-blue-800 border border-blue-200">
                  Patient Portal
                </span>
                <span className="text-xs text-healthcare-textLight font-mono">Verified Health Record</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-healthcare-textDark font-display tracking-tight mt-1">
                Welcome, <span className="text-healthcare-primary">{user?.name}</span>
              </h1>
              <p className="text-sm text-healthcare-textMedium font-medium mt-1">
                Manage your consultations, view medical bills, and stay up to date with your checkups.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Button onClick={() => setShowBookModal(true)} variant="primary" className="gap-2 shadow-sm">
                <PlusCircle className="w-4 h-4" /> Book Appointment
              </Button>
              <Link href="/dashboard/billing">
                <Button variant="outline" className="gap-2">
                  <CreditCard className="w-4 h-4" /> My Bills ({pendingBills.length})
                </Button>
              </Link>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard
              title="Upcoming Appointments"
              value={upcomingCount}
              icon={<Calendar className="w-6 h-6" />}
              description="Active Doctor Checkups"
            />
            <StatCard
              title="Pending Invoices"
              value={pendingBills.length}
              icon={<CreditCard className="w-6 h-6" />}
              description={pendingBills.length > 0 ? "Action Required" : "All Accounts Clear"}
            />
            <StatCard
              title="Total Healthcare Expense"
              value={`$${totalSpent.toLocaleString()}`}
              icon={<DollarSign className="w-6 h-6" />}
              description="Paid Consultation Invoices"
            />
          </div>

          {/* Main Dashboard Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
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

            <div className="space-y-6">
              <Card title="Quick Patient Shortcuts" subtitle="Fast access to essential patient functions">
                <div className="space-y-3 pt-2">
                  <Button onClick={() => setShowBookModal(true)} variant="primary" fullWidth className="justify-between">
                    <span>Schedule Consultation</span>
                    <PlusCircle className="w-4 h-4" />
                  </Button>
                  <Link href="/dashboard/billing">
                    <Button variant="outline" fullWidth className="justify-between">
                      <span>View Medical Bills</span>
                      <CreditCard className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/dashboard/profile">
                    <Button variant="outline" fullWidth className="justify-between">
                      <span>Update Patient Profile</span>
                      <User className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </Card>

              <Card title="Patient Safety & Privacy" subtitle="Protected under HIPAA & Role Security">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-standard text-xs text-blue-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4 text-healthcare-primary" /> Confidential Record Access
                  </p>
                  <p className="text-[11px] leading-relaxed text-blue-800">
                    Your medical history and appointments are strictly isolated to your authenticated account.
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* Book Appointment Modal */}
          {showBookModal && (
            <Modal isOpen={true} onClose={() => setShowBookModal(false)} title="Book Doctor Appointment">
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
