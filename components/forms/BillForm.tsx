"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BillSchema } from "../../lib/validators";
import { useBills, useAppointments } from "../../hooks/useFirestore";
import { useToast } from "../../hooks/useNotification";
import Button from "../common/Button";
import { z } from "zod";

type BillFormInputs = z.infer<typeof BillSchema>;

interface BillFormProps {
  onSuccess: () => void;
}

export default function BillForm({ onSuccess }: BillFormProps) {
  const { addBill } = useBills();
  const { appointments } = useAppointments();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BillFormInputs>({
    resolver: zodResolver(BillSchema),
    defaultValues: {
      status: "pending",
      paymentMethod: "Cash"
    }
  });

  const selectedPatientId = watch("patientId");
  const selectedAppointmentId = watch("appointmentId");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const allUsers = JSON.parse(localStorage.getItem("hms_users") || "[]");
      const pats = allUsers.filter((u: any) => u.role === "patient");
      setPatients(pats);
    }
  }, []);

  const filteredAppointments = appointments.filter((app) => app.patientId === selectedPatientId);

  useEffect(() => {
    const app = appointments.find((a) => a.id === selectedAppointmentId);
    if (app) {
      setValue("amount", app.fee);
      setValue("description", `Consultation invoice for appointment on ${app.date}`);
      setValue("dueDate", app.date);
    }
  }, [selectedAppointmentId, appointments, setValue]);

  const onSubmit = async (data: BillFormInputs) => {
    setLoading(true);
    try {
      await addBill({
        patientId: data.patientId,
        appointmentId: data.appointmentId,
        amount: data.amount,
        status: data.status,
        dueDate: data.dueDate,
        paidDate: data.status === "paid" ? new Date().toISOString().split("T")[0] : null,
        paymentMethod: data.paymentMethod,
        description: data.description,
      });
      showToast("success", "Invoice Raised", "Healthcare billing invoice generated successfully.");
      onSuccess();
    } catch (e: any) {
      showToast("error", "Generation Failed", e.message || "Failed to generate bill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-healthcare-textDark font-sans">
      <div>
        <label className="block text-sm font-bold text-healthcare-textDark mb-1 font-display">
          Select Patient
        </label>
        <select
          className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
            errors.patientId ? "border-healthcare-error" : "border-healthcare-border"
          }`}
          {...register("patientId")}
        >
          <option value="">-- Choose Patient --</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.email})
            </option>
          ))}
        </select>
        {errors.patientId && (
          <p className="text-xs text-healthcare-error mt-1 font-semibold">{errors.patientId.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-bold text-healthcare-textDark mb-1 font-display">
          Link to Appointment
        </label>
        <select
          disabled={!selectedPatientId}
          className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
            errors.appointmentId ? "border-healthcare-error" : "border-healthcare-border"
          }`}
          {...register("appointmentId")}
        >
          <option value="">-- Choose Appointment --</option>
          {filteredAppointments.map((app) => (
            <option key={app.id} value={app.id}>
              Ref: {app.id} ({app.date} @ {app.time} - ${app.fee})
            </option>
          ))}
        </select>
        {errors.appointmentId && (
          <p className="text-xs text-healthcare-error mt-1 font-semibold">{errors.appointmentId.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-healthcare-textDark mb-1 font-display">
            Amount ($)
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="150"
            className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
              errors.amount ? "border-healthcare-error" : "border-healthcare-border"
            }`}
            {...register("amount")}
          />
          {errors.amount && (
            <p className="text-xs text-healthcare-error mt-1 font-semibold">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-healthcare-textDark mb-1 font-display">
            Due Date
          </label>
          <input
            type="date"
            className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
              errors.dueDate ? "border-healthcare-error" : "border-healthcare-border"
            }`}
            {...register("dueDate")}
          />
          {errors.dueDate && (
            <p className="text-xs text-healthcare-error mt-1 font-semibold">{errors.dueDate.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-healthcare-textDark mb-1 font-display">
            Payment Method
          </label>
          <select
            className="w-full px-3 py-2 border border-healthcare-border rounded-standard bg-white text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary"
            {...register("paymentMethod")}
          >
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Insurance">Insurance</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-healthcare-textDark mb-1 font-display">
            Initial Billing Status
          </label>
          <select
            className="w-full px-3 py-2 border border-healthcare-border rounded-standard bg-white text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary"
            {...register("status")}
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-healthcare-textDark mb-1 font-display">
          Invoice Description
        </label>
        <input
          type="text"
          placeholder="Consultation and Lab Report fees"
          className={`w-full px-3 py-2 border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-white ${
            errors.description ? "border-healthcare-error" : "border-healthcare-border"
          }`}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-healthcare-error mt-1 font-semibold">{errors.description.message}</p>
        )}
      </div>

      <Button type="submit" variant="primary" loading={loading} className="w-full">
        Generate Invoice Bill
      </Button>
    </form>
  );
}
