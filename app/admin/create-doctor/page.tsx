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
import { Stethoscope, UserPlus, Copy, CheckCircle, ShieldAlert, ArrowLeft } from "lucide-react";
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

  // Credentials Modal State
  const [createdCredentials, setCreatedCredentials] = useState<{
    email: string;
    name: string;
    temporaryPassword: string;
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
        temporaryPassword: result.temporaryPassword,
      });
      showToast("success", "Doctor Profile Created", `Dr. ${data.name} has been added successfully.`);
      reset();
    } catch (e: any) {
      showToast("error", "Creation Failed", e.message || "Failed to create doctor account.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCredentials = () => {
    if (!createdCredentials) return;
    const textToCopy = `CareFlow Doctor Credentials:\nName: Dr. ${createdCredentials.name}\nEmail: ${createdCredentials.email}\nTemporary Password: ${createdCredentials.temporaryPassword}\nLogin Portal: https://careflow.app/auth/login`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    showToast("success", "Copied", "Doctor credentials copied to clipboard!");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <PrivateRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6 font-sans text-healthcare-textDark">
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/admin/dashboard" className="p-2 border border-healthcare-border rounded-md hover:bg-white text-healthcare-textMedium">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-extrabold font-display text-healthcare-textDark">
                  Provision Doctor Account
                </h1>
                <p className="text-xs text-healthcare-textMedium">
                  Admin Exclusive · System Administrator credentials creation portal
                </p>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-standard p-4 flex items-start gap-3 text-xs text-amber-900">
            <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900">Privileged Action</p>
              <p className="mt-0.5 text-amber-800 leading-relaxed">
                Doctor accounts cannot be self-registered. Creating an account auto-generates a secure temporary password. Please share the generated credentials securely with the doctor.
              </p>
            </div>
          </div>

          {/* Create Doctor Form */}
          <Card title="Doctor Information Form" subtitle="Enter official details for medical practitioner onboarding">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-healthcare-textDark mb-1">
                    Doctor Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Dr. Sarah Jenkins"
                    className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
                      errors.name ? "border-healthcare-error" : "border-healthcare-border"
                    }`}
                    {...register("name")}
                  />
                  {errors.name && <p className="text-xs text-healthcare-error mt-1 font-semibold">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-healthcare-textDark mb-1">
                    Official Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="doctor@healthcare.com"
                    className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
                      errors.email ? "border-healthcare-error" : "border-healthcare-border"
                    }`}
                    {...register("email")}
                  />
                  {errors.email && <p className="text-xs text-healthcare-error mt-1 font-semibold">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-healthcare-textDark mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="9876543211"
                    className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
                      errors.phone ? "border-healthcare-error" : "border-healthcare-border"
                    }`}
                    {...register("phone")}
                  />
                  {errors.phone && <p className="text-xs text-healthcare-error mt-1 font-semibold">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-healthcare-textDark mb-1">
                    Medical Specialization *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-healthcare-border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white"
                    {...register("specialization")}
                  >
                    {SPECIALIZATIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.specialization && <p className="text-xs text-healthcare-error mt-1 font-semibold">{errors.specialization.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-healthcare-textDark mb-1">
                    Medical License Number *
                  </label>
                  <input
                    type="text"
                    placeholder="LIC-982143"
                    className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
                      errors.licenseNumber ? "border-healthcare-error" : "border-healthcare-border"
                    }`}
                    {...register("licenseNumber")}
                  />
                  {errors.licenseNumber && <p className="text-xs text-healthcare-error mt-1 font-semibold">{errors.licenseNumber.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-healthcare-textDark mb-1">
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    placeholder="10"
                    min={0}
                    className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
                      errors.experience ? "border-healthcare-error" : "border-healthcare-border"
                    }`}
                    {...register("experience")}
                  />
                  {errors.experience && <p className="text-xs text-healthcare-error mt-1 font-semibold">{errors.experience.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-healthcare-textDark mb-1">
                    Consultation Fee ($) *
                  </label>
                  <input
                    type="number"
                    placeholder="150"
                    min={0}
                    className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
                      errors.consultationFee ? "border-healthcare-error" : "border-healthcare-border"
                    }`}
                    {...register("consultationFee")}
                  />
                  {errors.consultationFee && <p className="text-xs text-healthcare-error mt-1 font-semibold">{errors.consultationFee.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-healthcare-textDark mb-1">
                  Professional Biography (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter doctor's background, qualifications, and patient care philosophy..."
                  className="w-full px-3 py-2 border border-healthcare-border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white"
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
            title="Doctor Credentials Provisioned Successfully"
          >
            <div className="space-y-4 font-sans text-healthcare-textDark">
              <div className="bg-emerald-50 border border-emerald-200 rounded-standard p-3 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <p className="text-xs text-emerald-800 font-semibold">
                  Account created for <span className="font-extrabold">{createdCredentials.name}</span> with role <span className="font-extrabold uppercase">Doctor</span>.
                </p>
              </div>

              <div className="bg-healthcare-bgSecondary border border-healthcare-border p-4 rounded-standard space-y-2 font-mono text-xs">
                <div>
                  <span className="text-healthcare-textMedium text-[10px] block uppercase font-bold">Email Address:</span>
                  <span className="font-bold text-healthcare-textDark">{createdCredentials.email}</span>
                </div>
                <div>
                  <span className="text-healthcare-textMedium text-[10px] block uppercase font-bold">Temporary Password:</span>
                  <span className="font-extrabold text-healthcare-primary text-sm bg-blue-100 px-2 py-0.5 rounded border border-blue-300">
                    {createdCredentials.temporaryPassword}
                  </span>
                </div>
              </div>

              <p className="text-xs text-healthcare-textMedium">
                Please securely convey these credentials to the doctor. They will use this temporary password to log in.
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
                  Close
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </DashboardLayout>
    </PrivateRoute>
  );
}
