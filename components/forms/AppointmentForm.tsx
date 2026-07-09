"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppointmentSchema } from "../../lib/validators";
import { useDoctors, useAppointments } from "../../hooks/useFirestore";
import { useToast } from "../../hooks/useNotification";
import Button from "../common/Button";
import { z } from "zod";

type AppointmentFormInputs = z.infer<typeof AppointmentSchema>;

interface AppointmentFormProps {
  patientId: string;
  onSuccess: () => void;
}

export default function AppointmentForm({ patientId, onSuccess }: AppointmentFormProps) {
  const { doctors } = useDoctors();
  const { addAppointment } = useAppointments();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedDoctorFee, setSelectedDoctorFee] = useState(0);
  const [doctorUsers, setDoctorUsers] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AppointmentFormInputs>({
    resolver: zodResolver(AppointmentSchema),
  });

  const selectedDoctorId = watch("doctorId");

  useEffect(() => {
    const doc = doctors.find((d) => d.userId === selectedDoctorId || d.id === selectedDoctorId);
    if (doc) {
      setSelectedDoctorFee(doc.consultationFee);
    } else {
      setSelectedDoctorFee(0);
    }
  }, [selectedDoctorId, doctors]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const allUsers = JSON.parse(localStorage.getItem("hms_users") || "[]");
      const docs = allUsers.filter((u: any) => u.role === "doctor");
      setDoctorUsers(docs);
    }
  }, []);

  const onSubmit = async (data: AppointmentFormInputs) => {
    setLoading(true);
    try {
      await addAppointment({
        patientId,
        doctorId: data.doctorId,
        date: data.date,
        time: data.time,
        reason: data.reason,
        status: "scheduled",
        notes: data.notes || "",
        fee: selectedDoctorFee || 100,
      });
      showToast("success", "Appointment Booked", "Your appointment has been successfully scheduled.");
      onSuccess();
    } catch (e: any) {
      showToast("error", "Booking Failed", e.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-healthcare-textDark font-sans">
      <div>
        <label className="block text-sm font-bold text-healthcare-textDark mb-1">
          Select Doctor
        </label>
        <select
          className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
            errors.doctorId ? "border-healthcare-error" : "border-healthcare-border"
          }`}
          {...register("doctorId")}
        >
          <option value="">-- Choose Doctor --</option>
          {doctorUsers.map((d) => {
            const spec = doctors.find((doc) => doc.userId === d.id || doc.id === d.id)?.specialization || "General Medicine";
            return (
              <option key={d.id} value={d.id}>
                {d.name} ({spec})
              </option>
            );
          })}
        </select>
        {errors.doctorId && (
          <p className="text-xs text-healthcare-error mt-1 font-semibold">{errors.doctorId.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-healthcare-textDark mb-1">
            Appointment Date
          </label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
              errors.date ? "border-healthcare-error" : "border-healthcare-border"
            }`}
            {...register("date")}
          />
          {errors.date && (
            <p className="text-xs text-healthcare-error mt-1 font-semibold">{errors.date.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-healthcare-textDark mb-1">
            Appointment Time
          </label>
          <input
            type="time"
            className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
              errors.time ? "border-healthcare-error" : "border-healthcare-border"
            }`}
            {...register("time")}
          />
          {errors.time && (
            <p className="text-xs text-healthcare-error mt-1 font-semibold">{errors.time.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-healthcare-textDark mb-1">
          Reason for Visit
        </label>
        <textarea
          rows={3}
          placeholder="Describe your symptoms or reason for consulting the doctor..."
          className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
            errors.reason ? "border-healthcare-error" : "border-healthcare-border"
          }`}
          {...register("reason")}
        />
        {errors.reason && (
          <p className="text-xs text-healthcare-error mt-1 font-semibold">{errors.reason.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-bold text-healthcare-textDark mb-1">
          Additional Notes (Optional)
        </label>
        <textarea
          rows={2}
          placeholder="Any extra history, files, or information..."
          className="w-full px-3 py-2 border border-healthcare-border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white"
          {...register("notes")}
        />
      </div>

      {selectedDoctorFee > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-standard p-4 flex items-center justify-between">
          <span className="text-sm font-bold text-healthcare-primary">Consultation Fee:</span>
          <span className="text-lg font-bold text-healthcare-secondary font-mono">${selectedDoctorFee}</span>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" variant="primary" loading={loading} className="w-full">
          Confirm Appointment Booking
        </Button>
      </div>
    </form>
  );
}
