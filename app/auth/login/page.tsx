"use client";

import React from "react";
import LoginForm from "../../../components/auth/LoginForm";
import Card from "../../../components/common/Card";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] flex flex-col items-center justify-center p-4 font-sans text-[#0F172A]">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Link href="/" className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-500/25">
              🏥
            </div>
            <span className="font-bold text-3xl text-[#0F172A] font-poppins tracking-tight">CareFlow</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#6366F1] text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#EC4899]" /> Secure Enterprise Portal
          </div>
        </div>

        <Card title="Welcome Back" subtitle="Sign in to your patient, doctor, or admin account." hoverable={false} className="shadow-md border-[#E2E8F0]">
          <LoginForm />
        </Card>
      </div>
    </div>
  );
}
