"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { 
  useAppointments, 
  usePatients, 
  useBills, 
  useUsers, 
  useActivityLogs 
} from "@/hooks/useFirestore";
import { useToast } from "@/hooks/useNotification";
import StatCard from "@/components/dashboard/StatCard";
import RecentAppointments from "@/components/dashboard/RecentAppointments";
import { RevenueChart, SpecialtyChart } from "@/components/dashboard/Charts";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import AppointmentForm from "@/components/forms/AppointmentForm";
import PatientForm from "@/components/forms/PatientForm";
import BillForm from "@/components/forms/BillForm";
import { 
  Users, 
  Calendar, 
  DollarSign, 
  FileText, 
  PlusCircle, 
  FolderHeart, 
  ArrowRight,
  ClipboardList
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const { appointments, updateAppStatus, refresh: refreshApps } = useAppointments();
  const { patients, refresh: refreshPatients } = usePatients();
  const { bills, refresh: refreshBills } = useBills();
  const { users, refresh: refreshUsers } = useUsers();
  const { logs, refresh: refreshLogs } = useActivityLogs();
  const { showToast } = useToast();

  const [activeModal, setActiveModal] = useState<"book" | "patient" | "bill" | null>(null);

  // Calculations
  const todayStr = new Date().toISOString().split("T")[0];
  
  // Admin stats
  const totalPatients = patients.length;
  const appointmentsToday = appointments.filter(a => a.date === todayStr).length;
  const pendingBillsCount = bills.filter(b => b.status === "pending").length;
  const totalRevenue = bills
    .filter(b => b.status === "paid")
    .reduce((sum, b) => sum + b.amount, 0);

  // Doctor stats
  const doctorAppointments = appointments.filter(a => a.doctorId === user?.id);
  const doctorAppointmentsToday = doctorAppointments.filter(a => a.date === todayStr).length;
  
  // Patient stats
  const patientAppointments = appointments.filter(a => a.patientId === user?.id);
  const patientBills = bills.filter(b => b.patientId === user?.id);
  const patientPendingBills = patientBills.filter(b => b.status === "pending");
  const patientPendingBillsCount = patientPendingBills.length;
  const patientTotalSpent = patientBills
    .filter(b => b.status === "paid")
    .reduce((sum, b) => sum + b.amount, 0);

  const handleUpdateStatus = async (id: string, status: "scheduled" | "completed" | "cancelled") => {
    if (status === "scheduled") return;
    try {
      await updateAppStatus(id, { status });
      showToast("success", `Appointment ${status === 'completed' ? 'Completed' : 'Cancelled'}`, `Appointment status has been updated successfully.`);
      refreshApps();
      refreshBills();
    } catch (e: any) {
      showToast("error", "Action Failed", e.message || "Failed to update appointment");
    }
  };

  return (
    <div className="space-y-6 font-sans text-healthcare-textDark">
      {/* Welcome Banner */}
      <div className="bg-white border border-healthcare-border rounded-standard p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between shadow-subtle gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-healthcare-textDark font-display tracking-tight">
            Welcome Back, <span className="text-healthcare-primary">{user?.name}</span>
          </h1>
          <p className="text-sm text-healthcare-textMedium font-medium mt-1">
            Role: <span className="uppercase font-mono text-xs px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-healthcare-primary font-bold">{user?.role}</span> · Clinic Portal is online and synchronized.
          </p>
        </div>
        
        {/* Quick Actions depending on role */}
        <div className="flex items-center gap-2 flex-wrap">
          {user?.role === "patient" && (
            <>
              <Button onClick={() => setActiveModal("book")} variant="primary" className="gap-2">
                <PlusCircle className="w-4 h-4" /> Book Appointment
              </Button>
              <Link href="/dashboard/billing">
                <Button variant="outline" className="gap-2">
                  <DollarSign className="w-4 h-4" /> View Bills
                </Button>
              </Link>
            </>
          )}
          {user?.role === "doctor" && (
            <>
              <Link href="/dashboard/appointments">
                <Button variant="primary" className="gap-2">
                  <Calendar className="w-4 h-4" /> Check Availability
                </Button>
              </Link>
              <Link href="/dashboard/patients">
                <Button variant="outline" className="gap-2">
                  <Users className="w-4 h-4" /> Patients Directory
                </Button>
              </Link>
            </>
          )}
          {user?.role === "admin" && (
            <>
              <Button onClick={() => setActiveModal("patient")} variant="primary" className="gap-2">
                <PlusCircle className="w-4 h-4" /> Register Patient
              </Button>
              <Button onClick={() => setActiveModal("bill")} variant="outline" className="gap-2">
                <PlusCircle className="w-4 h-4" /> Raise Invoice
              </Button>
            </>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {user?.role === "admin" && (
          <>
            <StatCard title="Total Patients" value={totalPatients} icon={<Users className="w-5 h-5" />} description="Registered patients" />
            <StatCard title="Appointments Today" value={appointmentsToday} icon={<Calendar className="w-5 h-5" />} description="Scheduled visits" />
            <StatCard title="Pending Invoices" value={pendingBillsCount} icon={<FileText className="w-5 h-5" />} description="Unpaid bill records" />
            <StatCard title="Total Revenue" value={`$${totalRevenue}`} icon={<DollarSign className="w-5 h-5" />} description="Accumulated payments" />
          </>
        )}
        {user?.role === "doctor" && (
          <>
            <StatCard title="My Patients" value={patients.length} icon={<Users className="w-5 h-5" />} description="Assigned patients list" />
            <StatCard title="Appointments Today" value={doctorAppointmentsToday} icon={<Calendar className="w-5 h-5" />} description="Pending checkups" />
            <StatCard title="Total Sessions" value={doctorAppointments.length} icon={<ClipboardList className="w-5 h-5" />} description="Scheduled history" />
            <StatCard title="Consultation Fee" value={`$${patients.length > 0 ? "150" : "0"}`} icon={<DollarSign className="w-5 h-5" />} description="Base charge per session" />
          </>
        )}
        {user?.role === "patient" && (
          <>
            <StatCard title="My Appointments" value={patientAppointments.length} icon={<Calendar className="w-5 h-5" />} description="Booked visits count" />
            <StatCard title="Pending Bills" value={patientPendingBillsCount} icon={<FileText className="w-5 h-5" />} description="Awaiting checkout" />
            <StatCard title="Total Payments" value={`$${patientTotalSpent}`} icon={<DollarSign className="w-5 h-5" />} description="Paid clinic statements" />
            <StatCard title="Active Allergy Flags" value={patients.find(p => p.userId === user.id)?.allergies.length || 0} icon={<FolderHeart className="w-5 h-5" />} description="Critical medical flags" />
          </>
        )}
      </div>

      {/* Analytics Charts (Admins/Doctors see summaries) */}
      {user?.role !== "patient" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Monthly Revenue Streams" subtitle="Total earnings compiled from cleared invoices">
            <RevenueChart />
          </Card>
          <Card title="Appointments by Medical Specialty" subtitle="Volume allocation by hospital departments">
            <SpecialtyChart />
          </Card>
        </div>
      )}

      {/* Recent Appointments & System Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card 
            title="Clinic Schedule Status" 
            subtitle="Immediate upcoming consultations queue"
            actions={
              <Link href="/dashboard/appointments" className="text-xs text-healthcare-accent hover:underline font-bold flex items-center gap-1">
                View Calendar Grid <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            <RecentAppointments 
              appointments={
                user?.role === "admin" 
                  ? appointments.slice(0, 5) 
                  : user?.role === "doctor" 
                    ? doctorAppointments.slice(0, 5) 
                    : patientAppointments.slice(0, 5)
              }
              users={users}
              onUpdateStatus={handleUpdateStatus}
              role={user?.role || "patient"}
            />
          </Card>
        </div>

        {/* Activity Logs (Admin) or Health Tips (Patients) */}
        <div>
          {user?.role === "admin" ? (
            <Card title="System Activity Logs" subtitle="Audit logs of recent clinical events">
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                {logs.length === 0 ? (
                  <p className="text-xs text-healthcare-textLight py-4 text-center">No system operations logged.</p>
                ) : (
                  logs.slice(0, 6).map((log) => (
                    <div key={log.id} className="text-xs border-b border-healthcare-border pb-3 last:border-0">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-healthcare-textDark font-display">{log.userName}</span>
                        <span className="text-[10px] text-healthcare-textLight font-mono">
                          {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-healthcare-primary uppercase tracking-wider mt-0.5">{log.action}</p>
                      <p className="text-healthcare-textMedium mt-1 font-medium leading-relaxed">{log.details}</p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          ) : (
            <Card title="Patient Safety Advisory" subtitle="Standard clinical recommendations">
              <div className="space-y-4 text-xs font-medium text-healthcare-textMedium leading-relaxed">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-standard">
                  <h4 className="font-bold text-healthcare-primary font-display mb-1">Pre-visit Protocols</h4>
                  <p>Please arrive 15 minutes before scheduled slots. Ensure you have emergency contact information verified inside your Profile settings.</p>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-standard">
                  <h4 className="font-bold text-healthcare-success font-display mb-1">Invoicing Payments</h4>
                  <p>Invoices raised from consultations can be settled via Cash, Credit Cards, or credited to Insurance plans. Check the &apos;My Bills&apos; menu.</p>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-standard">
                  <h4 className="font-bold text-healthcare-warning font-display mb-1">Allergy Notifications</h4>
                  <p>Ensure any penicillin or dietary hypersensitivity conditions are flagged by medical attendants to append them to your records index.</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Forms Modals */}
      <Modal isOpen={activeModal === "book"} onClose={() => setActiveModal(null)} title="Schedule Consultation">
        <AppointmentForm patientId={user?.id || ""} onSuccess={() => { setActiveModal(null); refreshApps(); }} />
      </Modal>
      <Modal isOpen={activeModal === "patient"} onClose={() => setActiveModal(null)} title="Register Offline Patient Profile">
        <PatientForm patientId={`offline-${Date.now()}`} onSuccess={() => { setActiveModal(null); refreshPatients(); }} />
      </Modal>
      <Modal isOpen={activeModal === "bill"} onClose={() => setActiveModal(null)} title="Raise New Billing Invoice">
        <BillForm onSuccess={() => { setActiveModal(null); refreshBills(); }} />
      </Modal>
    </div>
  );
}
