"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Activity, ShieldCheck, HeartHandshake, CheckCircle2, ChevronDown, BookOpen } from "lucide-react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How do I book an appointment with a specialist?",
      a: "Once registered as a patient, you can log in, select the 'Appointments' tab, pick from our board-certified doctors, choose an available date and time slot, and confirm your booking. An invoice will be automatically raised."
    },
    {
      q: "Can I print or download my billing invoices?",
      a: "Yes! Navigate to the 'Billing' tab inside your dashboard, click 'Print Invoice' on any invoice. The application will render a specialized, high-resolution layout configured for standard browser PDF export."
    },
    {
      q: "Is my medical records database secure?",
      a: "Absolutely. CareFlow uses Firebase Firestore database security rules. Roles are strictly separated: doctors can review and update histories, patients can view their own details, and admins oversee general operations."
    },
    {
      q: "How can I edit my allergy alerts and history?",
      a: "Patients can edit their residential details and emergency contacts inside their profile. Medical history and allergy lists can be updated by consulting doctors or site administrators during sessions."
    }
  ];

  return (
    <div className="bg-healthcare-bgSecondary min-h-screen font-sans text-healthcare-textDark">
      {/* Header */}
      <header className="bg-white border-b border-healthcare-border sticky top-0 z-30 shadow-subtle">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-healthcare-primary text-white p-1.5 rounded-md">
              <Activity className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-healthcare-primary font-display tracking-tight">CareFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="primary">Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white py-16 md:py-24 border-b border-healthcare-border">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-healthcare-primary text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldCheck className="w-4 h-4" /> HIPAA Compliant Architecture
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-healthcare-textDark font-display leading-tight tracking-tight">
              Modern Clinical <br />
              <span className="text-healthcare-primary">Healthcare Management</span>
            </h1>
            <p className="text-base text-healthcare-textMedium mt-4 leading-relaxed max-w-lg">
              Streamline patient checkups, coordinate doctor schedules, manage automated medical invoicing, and track patient health histories in real-time.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <Link href="/auth/signup">
                <Button variant="primary" className="px-6 py-2.5 text-base">Get Started Now</Button>
              </Link>
              <a href="#features">
                <Button variant="outline" className="px-6 py-2.5 text-base">Learn More</Button>
              </a>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-md max-w-md w-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-healthcare-primary text-white p-2 rounded-lg">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-healthcare-textDark font-display">CareFlow Clinic Panel</h3>
                  <p className="text-xs text-healthcare-textMedium font-semibold">Active In-patient Dashboard</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white border border-healthcare-border rounded-standard">
                  <span className="text-xs font-bold text-healthcare-textMedium">Active Consultations</span>
                  <span className="text-xs font-mono font-bold bg-blue-50 text-healthcare-primary px-2 py-0.5 rounded">12 Today</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white border border-healthcare-border rounded-standard">
                  <span className="text-xs font-bold text-healthcare-textMedium">Pending Invoices</span>
                  <span className="text-xs font-mono font-bold bg-amber-50 text-healthcare-warning px-2 py-0.5 rounded">$450</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white border border-healthcare-border rounded-standard">
                  <span className="text-xs font-bold text-healthcare-textMedium">System Logs Integrity</span>
                  <span className="text-xs font-mono font-bold bg-emerald-50 text-healthcare-success px-2 py-0.5 rounded">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-healthcare-textDark font-display tracking-tight">Core Clinical Features</h2>
          <p className="text-healthcare-textMedium text-sm mt-3 font-semibold">Everything you need to orchestrate care teams, patient tracking, and payments in one place.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <div className="bg-blue-50 text-healthcare-primary p-3 rounded-full w-fit mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-healthcare-textDark font-display mb-2">Role-Based Access</h3>
            <p className="text-sm text-healthcare-textMedium leading-relaxed">
              Tailored profiles for Patient medical history logging, Doctor schedule and consultation management, and Administrator billing controls.
            </p>
          </Card>
          <Card>
            <div className="bg-blue-50 text-healthcare-primary p-3 rounded-full w-fit mb-4">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-healthcare-textDark font-display mb-2">Calendar Coordination</h3>
            <p className="text-sm text-healthcare-textMedium leading-relaxed">
              Book, reschedule, or cancel checkups using an interactive React Big Calendar grid with active status monitoring and automated email cues.
            </p>
          </Card>
          <Card>
            <div className="bg-blue-50 text-healthcare-primary p-3 rounded-full w-fit mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-healthcare-textDark font-display mb-2">Invoices & Receipts</h3>
            <p className="text-sm text-healthcare-textMedium leading-relaxed">
              Auto-generate invoice entries on checkout. Download billing reports as PDF sheets or print details directly using native browser formatting.
            </p>
          </Card>
        </div>
      </section>

      {/* FAQs */}
      <section id="faq" className="py-20 bg-white border-t border-b border-healthcare-border">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-healthcare-textDark font-display tracking-tight">Frequently Asked Questions</h2>
            <p className="text-healthcare-textMedium text-sm mt-3 font-semibold">Quick answers to common questions about clinic setup and workflows.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-healthcare-border rounded-standard p-4 bg-healthcare-bgSecondary">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="font-bold text-sm md:text-base text-healthcare-textDark font-display">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-healthcare-textMedium transition-transform ${activeFaq === idx ? "rotate-185" : ""}`} />
                </button>
                {activeFaq === idx && (
                  <p className="text-sm text-healthcare-textMedium mt-3 leading-relaxed border-t border-healthcare-border pt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-healthcare-border py-12 text-center text-xs text-healthcare-textMedium font-sans">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-healthcare-primary" />
            <span className="font-bold text-healthcare-textDark font-display">CareFlow HMS</span>
          </div>
          <div className="flex items-center gap-6 font-semibold">
            <Link href="/privacy" className="hover:text-healthcare-primary transition-all">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-healthcare-primary transition-all">Terms of Service</Link>
            <a href="#faq" className="hover:text-healthcare-primary transition-all">FAQ Help Desk</a>
          </div>
          <p className="text-healthcare-textLight">
            &copy; {new Date().getFullYear()} CareFlow HMS. Made for Siddartha Reddy. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
