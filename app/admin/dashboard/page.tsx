"use client";

import React, { useState } from "react";
import PrivateRoute from "@/components/common/PrivateRoute";
import DashboardLayout from "@/app/dashboard/layout";
import StatCard from "@/components/dashboard/StatCard";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useUsers, usePatients, useAppointments, useBills } from "@/hooks/useFirestore";
import { RevenueChart, SpecialtyChart } from "@/components/dashboard/Charts";
import PatientDetailDrawer from "@/components/dashboard/PatientDetailDrawer";
import { User } from "@/types";
import { 
  Users, 
  Stethoscope, 
  ShieldCheck, 
  UserPlus, 
  DollarSign, 
  Calendar, 
  ArrowRight,
  Activity,
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  FileSpreadsheet
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { users } = useUsers();
  const { patients } = usePatients();
  const { appointments } = useAppointments();
  const { bills } = useBills();

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const rowsPerPage = 5;

  const totalUsers = users.length;
  const doctorCount = users.filter((u) => u.role === "doctor").length;
  const patientCount = users.filter((u) => u.role === "patient").length;

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const totalRevenue = bills
    .filter((b) => b.status === "paid")
    .reduce((sum, b) => sum + b.amount, 0);

  const handleOpenDrawer = (u: User) => {
    setSelectedPatient(u);
    setIsDrawerOpen(true);
  };

  return (
    <PrivateRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <div className="space-y-8 font-sans text-slate-900 animate-fade-in-up">
          {/* Admin Enterprise Welcome Banner */}
          <div className="bg-gradient-to-r from-white via-slate-50 to-indigo-50/50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-xs font-bold mb-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>System Administration Panel</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
                CareFlow Operations & Analytics
              </h1>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Monitor system metrics, manage clinical rosters, and audit user permissions.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Link href="/admin/create-doctor">
                <Button variant="primary" className="bg-indigo-600 hover:bg-indigo-700 gap-2 shadow-sm">
                  <UserPlus className="w-4 h-4" /> Provision Doctor
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="gap-2 text-xs py-2.5">
                  <Users className="w-4 h-4 text-indigo-600" /> All Accounts
                </Button>
              </Link>
            </div>
          </div>

          {/* Key Analytics KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Registered Accounts"
              value={totalUsers}
              icon={<Users className="w-6 h-6" />}
              color="blue"
              change={`${patientCount} Patients`}
            />
            <StatCard
              title="Active Medical Staff"
              value={doctorCount}
              icon={<Stethoscope className="w-6 h-6" />}
              color="green"
              change="Board Certified"
            />
            <StatCard
              title="Total Consultations"
              value={appointments.length}
              icon={<Calendar className="w-6 h-6" />}
              color="orange"
              change="System Wide"
            />
            <StatCard
              title="Collected Revenue"
              value={`$${totalRevenue.toLocaleString()}`}
              icon={<DollarSign className="w-6 h-6" />}
              color="purple"
              change="Paid Invoices"
            />
          </div>

          {/* Recharts Analytics Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Monthly Revenue Analytics" subtitle="Financial invoice collections over time">
              <div className="pt-2">
                <RevenueChart />
              </div>
            </Card>

            <Card title="Patient Specialty Distribution" subtitle="Consultation volume grouped by department">
              <div className="pt-2">
                <SpecialtyChart />
              </div>
            </Card>
          </div>

          {/* Audit Log Feed & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Directory Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-bold text-xl text-slate-900 font-display">System Directory & Users</h3>
                  <p className="text-xs text-slate-500">Filter accounts, audit role states, and view details</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search accounts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white w-48 focus:w-60 transition-all"
                    />
                  </div>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="text-xs border border-slate-200 rounded-xl bg-slate-50 px-3 py-2 font-semibold text-slate-700"
                  >
                    <option value="all">All Roles</option>
                    <option value="patient">Patients</option>
                    <option value="doctor">Doctors</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-xs text-slate-500 uppercase font-semibold">
                      <th className="py-3.5 px-5">User</th>
                      <th className="py-3.5 px-5">Email</th>
                      <th className="py-3.5 px-5">Role</th>
                      <th className="py-3.5 px-5">Status</th>
                      <th className="py-3.5 px-5 text-right">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-800">
                    {paginatedUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-5 font-bold text-slate-900">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center border border-teal-200/80">
                              {u.name ? u.name[0].toUpperCase() : "U"}
                            </div>
                            <span>{u.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-slate-500 font-mono text-xs">{u.email}</td>
                        <td className="py-4 px-5">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                              u.role === "admin"
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200/80"
                                : u.role === "doctor"
                                ? "bg-sky-50 text-sky-700 border-sky-200/80"
                                : "bg-teal-50 text-teal-700 border-teal-200/80"
                            }`}
                          >
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200/80 inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => handleOpenDrawer(u)}
                            className="p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition"
                            title="Inspect File"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex justify-between items-center text-xs text-slate-500">
                <span>
                  Showing {paginatedUsers.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} - {Math.min(currentPage * rowsPerPage, filteredUsers.length)} of {filteredUsers.length} accounts
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg disabled:opacity-50 font-semibold"
                  >
                    Prev
                  </button>
                  <span className="px-3 py-1.5 font-bold text-slate-700">{currentPage} / {totalPages}</span>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg disabled:opacity-50 font-semibold"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* System Audit Feed */}
            <div className="space-y-6">
              <Card title="System Audit Logs" subtitle="Security & authentication activity feed">
                <div className="space-y-3 pt-2">
                  {[
                    { event: "Doctor Account Created", user: "Dr. Sarah Miller", time: "10 mins ago", type: "create" },
                    { event: "Invoice Paid ($350)", user: "John Doe", time: "1 hour ago", type: "payment" },
                    { event: "Consultation Approved", user: "Dr. James Wilson", time: "3 hours ago", type: "approved" },
                    { event: "HIPAA Security Audit", user: "System", time: "6 hours ago", type: "audit" },
                  ].map((log, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{log.event}</p>
                        <p className="text-[#64748B] text-[11px] mt-0.5">{log.user}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{log.time}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="RBAC Security Rules" subtitle="HIPAA Immutability">
                <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-xl text-xs text-teal-800 space-y-2">
                  <p className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-600" /> Firestore Rules Active
                  </p>
                  <p className="leading-relaxed text-slate-600 text-[11px]">
                    User role fields are restricted against client-side mutation. Admin override requires elevated token authorization.
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* Slide-over Patient Drawer */}
          <PatientDetailDrawer
            patient={selectedPatient}
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          />
        </div>
      </DashboardLayout>
    </PrivateRoute>
  );
}


