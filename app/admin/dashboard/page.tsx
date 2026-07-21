"use client";

import React from "react";
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
  Activity
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { users } = useUsers();
  const { patients } = usePatients();
  const { appointments } = useAppointments();
  const { bills } = useBills();

  const totalUsers = users.length;
  const doctorCount = users.filter((u) => u.role === "doctor").length;
  const patientCount = users.filter((u) => u.role === "patient").length;
  const adminCount = users.filter((u) => u.role === "admin").length;

  const totalRevenue = bills
    .filter((b) => b.status === "paid")
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <PrivateRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <div className="space-y-6 font-sans text-healthcare-textDark">
          {/* Welcome Banner */}
          <div className="bg-white border border-healthcare-border rounded-standard p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between shadow-subtle gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  System Administrator
                </span>
                <span className="text-xs text-healthcare-textLight font-mono">RBAC Security Mode Active</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-healthcare-textDark font-display tracking-tight mt-1">
                Admin Control Center
              </h1>
              <p className="text-sm text-healthcare-textMedium font-medium mt-1">
                Welcome back, <span className="text-healthcare-primary font-bold">{user?.name}</span>. Manage users, provision doctors, and audit system activities.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Link href="/admin/create-doctor">
                <Button variant="primary" className="gap-2 shadow-sm">
                  <UserPlus className="w-4 h-4" /> Create Doctor Account
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="gap-2">
                  <ShieldCheck className="w-4 h-4" /> User Directory
                </Button>
              </Link>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Total System Users"
              value={totalUsers}
              icon={<Users className="w-6 h-6" />}
              description={`${patientCount} Patients · ${doctorCount} Doctors`}
            />
            <StatCard
              title="Active Doctors"
              value={doctorCount}
              icon={<Stethoscope className="w-6 h-6" />}
              description="Admin Provisioned Staff"
            />
            <StatCard
              title="Total Appointments"
              value={appointments.length}
              icon={<Calendar className="w-6 h-6" />}
              description="System-wide Consultations"
            />
            <StatCard
              title="Total Revenue Collected"
              value={`$${totalRevenue.toLocaleString()}`}
              icon={<DollarSign className="w-6 h-6" />}
              description="Verified Paid Invoices"
            />
          </div>

          {/* Quick Management Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="Doctor Management" subtitle="Provision and review licensed medical staff">
              <div className="space-y-3 pt-2">
                <p className="text-xs text-healthcare-textMedium">
                  Only System Administrators can create Doctor profiles. Doctors receive auto-generated credentials.
                </p>
                <div className="flex flex-col gap-2">
                  <Link href="/admin/create-doctor">
                    <Button variant="primary" fullWidth className="justify-between">
                      <span>Create Doctor Account</span>
                      <UserPlus className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/admin/doctors">
                    <Button variant="outline" fullWidth className="justify-between">
                      <span>View Doctor Roster</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            <Card title="User & Security Audit" subtitle="Inspect user roles and security permissions">
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-3 text-center bg-healthcare-bgSecondary p-3 rounded-standard">
                  <div>
                    <span className="block text-lg font-extrabold text-healthcare-primary">{patientCount}</span>
                    <span className="text-[10px] font-bold text-healthcare-textMedium uppercase">Patients</span>
                  </div>
                  <div>
                    <span className="block text-lg font-extrabold text-healthcare-secondary">{doctorCount}</span>
                    <span className="text-[10px] font-bold text-healthcare-textMedium uppercase">Doctors</span>
                  </div>
                  <div>
                    <span className="block text-lg font-extrabold text-amber-600">{adminCount}</span>
                    <span className="text-[10px] font-bold text-healthcare-textMedium uppercase">Admins</span>
                  </div>
                </div>
                <Link href="/admin/users">
                  <Button variant="outline" fullWidth className="justify-between">
                    <span>Manage User Accounts</span>
                    <ShieldCheck className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>

            <Card title="Security & Compliance" subtitle="HIPAA & Firestore Rules Status">
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-standard text-xs text-emerald-800 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Immutable Roles Enforced
                  </p>
                  <p className="text-[11px] leading-relaxed text-emerald-700">
                    Public signup is restricted strictly to Patients. Users cannot modify role properties.
                  </p>
                </div>
                <Link href="/dashboard/settings">
                  <Button variant="outline" fullWidth className="justify-between">
                    <span>System Settings & Logs</span>
                    <Activity className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* User Roster Overview */}
          <Card title="Recent User Accounts" subtitle="Latest accounts registered in CareFlow">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-healthcare-border bg-healthcare-bgSecondary text-healthcare-textMedium font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">User Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-healthcare-border">
                  {users.slice(0, 6).map((u) => (
                    <tr key={u.id} className="hover:bg-healthcare-bgSecondary/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-healthcare-textDark">{u.name}</td>
                      <td className="py-3 px-4 text-healthcare-textMedium">{u.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.role === "admin"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : u.role === "doctor"
                              ? "bg-purple-100 text-purple-800 border border-purple-200"
                              : "bg-blue-100 text-blue-800 border border-blue-200"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-healthcare-textMedium">{u.phone || "N/A"}</td>
                      <td className="py-3 px-4 text-healthcare-textLight">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    </PrivateRoute>
  );
}
