"use client";

import React from "react";
import { User } from "../../types";
import { X, User as UserIcon, Phone, Mail, Calendar, Heart, ShieldAlert, Pill, FileText, Clock, MapPin } from "lucide-react";
import Button from "../common/Button";

interface PatientDetailDrawerProps {
  patient: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PatientDetailDrawer({
  patient,
  isOpen,
  onClose,
}: PatientDetailDrawerProps) {
  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans no-print">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200/80 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                {patient.name ? patient.name[0].toUpperCase() : "P"}
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 font-display">{patient.name}</h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-200 uppercase tracking-wider">
                  Patient File
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Contact & Demographics */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Demographics</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="truncate">{patient.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{patient.phone || "+1 (555) 019-2834"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>DOB: 12/04/1988</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Suite 402, CA</span>
                </div>
              </div>
            </div>

            {/* Vitals Summary */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-teal-600" /> Recent Vitals
              </h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-teal-50/50 border border-teal-100 rounded-xl">
                  <span className="block text-[10px] text-slate-500 font-bold uppercase">Blood Pressure</span>
                  <span className="text-sm font-extrabold text-teal-800 font-mono">120/80</span>
                </div>
                <div className="p-3 bg-sky-50/50 border border-sky-100 rounded-xl">
                  <span className="block text-[10px] text-slate-500 font-bold uppercase">Heart Rate</span>
                  <span className="text-sm font-extrabold text-sky-800 font-mono">72 bpm</span>
                </div>
                <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                  <span className="block text-[10px] text-slate-500 font-bold uppercase">SpO2</span>
                  <span className="text-sm font-extrabold text-emerald-800 font-mono">99%</span>
                </div>
              </div>
            </div>

            {/* Allergy Alerts */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-500" /> Allergies & Alerts
              </h4>
              <div className="p-3.5 bg-red-50/80 border border-red-200/80 rounded-xl text-xs text-red-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <span className="font-semibold">Penicillin Allergy (Severe)</span>
              </div>
            </div>

            {/* Prescriptions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-teal-600" /> Active Medications
              </h4>
              <div className="space-y-2">
                <div className="p-3 bg-white border border-slate-200/80 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-900">Amoxicillin 500mg</span>
                    <p className="text-slate-500 text-[11px]">1 capsule twice daily</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[10px] font-bold">Active</span>
                </div>
                <div className="p-3 bg-white border border-slate-200/80 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-900">Lisinopril 10mg</span>
                    <p className="text-slate-500 text-[11px]">1 tablet daily in AM</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[10px] font-bold">Active</span>
                </div>
              </div>
            </div>

            {/* Medical History Log */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-600" /> History & Notes
              </h4>
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-2 text-slate-700">
                <p className="font-semibold text-slate-900">Annual Cardiology Checkup (Last Month)</p>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Patient reported mild shortness of breath after exercise. EKG normal. Prescribed routine follow-up.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} className="text-xs py-2 px-4">
              Close Drawer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
