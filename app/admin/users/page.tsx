"use client";

import React, { useState } from "react";
import PrivateRoute from "@/components/common/PrivateRoute";
import DashboardLayout from "@/app/dashboard/layout";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Link from "next/link";
import { useUsers } from "@/hooks/useFirestore";
import { ShieldCheck, Search, Filter, UserPlus, ArrowLeft } from "lucide-react";

export default function AdminUsersPage() {
  const { users } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "patient" | "doctor" | "admin">("all");

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <PrivateRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <div className="space-y-6 font-sans text-healthcare-textDark">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/admin/dashboard" className="p-2 border border-healthcare-border rounded-md hover:bg-white text-healthcare-textMedium">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-extrabold font-display text-healthcare-textDark">
                  User Directory & Access Control
                </h1>
                <p className="text-xs text-healthcare-textMedium">
                  System Administrator audit of all registered patients, doctors, and administrators
                </p>
              </div>
            </div>

            <Link href="/admin/create-doctor">
              <Button variant="primary" className="gap-2">
                <UserPlus className="w-4 h-4" /> Provision Doctor
              </Button>
            </Link>
          </div>

          <Card title="User Accounts" subtitle={`Displaying ${filteredUsers.length} of ${users.length} total system accounts`}>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-healthcare-border">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-healthcare-textLight absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-healthcare-border rounded-standard text-xs focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-healthcare-textLight" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="px-3 py-2 border border-healthcare-border rounded-standard text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-healthcare-primary"
                >
                  <option value="all">All Roles</option>
                  <option value="patient">Patients Only</option>
                  <option value="doctor">Doctors Only</option>
                  <option value="admin">Admins Only</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-healthcare-border bg-healthcare-bgSecondary text-healthcare-textMedium font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">User ID</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-healthcare-border">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-healthcare-textLight text-xs">
                        No user accounts match your search query or role filter.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-healthcare-bgSecondary/60 transition-colors">
                        <td className="py-3 px-4 font-mono text-[10px] text-healthcare-textMedium">{u.id}</td>
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    </PrivateRoute>
  );
}
