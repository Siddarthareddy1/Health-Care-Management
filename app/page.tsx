"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Activity, ShieldCheck, HeartHandshake, CheckCircle2, ChevronDown, BookOpen, ArrowRight } from "lucide-react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How do I book an appointment with a specialist?",
      a: "Once registered as a patient, you can log in, select the 'Appointments' tab, pick from our board-certified doctors, choose an available date and time slot, and confirm your booking."
    },
    {
      q: "Can I print or download my billing invoices?",
      a: "Yes! Navigate to the 'Medical Records & Bills' tab inside your patient or admin dashboard, click 'Print Invoice' on any record. The application will render a high-resolution print sheet."
    },
    {
      q: "Is my medical records database secure?",
      a: "Absolutely. CareFlow uses role-based encryption and security rules. Roles are strictly separated: doctors can review and update histories, patients can view their own details, and admins oversee system operations."
    },
    {
      q: "How can I edit my health record and allergy alerts?",
      a: "Patients can edit their personal contact details inside their profile. Medical history and allergy lists can be updated by consulting doctors or site administrators during sessions."
    }
  ];

  return (
    <div className="bg-[#F8FAFB] min-h-screen font-sans text-[#1F2937]">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#007AFF] text-white p-1.5 rounded-lg text-lg flex items-center justify-center font-bold">
              🏥
            </div>
            <span className="font-bold text-xl text-[#1F2937] font-display tracking-tight">CareFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" className="text-xs py-2 px-4">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" className="text-xs py-2 px-4">Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white py-16 md:py-24 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DFF1FF] border border-[#007AFF]/20 text-[#0051CC] text-xs font-semibold uppercase tracking-wider mb-6">
              <ShieldCheck className="w-4 h-4 text-[#007AFF]" /> HIPAA Compliant Architecture
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1F2937] font-display leading-tight tracking-tight">
              Modern Clinical <br />
              <span className="text-[#007AFF]">Healthcare Management</span>
            </h1>
            <p className="text-base text-[#6B7280] mt-4 leading-relaxed max-w-lg">
              Streamline patient consultations, coordinate doctor schedules, manage automated medical invoicing, and track health histories in real-time.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <Link href="/register">
                <Button variant="primary" className="px-6 py-3 text-sm gap-2">
                  Get Started Now <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" className="px-6 py-3 text-sm">Learn More</Button>
              </a>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-[#F8FAFB] border border-[#E5E7EB] rounded-2xl p-6 shadow-md max-w-md w-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#007AFF] text-white p-2.5 rounded-xl font-bold">
                  🏥
                </div>
                <div>
                  <h3 className="font-bold text-[#1F2937] font-display">CareFlow Clinic Dashboard</h3>
                  <p className="text-xs text-[#6B7280] font-semibold">Active Portal Session</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 bg-white border border-[#E5E7EB] rounded-xl shadow-xs">
                  <span className="text-xs font-semibold text-[#6B7280]">Active Consultations</span>
                  <span className="text-xs font-mono font-bold bg-[#DFF1FF] text-[#0051CC] px-2.5 py-1 rounded-full">12 Today</span>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-white border border-[#E5E7EB] rounded-xl shadow-xs">
                  <span className="text-xs font-semibold text-[#6B7280]">Pending Invoices</span>
                  <span className="text-xs font-mono font-bold bg-[#FFF4E5] text-[#FF9500] px-2.5 py-1 rounded-full">$450</span>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-white border border-[#E5E7EB] rounded-xl shadow-xs">
                  <span className="text-xs font-semibold text-[#6B7280]">System Logs Integrity</span>
                  <span className="text-xs font-mono font-bold bg-[#E8F8EC] text-[#34C759] px-2.5 py-1 rounded-full">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-[#1F2937] font-display tracking-tight">Core Clinical Features</h2>
          <p className="text-[#6B7280] text-sm mt-3 font-semibold">Everything you need to orchestrate care teams, patient tracking, and payments in one place.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <div className="bg-[#DFF1FF] text-[#007AFF] p-3 rounded-xl w-fit mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1F2937] font-display mb-2">Role-Based Access</h3>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Tailored profiles for Patient medical history logging, Doctor schedule and consultation management, and Administrator controls.
            </p>
          </Card>
          <Card>
            <div className="bg-[#DFF1FF] text-[#007AFF] p-3 rounded-xl w-fit mb-4">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1F2937] font-display mb-2">Calendar Coordination</h3>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Book, reschedule, or cancel checkups using an interactive calendar grid with active status monitoring and automated notifications.
            </p>
          </Card>
          <Card>
            <div className="bg-[#DFF1FF] text-[#007AFF] p-3 rounded-xl w-fit mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1F2937] font-display mb-2">Invoices & Receipts</h3>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Auto-generate invoice entries on checkout. Download billing reports as PDF sheets or print details directly using native browser formatting.
            </p>
          </Card>
        </div>
      </section>

      {/* FAQs */}
      <section id="faq" className="py-20 bg-white border-t border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-[#1F2937] font-display tracking-tight">Frequently Asked Questions</h2>
            <p className="text-[#6B7280] text-sm mt-3 font-semibold">Quick answers to common questions about clinic setup and workflows.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-[#E5E7EB] rounded-xl p-5 bg-[#F8FAFB]">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="font-bold text-sm md:text-base text-[#1F2937] font-display">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#6B7280] transition-transform ${activeFaq === idx ? "rotate-180" : ""}`} />
                </button>
                {activeFaq === idx && (
                  <p className="text-sm text-[#6B7280] mt-3 leading-relaxed border-t border-[#E5E7EB] pt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] py-12 text-center text-xs text-[#6B7280] font-sans">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="text-lg">🏥</div>
            <span className="font-bold text-[#1F2937] font-display text-sm">CareFlow HMS</span>
          </div>
          <div className="flex items-center gap-6 font-semibold">
            <a href="#faq" className="hover:text-[#007AFF] transition-colors">FAQ & Help Center</a>
          </div>
          <p className="text-[#9CA3AF]">
            &copy; {new Date().getFullYear()} CareFlow Healthcare Management System. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

