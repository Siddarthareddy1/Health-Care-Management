"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { usePatients, useUsers } from "../../../hooks/useFirestore";
import { useToast } from "../../../hooks/useNotification";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import PatientForm from "../../../components/forms/PatientForm";
import { Search, UserPlus, FileHeart, ShieldAlert, Phone, MapPin, Contact2, Plus } from "lucide-react";
import { Patient, User } from "../../../types";

export default function PatientsPage() {
  const { user } = useAuth();
  const { patients, refresh: refreshPatients } = usePatients();
  const { users } = useUsers();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<{ patient: Patient; userRecord: User } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const role = user?.role || "patient";

  // Filter patients by search
  const getFilteredPatients = () => {
    return patients.map((p) => {
      const u = users.find((usr) => usr.id === p.userId || usr.id === p.id);
      return { patient: p, userRecord: u };
    }).filter((item) => {
      if (!item.userRecord) return false;
      const q = searchQuery.toLowerCase();
      return (
        item.userRecord.name.toLowerCase().includes(q) ||
        item.userRecord.email.toLowerCase().includes(q) ||
        item.userRecord.phone.includes(q)
      );
    }) as Array<{ patient: Patient; userRecord: User }>;
  };

  const filtered = getFilteredPatients();

  const handleSelectPatient = (patient: Patient, userRecord: User) => {
    setSelectedPatient({ patient, userRecord });
  };

  if (role === "patient") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center font-sans">
        <div className="bg-red-50 text-healthcare-error p-4 rounded-full w-fit mx-auto mb-4 border border-red-200">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-healthcare-textDark font-display">Access Denied</h2>
        <p className="text-sm text-healthcare-textMedium mt-2 max-w-sm">
          You do not have permission to view the patient directory. This area is restricted to administrators and doctors only.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-healthcare-textDark">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-healthcare-textDark font-display tracking-tight">Patients Directory</h1>
          <p className="text-sm text-healthcare-textMedium font-medium mt-1">Search records, manage emergency sheets, and log health histories.</p>
        </div>
        {role === "admin" && (
          <Button onClick={() => setShowAddModal(true)} variant="primary" className="gap-2 self-start md:self-auto">
            <UserPlus className="w-4 h-4" /> Register Patient
          </Button>
        )}
      </div>

      {/* Search and Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: List of patients */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4">
            <div className="relative">
              <Search className="w-4 h-4 text-healthcare-textLight absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search patients by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-healthcare-border rounded-standard text-sm focus:outline-none focus:ring-2 focus:ring-healthcare-primary bg-healthcare-bgSecondary focus:bg-white transition-all"
              />
            </div>
          </Card>

          <Card title="Patient List" subtitle={`${filtered.length} total records matched`}>
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-healthcare-textMedium">
                <Search className="w-10 h-10 text-healthcare-textLight mx-auto mb-3" />
                <p className="text-sm font-semibold">No patient records found.</p>
              </div>
            ) : (
              <div className="divide-y divide-healthcare-border">
                {filtered.map((item) => (
                  <div
                    key={item.patient.id}
                    onClick={() => handleSelectPatient(item.patient, item.userRecord)}
                    className={`p-4 flex items-center justify-between hover:bg-healthcare-bgSecondary rounded-standard cursor-pointer transition-all ${
                      selectedPatient?.patient.id === item.patient.id ? "bg-blue-50 border-l-4 border-healthcare-primary" : ""
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-bold text-healthcare-textDark font-display">{item.userRecord.name}</h4>
                      <p className="text-xs text-healthcare-textMedium mt-0.5">{item.userRecord.email} · {item.userRecord.phone}</p>
                      <div className="flex items-center gap-4 mt-2 text-[11px] font-semibold text-healthcare-textMedium">
                        <span>DOB: <span className="font-mono">{item.patient.dob || "Not set"}</span></span>
                        <span>Gender: <span>{item.patient.gender || "Not set"}</span></span>
                      </div>
                    </div>
                    <Button variant="outline" className="text-xs px-2.5 py-1">View Sheet</Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right column: Patient Detail Sheet */}
        <div className="lg:col-span-1">
          {selectedPatient ? (
            <Card 
              title="Medical Health Sheet" 
              subtitle={selectedPatient.userRecord.name}
              actions={
                (role === "admin" || role === "doctor") && (
                  <Button onClick={() => setShowEditModal(true)} variant="outline" className="text-xs px-2.5 py-1">
                    Edit Sheet
                  </Button>
                )
              }
            >
              <div className="space-y-6 text-xs text-healthcare-textMedium font-medium leading-relaxed">
                {/* Demographics details */}
                <div className="space-y-2 border-b border-healthcare-border pb-4">
                  <div className="flex items-center gap-2 text-healthcare-textDark">
                    <Phone className="w-4 h-4 text-healthcare-textLight" />
                    <span className="font-semibold">{selectedPatient.userRecord.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-healthcare-textDark">
                    <MapPin className="w-4 h-4 text-healthcare-textLight" />
                    <span>{selectedPatient.patient.address || "No address listed"}</span>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-2 border-b border-healthcare-border pb-4">
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-healthcare-textLight flex items-center gap-1.5">
                    <Contact2 className="w-4 h-4" /> Emergency Contact
                  </h4>
                  {selectedPatient.patient.emergencyContact?.name ? (
                    <div className="bg-healthcare-bgSecondary rounded p-3 border border-healthcare-border">
                      <p className="font-bold text-healthcare-textDark">{selectedPatient.patient.emergencyContact.name}</p>
                      <p className="text-[10px] text-healthcare-textLight mt-0.5">
                        {selectedPatient.patient.emergencyContact.relationship} · {selectedPatient.patient.emergencyContact.phone}
                      </p>
                    </div>
                  ) : (
                    <p className="italic text-healthcare-textLight">No emergency contacts registered.</p>
                  )}
                </div>

                {/* Allergy Alerts */}
                <div className="space-y-2 border-b border-healthcare-border pb-4">
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-healthcare-textLight flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-healthcare-error" /> Medical Allergy Alerts
                  </h4>
                  {selectedPatient.patient.allergies && selectedPatient.patient.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {selectedPatient.patient.allergies.map((a) => (
                        <span key={a} className="bg-red-50 text-healthcare-error px-2 py-0.5 rounded border border-red-200 font-bold uppercase tracking-wide text-[10px]">
                          {a}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="italic text-healthcare-textLight">No active allergy flags recorded.</p>
                  )}
                </div>

                {/* Conditions / History */}
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-healthcare-textLight flex items-center gap-1.5">
                    <FileHeart className="w-4 h-4" /> Diagnosed Conditions
                  </h4>
                  {selectedPatient.patient.medicalHistory && selectedPatient.patient.medicalHistory.length > 0 ? (
                    <div className="space-y-2 mt-1.5">
                      {selectedPatient.patient.medicalHistory.map((h) => (
                        <div key={h} className="p-2 bg-blue-50/50 border border-blue-100 rounded text-healthcare-primary font-bold">
                          {h}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="italic text-healthcare-textLight">No recorded medical conditions.</p>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="text-center py-16">
              <FileHeart className="w-10 h-10 text-healthcare-textLight mx-auto mb-3 animate-pulse" />
              <h4 className="font-bold text-healthcare-textDark font-display">No Patient Selected</h4>
              <p className="text-xs text-healthcare-textMedium mt-1 leading-normal max-w-xs mx-auto">
                Choose an option from the list grid to open their full clinical record ledger.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Add Patient Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Register Patient Profile">
        <PatientForm patientId={`offline-${Date.now()}`} onSuccess={() => { setShowAddModal(false); refreshPatients(); }} />
      </Modal>

      {/* Edit Patient Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Medical Records">
        {selectedPatient && (
          <PatientForm
            patientId={selectedPatient.patient.id}
            existingPatient={selectedPatient.patient}
            onSuccess={() => {
              setShowEditModal(false);
              // Refresh records
              refreshPatients();
              setSelectedPatient(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
