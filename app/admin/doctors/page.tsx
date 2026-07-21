"use client";

import React, { useState } from "react";
import PrivateRoute from "@/components/common/PrivateRoute";
import DashboardLayout from "@/app/dashboard/layout";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Link from "next/link";
import { useDoctors, useUsers } from "@/hooks/useFirestore";
import { Stethoscope, UserPlus, Search, Star, ArrowLeft } from "lucide-react";

export default function AdminDoctorsPage() {
  const { doctors } = useDoctors();
  const { users } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");

  const doctorUsers = users.filter((u) => u.role === "doctor");

  const doctorList = doctors.map((docItem) => {
    const userDoc = doctorUsers.find((u) => u.id === docItem.userId || u.id === docItem.id);
    return {
      ...docItem,
      name: userDoc?.name || "Dr. Medical Practitioner",
      email: userDoc?.email || "N/A",
      phone: userDoc?.phone || "N/A",
    };
  });

  const filteredDoctors = doctorList.filter((d) => {
    return (
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
                  Medical Practitioners Roster
                </h1>
                <p className="text-xs text-healthcare-textMedium">
                  Overview of all licensed doctors provisioned in the system
                </p>
              </div>
            </div>

            <Link href="/admin/create-doctor">
              <Button variant="primary" className="gap-2">
                <UserPlus className="w-4 h-4" /> Provision New Doctor
              </Button>
            </Link>
          </div>

          <Card title="Licensed Doctor Roster" subtitle={`Showing ${filteredDoctors.length} doctors`}>
            {/* Search filter */}
            <div className="mb-4 pb-4 border-b border-healthcare-border max-w-md">
              <div className="relative">
                <Search className="w-4 h-4 text-healthcare-textLight absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search doctors by name, specialization, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-healthcare-border rounded-standard text-xs focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white"
                />
              </div>
            </div>

            {/* Doctors Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-healthcare-border bg-healthcare-bgSecondary text-healthcare-textMedium font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Doctor Name</th>
                    <th className="py-3 px-4">Specialization</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">License #</th>
                    <th className="py-3 px-4">Experience</th>
                    <th className="py-3 px-4">Fee</th>
                    <th className="py-3 px-4">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-healthcare-border">
                  {filteredDoctors.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-healthcare-textLight text-xs">
                        No doctor profiles match your query.
                      </td>
                    </tr>
                  ) : (
                    filteredDoctors.map((d) => (
                      <tr key={d.id} className="hover:bg-healthcare-bgSecondary/60 transition-colors">
                        <td className="py-3 px-4 font-bold text-healthcare-textDark flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                            <Stethoscope className="w-3.5 h-3.5" />
                          </div>
                          <span>{d.name}</span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-healthcare-primary">{d.specialization}</td>
                        <td className="py-3 px-4 text-healthcare-textMedium">{d.email}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-healthcare-textMedium">{d.licenseNumber || "LIC-PENDING"}</td>
                        <td className="py-3 px-4 text-healthcare-textMedium">{d.experience} Years</td>
                        <td className="py-3 px-4 font-bold text-emerald-700">${d.consultationFee}</td>
                        <td className="py-3 px-4 font-bold text-amber-600 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{d.rating || 5.0}</span>
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
