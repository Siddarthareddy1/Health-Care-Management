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
  Filter,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
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

  return (
    <PrivateRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <div className="space-y-8 font-sans text-[#1F2937] animate-fade-in-up">
          {/* Admin Header Banner */}
          <div className="bg-gradient-to-r from-white via-[#F8FAFB] to-[#F3E8FF]/50 border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3E8FF] text-[#6D28D9] border border-[#8B5CF6]/20 text-xs font-semibold mb-2">
                <span>⚙️ System Administrator</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-ping" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] font-display tracking-tight">
                Admin Dashboard ⚙️
              </h1>
              <p className="text-sm text-[#6B7280] font-medium mt-1">
                System overview and clinical resource management.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Link href="/admin/create-doctor">
                <Button variant="primary" className="bg-[#8B5CF6] hover:bg-[#7C3AED] focus:ring-[#8B5CF6]/20 gap-2">
                  <UserPlus className="w-4 h-4" /> Create Doctor Account
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" /> User Roster
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total System Users"
              value={totalUsers}
              icon={<Users className="w-6 h-6" />}
              color="blue"
              change="+12% Active"
            />
            <StatCard
              title="Total Doctors"
              value={doctorCount}
              icon={<Stethoscope className="w-6 h-6" />}
              color="green"
              change="Staff Roster"
            />
            <StatCard
              title="Total Appointments"
              value={appointments.length}
              icon={<Calendar className="w-6 h-6" />}
              color="orange"
              change="Total Booked"
            />
            <StatCard
              title="System Health"
              value="99.8%"
              icon={<Activity className="w-6 h-6" />}
              color="red"
              change="↑ Online"
            />
          </div>

          {/* Management Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AdminSectionCard
              title="User Management"
              description="View and manage all registered system users"
              action="Manage Users"
              href="/admin/users"
              color="blue"
            />
            <AdminSectionCard
              title="Doctor Roster"
              description="Manage doctor profiles and specializations"
              action="Manage Doctors"
              href="/admin/doctors"
              color="green"
            />
            <AdminSectionCard
              title="Create Doctor"
              description="Provision new medical practitioner account"
              action="Create Doctor"
              href="/admin/create-doctor"
              color="purple"
              isPrimary={true}
            />
            <AdminSectionCard
              title="System Reports"
              description="View audit logs, compliance and financial metrics"
              action="View Reports"
              href="/dashboard/billing"
              color="orange"
            />
          </div>

          {/* Data Table Component */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden font-sans">
            <div className="p-6 border-b border-[#E5E7EB]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-bold text-xl text-[#1F2937] font-display">System Directory & Users</h3>
                  <p className="text-xs text-[#6B7280]">Inspect accounts, active roles, and authorization states</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 text-xs border border-[#E5E7EB] rounded-lg bg-[#F8FAFB] focus:bg-white w-48 focus:w-60 transition-all"
                    />
                  </div>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="text-xs border border-[#E5E7EB] rounded-lg bg-[#F8FAFB] px-3 py-2 font-semibold text-[#1F2937]"
                  >
                    <option value="all">All Roles</option>
                    <option value="patient">Patients</option>
                    <option value="doctor">Doctors</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F8FAFB] text-xs text-[#6B7280] uppercase font-semibold">
                    <th className="py-3.5 px-5">Name</th>
                    <th className="py-3.5 px-5">Email</th>
                    <th className="py-3.5 px-5">Role</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-sm text-[#1F2937]">
                  {paginatedUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#F8FAFB] transition-colors">
                      <td className="py-4 px-5 font-bold text-[#1F2937]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#F3E8FF] text-[#6D28D9] font-bold text-xs flex items-center justify-center border border-[#8B5CF6]/20">
                            {u.name ? u.name[0].toUpperCase() : "U"}
                          </div>
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-[#6B7280] font-mono text-xs">{u.email}</td>
                      <td className="py-4 px-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                            u.role === "admin"
                              ? "bg-[#F3E8FF] text-[#6D28D9] border-[#8B5CF6]/20"
                              : u.role === "doctor"
                              ? "bg-[#FFE5E5] text-[#C41C3B] border-[#FF6B6B]/20"
                              : "bg-[#DFF1FF] text-[#0051CC] border-[#007AFF]/20"
                          }`}
                        >
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="px-2.5 py-1 bg-[#E8F8EC] text-[#34C759] text-xs font-semibold rounded-full border border-[#34C759]/20 inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]" /> Active
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button className="p-1.5 text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F8FAFB] rounded-lg transition">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 border-t border-[#E5E7EB] bg-[#F8FAFB] flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-[#6B7280] gap-3">
              <span>
                Showing {paginatedUsers.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} - {Math.min(currentPage * rowsPerPage, filteredUsers.length)} of {filteredUsers.length} users
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1.5 border border-[#E5E7EB] bg-white rounded-lg disabled:opacity-50 font-semibold hover:bg-[#F8FAFB]"
                >
                  Prev
                </button>
                <span className="px-3 py-1.5 font-bold text-[#1F2937]">{currentPage} / {totalPages}</span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 border border-[#E5E7EB] bg-white rounded-lg disabled:opacity-50 font-semibold hover:bg-[#F8FAFB]"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </PrivateRoute>
  );
}

// Admin Section Card
function AdminSectionCard({ title, description, action, href, color, isPrimary = false }: {
  title: string;
  description: string;
  action: string;
  href: string;
  color: "blue" | "green" | "purple" | "orange";
  isPrimary?: boolean;
}) {
  return (
    <div className={`p-6 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between ${
      isPrimary
        ? "bg-[#8B5CF6] text-white border-[#8B5CF6]"
        : "bg-white border-[#E5E7EB] hover:border-[#8B5CF6]/30"
    }`}>
      <div>
        <h3 className={`font-bold text-lg font-display mb-1 ${isPrimary ? "text-white" : "text-[#1F2937]"}`}>{title}</h3>
        <p className={`text-xs leading-relaxed ${isPrimary ? "text-white/80" : "text-[#6B7280]"}`}>{description}</p>
      </div>

      <div className="mt-6 pt-4 border-t border-current/10">
        <Link href={href}>
          <Button
            variant={isPrimary ? "secondary" : "outline"}
            fullWidth
            className={`justify-between text-xs py-2.5 ${
              isPrimary ? "border-white/40 text-white hover:bg-white/10" : ""
            }`}
          >
            <span>{action}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

