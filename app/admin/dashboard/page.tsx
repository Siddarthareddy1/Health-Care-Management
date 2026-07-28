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
  Search,
  Eye,
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
        <div className="space-y-8 font-sans text-[#0F172A] animate-fade-in-up">
          {/* Admin Enterprise Welcome Banner */}
          <div className="bg-gradient-to-r from-white via-indigo-50/40 to-purple-50/40 border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-[#EC4899] border border-pink-200/80 text-xs font-bold font-mono mb-2">
                <ShieldCheck className="w-4 h-4 text-[#EC4899]" />
                <span>System Administration Panel</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-poppins tracking-tight">
                CareFlow Operations & Analytics
              </h1>
              <p className="text-sm text-[#475569] font-medium mt-1">
                Monitor system metrics, manage clinical rosters, and audit user permissions.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Link href="/admin/create-doctor">
                <Button variant="primary" className="gap-2 shadow-md">
                  <UserPlus className="w-4 h-4" /> Provision Doctor
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="gap-2 text-xs py-2.5">
                  <Users className="w-4 h-4 text-[#6366F1]" /> All Accounts
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
              color="indigo"
              change={`${patientCount} Patients`}
            />
            <StatCard
              title="Active Medical Staff"
              value={doctorCount}
              icon={<Stethoscope className="w-6 h-6" />}
              color="purple"
              change="Board Certified"
            />
            <StatCard
              title="Total Consultations"
              value={appointments.length}
              icon={<Calendar className="w-6 h-6" />}
              color="cyan"
              change="System Wide"
            />
            <StatCard
              title="Collected Revenue"
              value={`$${totalRevenue.toLocaleString()}`}
              icon={<DollarSign className="w-6 h-6" />}
              color="pink"
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
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-bold text-xl text-[#0F172A] font-poppins">System Directory & Users</h3>
                  <p className="text-xs text-[#475569]">Filter accounts, audit role states, and view details</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search accounts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 text-xs border border-[#E2E8F0] rounded-xl bg-slate-50 focus:bg-white w-48 focus:w-60 transition-all font-sans"
                    />
                  </div>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="text-xs border border-[#E2E8F0] rounded-xl bg-slate-50 px-3 py-2 font-semibold text-[#0F172A] font-sans"
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
                    <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC] text-xs text-[#475569] uppercase font-bold font-poppins">
                      <th className="py-3.5 px-5">User</th>
                      <th className="py-3.5 px-5">Email</th>
                      <th className="py-3.5 px-5">Role</th>
                      <th className="py-3.5 px-5">Status</th>
                      <th className="py-3.5 px-5 text-right">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9] text-sm text-[#0F172A] font-sans">
                    {paginatedUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-4 px-5 font-bold text-[#0F172A] font-poppins">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                              {u.name ? u.name[0].toUpperCase() : "U"}
                            </div>
                            <span>{u.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-[#475569] font-mono text-xs">{u.email}</td>
                        <td className="py-4 px-5">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              u.role === "admin"
                                ? "bg-pink-50 text-[#EC4899] border border-pink-200"
                                : u.role === "doctor"
                                ? "bg-purple-50 text-[#8B5CF6] border border-purple-200"
                                : "bg-indigo-50 text-[#6366F1] border border-indigo-200"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <span className="px-2.5 py-1 bg-emerald-50 text-[#10B981] text-xs font-bold rounded-full border border-emerald-200 inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Active
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => handleOpenDrawer(u)}
                            className="p-2 text-[#64748B] hover:text-[#6366F1] hover:bg-indigo-50 rounded-xl transition"
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
              <div className="p-4 border-t border-[#F1F5F9] bg-[#F8FAFC] flex justify-between items-center text-xs text-[#475569] font-sans">
                <span>
                  Showing {paginatedUsers.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} - {Math.min(currentPage * rowsPerPage, filteredUsers.length)} of {filteredUsers.length} accounts
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1.5 border border-[#E2E8F0] bg-white rounded-lg disabled:opacity-50 font-semibold cursor-pointer"
                  >
                    Prev
                  </button>
                  <span className="px-3 py-1.5 font-bold text-[#0F172A]">{currentPage} / {totalPages}</span>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 border border-[#E2E8F0] bg-white rounded-lg disabled:opacity-50 font-semibold cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* System Audit Feed */}
            <div className="space-y-6">
              <Card title="System Audit Logs" subtitle="Security & authentication activity feed">
                <div className="space-y-3 pt-2 font-sans">
                  {[
                    { event: "Doctor Account Created", user: "Dr. Sarah Miller", time: "10 mins ago" },
                    { event: "Invoice Paid ($350)", user: "John Doe", time: "1 hour ago" },
                    { event: "Consultation Approved", user: "Dr. James Wilson", time: "3 hours ago" },
                    { event: "HIPAA Security Audit", user: "System", time: "6 hours ago" },
                  ].map((log, idx) => (
                    <div key={idx} className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs flex items-center justify-between">
                      <div>
                        <p className="font-bold text-[#0F172A] font-poppins">{log.event}</p>
                        <p className="text-[#64748B] text-[11px] mt-0.5">{log.user}</p>
                      </div>
                      <span className="text-[10px] text-[#94A3B8] font-mono">{log.time}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="RBAC Security Rules" subtitle="HIPAA Immutability">
                <div className="p-4 bg-indigo-50/60 border border-indigo-200/80 rounded-xl text-xs text-[#0F172A] space-y-2 font-sans">
                  <p className="font-bold flex items-center gap-1.5 text-[#6366F1] font-poppins">
                    <ShieldCheck className="w-4 h-4" /> Firestore Rules Active
                  </p>
                  <p className="leading-relaxed text-[#475569] text-[11px]">
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
