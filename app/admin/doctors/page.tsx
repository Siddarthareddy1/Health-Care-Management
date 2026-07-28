"use client";

import React, { useState } from "react";
import PrivateRoute from "@/components/common/PrivateRoute";
import DashboardLayout from "@/app/dashboard/layout";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Link from "next/link";
import { useDoctors, useUsers } from "@/hooks/useFirestore";
import { useToast } from "@/hooks/useNotification";
import { toggleUserStatus, deleteDoctorAccount, adminResetUserPassword } from "@/lib/auth";
import { Doctor, User } from "@/types";
import { 
  Stethoscope, 
  UserPlus, 
  Search, 
  Star, 
  ArrowLeft, 
  Key, 
  Power, 
  Trash2, 
  Edit3, 
  CheckCircle,
  Eye
} from "lucide-react";

export default function AdminDoctorsPage() {
  const { doctors, refresh: refreshDoctors, saveDoctor } = useDoctors();
  const { users, refresh: refreshUsers } = useUsers();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [resetModalDoctor, setResetModalDoctor] = useState<{ id: string; email: string; name: string } | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const [editModalDoctor, setEditModalDoctor] = useState<any | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  const [deleteModalDoctor, setDeleteModalDoctor] = useState<{ id: string; name: string } | null>(null);

  const doctorUsers = users.filter((u) => u.role === "doctor");

  const doctorList = doctors.map((docItem) => {
    const userDoc = doctorUsers.find((u) => u.id === docItem.userId || u.id === docItem.id);
    return {
      ...docItem,
      name: userDoc?.name || "Dr. Medical Practitioner",
      email: userDoc?.email || "N/A",
      phone: userDoc?.phone || "N/A",
      status: userDoc?.status || "active",
    };
  });

  const filteredDoctors = doctorList.filter((d) => {
    return (
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Actions
  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === "inactive" ? "active" : "inactive";
      await toggleUserStatus(userId, nextStatus);
      showToast("success", "Status Updated", `Doctor account status set to ${nextStatus.toUpperCase()}`);
      refreshUsers();
    } catch (e: any) {
      showToast("error", "Action Failed", e.message || "Failed to update status");
    }
  };

  const handleAdminResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalDoctor) return;
    if (newPassword.length < 8) {
      showToast("warning", "Invalid Password", "Password must be at least 8 characters");
      return;
    }

    setResetLoading(true);
    try {
      await adminResetUserPassword(resetModalDoctor.email, newPassword);
      showToast("success", "Password Reset", `New password set for Dr. ${resetModalDoctor.name}`);
      setResetModalDoctor(null);
      setNewPassword("");
    } catch (e: any) {
      showToast("error", "Reset Failed", e.message || "Failed to reset password");
    } finally {
      setResetLoading(false);
    }
  };

  const handleSaveEditDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalDoctor) return;
    setEditLoading(true);
    try {
      await saveDoctor(editModalDoctor.userId || editModalDoctor.id, {
        specialization: editModalDoctor.specialization,
        licenseNumber: editModalDoctor.licenseNumber,
        experience: Number(editModalDoctor.experience),
        consultationFee: Number(editModalDoctor.consultationFee),
        bio: editModalDoctor.bio,
      });
      showToast("success", "Doctor Updated", "Medical practitioner details updated successfully.");
      setEditModalDoctor(null);
      refreshDoctors();
    } catch (e: any) {
      showToast("error", "Update Failed", e.message || "Failed to update doctor profile");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteDoctor = async () => {
    if (!deleteModalDoctor) return;
    try {
      await deleteDoctorAccount(deleteModalDoctor.id);
      showToast("success", "Doctor Account Removed", `Account for ${deleteModalDoctor.name} has been deleted.`);
      setDeleteModalDoctor(null);
      refreshUsers();
      refreshDoctors();
    } catch (e: any) {
      showToast("error", "Delete Failed", e.message || "Failed to delete doctor account");
    }
  };

  return (
    <PrivateRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <div className="space-y-6 font-sans text-slate-900 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/admin/dashboard" className="p-2 border border-slate-200 rounded-xl hover:bg-white text-slate-600 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-extrabold font-poppins text-slate-900 tracking-tight">
                  Medical Practitioners Roster
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Manage doctor profiles, reset passwords, and audit account status
                </p>
              </div>
            </div>

            <Link href="/admin/create-doctor">
              <Button variant="primary" className="gap-2 shadow-md">
                <UserPlus className="w-4 h-4" /> Provision Doctor Account
              </Button>
            </Link>
          </div>

          <Card title="Licensed Doctor Roster" subtitle={`Showing ${filteredDoctors.length} doctors`}>
            {/* Search filter */}
            <div className="mb-4 pb-4 border-b border-[#F1F5F9] max-w-md">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search doctors by name, specialization, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>
            </div>

            {/* Doctors Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC] text-slate-600 font-bold uppercase text-[10px] font-poppins">
                    <th className="py-3.5 px-4">Doctor Name</th>
                    <th className="py-3.5 px-4">Specialization</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">License #</th>
                    <th className="py-3.5 px-4">Fee</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredDoctors.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400 text-xs font-medium">
                        No doctor profiles match your query.
                      </td>
                    </tr>
                  ) : (
                    filteredDoctors.map((d) => (
                      <tr key={d.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 font-poppins">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                              <Stethoscope className="w-4 h-4" />
                            </div>
                            <span>{d.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#6366F1]">{d.specialization}</td>
                        <td className="py-3.5 px-4 text-slate-500 font-mono">{d.email}</td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleStatus(d.userId || d.id, d.status)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase cursor-pointer transition ${
                              d.status === "inactive"
                                ? "bg-rose-50 text-red-600 border-red-200"
                                : "bg-emerald-50 text-emerald-600 border-emerald-200"
                            }`}
                            title="Click to toggle account status"
                          >
                            {d.status || "active"}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{d.licenseNumber || "LIC-PENDING"}</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-600">${d.consultationFee}</td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Reset Password */}
                            <button
                              onClick={() => setResetModalDoctor({ id: d.userId || d.id, email: d.email, name: d.name })}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                              title="Reset Password"
                            >
                              <Key size={15} />
                            </button>

                            {/* Edit Details */}
                            <button
                              onClick={() => setEditModalDoctor(d)}
                              className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                              title="Edit Doctor Profile"
                            >
                              <Edit3 size={15} />
                            </button>

                            {/* Toggle Status */}
                            <button
                              onClick={() => handleToggleStatus(d.userId || d.id, d.status)}
                              className={`p-1.5 rounded-lg transition ${
                                d.status === "inactive" ? "text-emerald-600 hover:bg-emerald-50" : "text-amber-600 hover:bg-amber-50"
                              }`}
                              title={d.status === "inactive" ? "Enable Account" : "Disable Account"}
                            >
                              <Power size={15} />
                            </button>

                            {/* Delete Doctor */}
                            <button
                              onClick={() => setDeleteModalDoctor({ id: d.userId || d.id, name: d.name })}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete Account"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Reset Password Modal */}
          {resetModalDoctor && (
            <Modal
              isOpen={true}
              onClose={() => setResetModalDoctor(null)}
              title={`Reset Password for Dr. ${resetModalDoctor.name}`}
            >
              <form onSubmit={handleAdminResetPassword} className="space-y-4 font-sans text-slate-900">
                <p className="text-xs text-slate-500">
                  Assign a new password for <span className="font-bold text-slate-900 font-mono">{resetModalDoctor.email}</span>.
                </p>
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">
                    New Password (min 8 chars)
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setResetModalDoctor(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" loading={resetLoading}>
                    Set New Password
                  </Button>
                </div>
              </form>
            </Modal>
          )}

          {/* Edit Doctor Modal */}
          {editModalDoctor && (
            <Modal
              isOpen={true}
              onClose={() => setEditModalDoctor(null)}
              title={`Edit Details: Dr. ${editModalDoctor.name}`}
            >
              <form onSubmit={handleSaveEditDoctor} className="space-y-4 font-sans text-slate-900">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">Specialization</label>
                    <input
                      type="text"
                      value={editModalDoctor.specialization || ""}
                      onChange={(e) => setEditModalDoctor({ ...editModalDoctor, specialization: e.target.value })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">License Number</label>
                    <input
                      type="text"
                      value={editModalDoctor.licenseNumber || ""}
                      onChange={(e) => setEditModalDoctor({ ...editModalDoctor, licenseNumber: e.target.value })}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">Years of Experience</label>
                    <input
                      type="number"
                      value={editModalDoctor.experience || 0}
                      onChange={(e) => setEditModalDoctor({ ...editModalDoctor, experience: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">Consultation Fee ($)</label>
                    <input
                      type="number"
                      value={editModalDoctor.consultationFee || 0}
                      onChange={(e) => setEditModalDoctor({ ...editModalDoctor, consultationFee: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">Biography</label>
                  <textarea
                    rows={3}
                    value={editModalDoctor.bio || ""}
                    onChange={(e) => setEditModalDoctor({ ...editModalDoctor, bio: e.target.value })}
                    className="w-full"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setEditModalDoctor(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" loading={editLoading}>
                    Save Doctor Details
                  </Button>
                </div>
              </form>
            </Modal>
          )}

          {/* Delete Doctor Modal */}
          {deleteModalDoctor && (
            <Modal
              isOpen={true}
              onClose={() => setDeleteModalDoctor(null)}
              title="Delete Doctor Account"
            >
              <div className="space-y-4 font-sans text-slate-900">
                <p className="text-sm text-slate-600">
                  Are you sure you want to permanently delete the doctor account for <span className="font-bold text-slate-900">{deleteModalDoctor.name}</span>? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setDeleteModalDoctor(null)}>
                    Cancel
                  </Button>
                  <Button type="button" variant="danger" onClick={handleDeleteDoctor}>
                    Delete Account
                  </Button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      </DashboardLayout>
    </PrivateRoute>
  );
}
