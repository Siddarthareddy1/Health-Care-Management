"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatientSchema } from "../../lib/validators";
import { usePatients } from "../../hooks/useFirestore";
import { useToast } from "../../hooks/useNotification";
import Button from "../common/Button";
import { Patient } from "../../types";

interface PatientFormProps {
  patientId: string;
  existingPatient?: Patient | null;
  onSuccess: () => void;
}

export default function PatientForm({ patientId, existingPatient, onSuccess }: PatientFormProps) {
  const { savePatient } = usePatients();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(PatientSchema),
  });

  const ecErrors = errors.emergencyContact as any;

  useEffect(() => {
    if (existingPatient) {
      setValue("dob", existingPatient.dob || "");
      setValue("gender", existingPatient.gender || "");
      setValue("address", existingPatient.address || "");
      setValue("medicalHistory", existingPatient.medicalHistory ? existingPatient.medicalHistory.join(", ") : "");
      setValue("allergies", existingPatient.allergies ? existingPatient.allergies.join(", ") : "");
      setValue("emergencyContact.name", existingPatient.emergencyContact?.name || "");
      setValue("emergencyContact.phone", existingPatient.emergencyContact?.phone || "");
      setValue("emergencyContact.relationship", existingPatient.emergencyContact?.relationship || "");
    }
  }, [existingPatient, setValue]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await savePatient(patientId, {
        dob: data.dob,
        gender: data.gender,
        address: data.address,
        medicalHistory: data.medicalHistory,
        allergies: data.allergies,
        emergencyContact: data.emergencyContact,
      });
      showToast("success", "Profile Updated", "Patient medical history details updated successfully.");
      onSuccess();
    } catch (e: any) {
      showToast("error", "Update Failed", e.message || "Failed to update details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-healthcare-textDark font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-healthcare-textDark mb-1 font-display">Date of Birth</label>
          <input
            type="date"
            className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
              errors.dob ? "border-healthcare-error" : "border-healthcare-border"
            }`}
            {...register("dob")}
          />
          {errors.dob && <p className="text-xs text-healthcare-error mt-1 font-semibold">{(errors.dob as any).message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-healthcare-textDark mb-1 font-display">Gender</label>
          <select
            className={`w-full px-3 py-2 border rounded-standard bg-white text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary ${
              errors.gender ? "border-healthcare-error" : "border-healthcare-border"
            }`}
            {...register("gender")}
          >
            <option value="">-- Choose Gender --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="text-xs text-healthcare-error mt-1 font-semibold">{(errors.gender as any).message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-healthcare-textDark mb-1 font-display">Residential Address</label>
        <input
          type="text"
          placeholder="123 Care Street, Health City"
          className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
            errors.address ? "border-healthcare-error" : "border-healthcare-border"
          }`}
          {...register("address")}
        />
        {errors.address && <p className="text-xs text-healthcare-error mt-1 font-semibold">{(errors.address as any).message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-healthcare-textDark mb-1 font-display">Medical History (comma separated)</label>
          <input
            type="text"
            placeholder="Hypertension, Asthma, Diabetes"
            className="w-full px-3 py-2 border border-healthcare-border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white"
            {...register("medicalHistory")}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-healthcare-textDark mb-1 font-display">Allergies (comma separated)</label>
          <input
            type="text"
            placeholder="Penicillin, Peanuts"
            className="w-full px-3 py-2 border border-healthcare-border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white"
            {...register("allergies")}
          />
        </div>
      </div>

      <div className="border-t border-healthcare-border pt-4">
        <h4 className="text-sm font-bold text-healthcare-textDark mb-3 font-display">Emergency Contact Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-healthcare-textMedium mb-1">Contact Name</label>
            <input
              type="text"
              placeholder="Jane Doe"
              className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
                ecErrors?.name ? "border-healthcare-error" : "border-healthcare-border"
              }`}
              {...register("emergencyContact.name")}
            />
            {ecErrors?.name && (
              <p className="text-xs text-healthcare-error mt-1 font-semibold">{ecErrors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-healthcare-textMedium mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="9876543215"
              className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
                ecErrors?.phone ? "border-healthcare-error" : "border-healthcare-border"
              }`}
              {...register("emergencyContact.phone")}
            />
            {ecErrors?.phone && (
              <p className="text-xs text-healthcare-error mt-1 font-semibold">{ecErrors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-healthcare-textMedium mb-1">Relationship</label>
            <input
              type="text"
              placeholder="Spouse / Parent"
              className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
                ecErrors?.relationship ? "border-healthcare-error" : "border-healthcare-border"
              }`}
              {...register("emergencyContact.relationship")}
            />
            {ecErrors?.relationship && (
              <p className="text-xs text-healthcare-error mt-1 font-semibold">{ecErrors.relationship.message}</p>
            )}
          </div>
        </div>
      </div>

      <Button type="submit" variant="primary" loading={loading} className="w-full">
        Save Patient Records
      </Button>
    </form>
  );
}
