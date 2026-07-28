"use client";

import React, { useState } from "react";
import PrivateRoute from "@/components/common/PrivateRoute";
import DashboardLayout from "@/app/dashboard/layout";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useNotification";
import { createDoctorAccount } from "@/lib/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateDoctorSchema } from "@/lib/validators";
import { z } from "zod";
import { Stethoscope, UserPlus, Copy, CheckCircle, ShieldAlert, ArrowLeft, Key, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

type CreateDoctorInputs = z.infer<typeof CreateDoctorSchema>;

const SPECIALIZATIONS = [
  "General Medicine",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "Gynecology & Obstetrics",
  "Oncology",
  "Psychiatry",
  "Ophthalmology",
  "ENT (Ear, Nose, Throat)"
];

export default function CreateDoctorPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Credentials Modal State
  const [createdCredentials, setCreatedCredentials] = useState<{
    email: string;
    name: string;
    passwordAssigned: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDoctorInputs>({
    resolver: zodResolver(CreateDoctorSchema),
    defaultValues: {
      specialization: "General Medicine",
      experience: 5,
      consultationFee: 100,
    },
  });

  const onSubmit = async (data: CreateDoctorInputs) => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await createDoctorAccount(user.id, data);
      setCreatedCredentials({
        email: data.email,
        name: data.name,
        passwordAssigned: result.passwordAssigned,
      });
      showToast("success", "Doctor Account Provisioned", `Dr. ${data.name} has been added successfully.`);
      reset();
    } catch (e: any) {
      showToast("error", "Creation Failed", e.message || "Failed to create doctor account.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCredentials = () => {
    if (!createdCredentials) return;
    const textToCopy = `CareFlow Doctor Credentials:\nName: Dr. ${createdCredentials.name}\nEmail: ${createdCredentials.email}\nAssigned Password: ${createdCredentials.passwordAssigned}\nLogin Portal: ${window.location.origin}/auth/login`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    showToast("success", "Copied", "Doctor credentials copied to clipboard!");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <PrivateRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6 font-sans text-slate-900 animate-fade-in-up">
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/admin/dashboard" className="p-2 border border-slate-200 rounded-xl hover:bg-white text-slate-600 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-extrabold font-poppins text-slate-900 tracking-tight">
                  Provision Doctor Account
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Admin Exclusive · Create doctor profile and login credentials
                </p>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900 font-poppins">Privileged Admin Action</p>
              <p className="mt-0.5 text-amber-800 leading-relaxed font-sans">
                Set a secure email and password for the new doctor. Once created, the doctor can log into the portal using these credentials and optionally update their password in profile settings.
              </p>
            </div>
          </div>

          {/* Create Doctor Form */}
          <Card title="Doctor Profile & Credential Setup" subtitle="Enter practitioner information and assigned login password">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">
                    Doctor Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Dr. Sarah Jenkins"
                    className={`w-full ${errors.name ? "!border-red-500" : ""}`}
                    {...register("name")}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">
                    Official Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="doctor@healthcare.com"
                    className={`w-full ${errors.email ? "!border-red-500" : ""}`}
                    {...register("email")}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.email.message}</p>}
                </div>
              </div>

              {/* Password & Confirm Password Section */}
              <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-indigo-700 font-poppins text-xs font-bold uppercase tracking-wider">
                  <Key className="w-4 h-4" /> Doctor Login Credentials Setup
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">
                      Assigned Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`w-full pr-10 ${errors.password ? "!border-red-500" : ""}`}
                        {...register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.password.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`w-full pr-10 ${errors.confirmPassword ? "!border-red-500" : ""}`}
                        {...register("confirmPassword")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.confirmPassword.message}</p>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="9876543211"
                    className={`w-full ${errors.phone ? "!border-red-500" : ""}`}
                    {...register("phone")}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">
                    Medical Specialization *
                  </label>
                  <select
                    className="w-full"
                    {...register("specialization")}
                  >
                    {SPECIALIZATIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.specialization && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.specialization.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">
                    Medical License Number *
                  </label>
                  <input
                    type="text"
                    placeholder="LIC-982143"
                    className={`w-full ${errors.licenseNumber ? "!border-red-500" : ""}`}
                    {...register("licenseNumber")}
                  />
                  {errors.licenseNumber && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.licenseNumber.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    placeholder="10"
                    min={0}
                    className={`w-full ${errors.experience ? "!border-red-500" : ""}`}
                    {...register("experience")}
                  />
                  {errors.experience && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.experience.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">
                    Consultation Fee ($) *
                  </label>
                  <input
                    type="number"
                    placeholder="150"
                    min={0}
                    className={`w-full ${errors.consultationFee ? "!border-red-500" : ""}`}
                    {...register("consultationFee")}
                  />
                  {errors.consultationFee && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.consultationFee.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 font-poppins">
                  Professional Biography (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter doctor's background, qualifications, and patient care philosophy..."
                  className="w-full"
                  {...register("bio")}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Link href="/admin/dashboard">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" variant="primary" loading={loading} className="gap-2">
                  <UserPlus className="w-4 h-4" /> Provision Doctor Account
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Credentials Success Modal */}
        {createdCredentials && (
          <Modal
            isOpen={true}
            onClose={() => setCreatedCredentials(null)}
            title="Doctor Account & Credentials Created"
          >
            <div className="space-y-4 font-sans text-slate-900">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-[#10B981] flex-shrink-0" />
                <p className="text-xs text-emerald-900 font-semibold font-sans">
                  Doctor account created for <span className="font-extrabold font-poppins">{createdCredentials.name}</span> with role <span className="font-bold text-[#6366F1]">DOCTOR</span>.
                </p>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-2xl space-y-3 font-mono text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Registered Email Address:</span>
                  <span className="font-bold text-slate-900 text-sm">{createdCredentials.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Assigned Password:</span>
                  <span className="font-extrabold text-[#6366F1] text-base bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 inline-block mt-0.5">
                    {createdCredentials.passwordAssigned}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Login URL:</span>
                  <span className="text-indigo-600 font-bold underline">/auth/login</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 font-medium">
                Convey these credentials to Dr. {createdCredentials.name}. They can log into the system immediately.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  onClick={handleCopyCredentials}
                  variant={copied ? "success" : "primary"}
                  className="gap-2"
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Credentials Copied!" : "Copy Credentials"}
                </Button>
                <Button onClick={() => setCreatedCredentials(null)} variant="outline">
                  Done
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </DashboardLayout>
    </PrivateRoute>
  );
}
