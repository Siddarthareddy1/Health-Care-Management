"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  HeartHandshake, 
  CheckCircle2, 
  ChevronDown, 
  BookOpen, 
  ArrowRight, 
  Sparkles,
  Calendar,
  Users,
  CreditCard,
  Activity,
  Zap
} from "lucide-react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How do I book an appointment with a board-certified specialist?",
      a: "Register as a patient or log in with your credentials. Navigate to the 'Appointments' tab, filter by doctor specialization or availability, pick your preferred date and time slot, and confirm your booking instantly."
    },
    {
      q: "Can I generate and download medical billing invoices?",
      a: "Yes! Access the 'Medical Records & Bills' section inside your patient or doctor portal. You can view itemized fee breakdowns, pay pending invoices securely, and download or print high-resolution statements anytime."
    },
    {
      q: "Is patient medical data kept secure and HIPAA compliant?",
      a: "CareFlow is built with strict role-based access control and Firebase Security Rules. Patient records, medical histories, and prescription details are encrypted and accessible only to authorized healthcare personnel and the individual patient."
    },
    {
      q: "How can doctors manage their schedules and consultation fees?",
      a: "Doctors have a dedicated dashboard to set custom weekly availability slots, adjust consultation rates, review patient medical histories before visits, and track monthly clinic earnings."
    }
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-[#0F172A] selection:bg-[#818CF8] selection:text-white">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white flex items-center justify-center font-bold text-xl shadow-md shadow-indigo-500/20">
              🏥
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-[#0F172A] font-poppins tracking-tight">CareFlow</span>
              <span className="text-[10px] font-bold text-[#6366F1] uppercase tracking-widest font-mono">Healthcare System</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" className="text-xs h-9 px-4">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" className="text-xs h-9 px-4">Register Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#0F172A] text-white py-20 md:py-28 relative overflow-hidden border-b border-[#1E293B]">
        {/* Decorative background glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#6366F1]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8B5CF6]/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-[#818CF8] text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-4 h-4 text-[#EC4899]" /> HIPAA Compliant Clinical Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-poppins leading-tight tracking-tight">
              Modern Clinical <br />
              <span className="bg-gradient-to-r from-[#818CF8] via-[#A78BFA] to-[#EC4899] bg-clip-text text-transparent">Healthcare Management</span>
            </h1>
            <p className="text-base md:text-lg text-slate-300 mt-6 leading-relaxed max-w-xl font-sans">
              Streamline patient check-ins, coordinate doctor schedules, manage automated medical invoicing, and track health histories with a vibrant, modern workspace.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Link href="/register">
                <Button variant="primary" className="px-7 py-3 text-sm gap-2 h-12 shadow-lg shadow-indigo-500/30">
                  Get Started Now <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="secondary" className="px-6 py-3 text-sm h-12 bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700">
                  Explore Features
                </Button>
              </a>
            </div>
            <div className="flex items-center gap-6 mt-10 text-xs text-slate-400 font-semibold border-t border-slate-800 pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> 100% Free Demo Access
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Zero Setup Required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Real-time Sync
              </div>
            </div>
          </div>

          {/* Interactive Hero Widget Graphic */}
          <div className="relative flex justify-center">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl max-w-md w-full relative">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white flex items-center justify-center font-bold">
                    🏥
                  </div>
                  <div>
                    <h3 className="font-bold text-white font-poppins text-sm">CareFlow Live Portal</h3>
                    <p className="text-[11px] text-slate-400 font-semibold">Real-time Operations Dashboard</p>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/20 text-[#818CF8]">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white font-poppins">Appointments Today</p>
                      <p className="text-[10px] text-slate-400">18 Scheduled Consultations</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold bg-indigo-500/20 text-[#818CF8] px-2.5 py-1 rounded-full border border-indigo-500/30">Active</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/20 text-[#A78BFA]">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white font-poppins">Active Patient Roster</p>
                      <p className="text-[10px] text-slate-400">1,240 Registered Accounts</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold bg-purple-500/20 text-[#A78BFA] px-2.5 py-1 rounded-full border border-purple-500/30">+14% MoM</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-[#10B981]">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white font-poppins">System Integrity</p>
                      <p className="text-[10px] text-slate-400">Database & Security Online</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold bg-emerald-500/20 text-[#10B981] px-2.5 py-1 rounded-full border border-emerald-500/30">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid Section */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-extrabold text-[#6366F1] uppercase tracking-widest font-mono">Designed for Excellence</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] font-poppins tracking-tight mt-2">
            Powerful Clinical Modules
          </h2>
          <p className="text-[#475569] text-base mt-3 font-medium">
            Everything you need to orchestrate care teams, patient tracking, medical billing, and analytics in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card hoverable className="border-[#E2E8F0] shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#6366F1] flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] font-poppins mb-2">Role-Based Access</h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              Strictly segregated profiles for Patients to view history, Doctors to conduct visits, and Administrators to oversee clinical operations.
            </p>
          </Card>

          <Card hoverable className="border-[#E2E8F0] shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 text-[#8B5CF6] flex items-center justify-center mb-5">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] font-poppins mb-2">Calendar Booking</h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              Book, reschedule, or cancel checkups using an interactive calendar grid with real-time doctor availability and notification triggers.
            </p>
          </Card>

          <Card hoverable className="border-[#E2E8F0] shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 text-[#EC4899] flex items-center justify-center mb-5">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] font-poppins mb-2">Invoicing & Payments</h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              Auto-generate billing records upon checkout. Download receipts as printable PDFs with status tracking (Paid, Pending, Overdue).
            </p>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white border-t border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-extrabold text-[#EC4899] uppercase tracking-widest font-mono">Streamlined Patient Experience</span>
            <h2 className="text-3xl font-extrabold text-[#0F172A] font-poppins mt-2 tracking-tight">
              Delightful for Patients, <br />Empowering for Physicians
            </h2>
            <p className="text-[#475569] text-sm md:text-base mt-4 leading-relaxed">
              Say goodbye to tedious paperwork. CareFlow provides a unified digital experience where patients can track medical history, view upcoming visits, and pay bills seamlessly.
            </p>

            <div className="space-y-4 mt-8">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-emerald-100 text-[#10B981] mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0F172A] font-poppins text-sm">Instant Online Appointments</h4>
                  <p className="text-xs text-[#64748B]">Choose your doctor and time slot in less than 30 seconds.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-emerald-100 text-[#10B981] mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0F172A] font-poppins text-sm">Automated Email Notifications</h4>
                  <p className="text-xs text-[#64748B]">Instant appointment confirmations and billing payment alerts.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-sm">
              <Zap className="w-8 h-8 text-[#6366F1] mb-3" />
              <h3 className="text-2xl font-extrabold text-[#0F172A] font-poppins">&lt; 2 Sec</h3>
              <p className="text-xs text-[#64748B] font-medium mt-1">Ultra-fast page loads</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-sm">
              <Activity className="w-8 h-8 text-[#8B5CF6] mb-3" />
              <h3 className="text-2xl font-extrabold text-[#0F172A] font-poppins">99.9%</h3>
              <p className="text-xs text-[#64748B] font-medium mt-1">Uptime reliability</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-sm">
              <Users className="w-8 h-8 text-[#06B6D4] mb-3" />
              <h3 className="text-2xl font-extrabold text-[#0F172A] font-poppins">Role-Based</h3>
              <p className="text-xs text-[#64748B] font-medium mt-1">Patients, Doctors, Admins</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-sm">
              <ShieldCheck className="w-8 h-8 text-[#EC4899] mb-3" />
              <h3 className="text-2xl font-extrabold text-[#0F172A] font-poppins">Encrypted</h3>
              <p className="text-xs text-[#64748B] font-medium mt-1">Firebase Security Rules</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold font-poppins tracking-tight">
            Ready to Modernize Your Healthcare Workflow?
          </h2>
          <p className="text-indigo-100 text-base mt-4 max-w-xl mx-auto font-sans">
            Join thousands of patients and medical professionals using CareFlow to simplify clinic appointments and medical records.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Link href="/register">
              <Button variant="secondary" className="px-8 py-3 bg-white text-[#6366F1] hover:bg-slate-100 font-bold border-none h-12 shadow-lg">
                Create Free Account
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="px-8 py-3 bg-transparent text-white border-white/40 hover:bg-white/10 h-12 font-semibold">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faq" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-[#0F172A] font-poppins tracking-tight">Frequently Asked Questions</h2>
            <p className="text-[#64748B] text-sm mt-3 font-medium">Quick answers to common questions about clinic setup and workflows.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-[#E2E8F0] rounded-xl p-5 bg-white shadow-xs">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="flex items-center justify-between w-full text-left font-poppins cursor-pointer"
                >
                  <span className="font-bold text-sm md:text-base text-[#0F172A]">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#64748B] transition-transform ${activeFaq === idx ? "rotate-180 text-[#6366F1]" : ""}`} />
                </button>
                {activeFaq === idx && (
                  <p className="text-sm text-[#475569] mt-3 leading-relaxed border-t border-[#F1F5F9] pt-3 font-sans">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-slate-400 py-12 border-t border-slate-800 text-xs font-sans">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white flex items-center justify-center font-bold text-sm">
              🏥
            </div>
            <span className="font-bold text-white font-poppins text-sm">CareFlow HMS Enterprise</span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <a href="#faq" className="hover:text-white transition-colors">FAQ & Help Center</a>
            <Link href="/login" className="hover:text-white transition-colors">Patient Login</Link>
            <Link href="/register" className="hover:text-white transition-colors">Register</Link>
          </div>
          <p className="text-slate-500">
            &copy; {new Date().getFullYear()} CareFlow Healthcare System. Built with Next.js 14 & Firebase.
          </p>
        </div>
      </footer>
    </div>
  );
}
