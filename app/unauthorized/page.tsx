"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ShieldAlert, ArrowLeft, Home, Lock } from "lucide-react";
import Button from "@/components/common/Button";

export default function UnauthorizedPage() {
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return "/auth/login";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "doctor") return "/doctor/dashboard";
    return "/patient/dashboard";
  };

  return (
    <div className="min-h-screen bg-healthcare-bgSecondary flex items-center justify-center p-4 font-sans text-healthcare-textDark">
      <div className="w-full max-w-md bg-white border border-healthcare-border rounded-standard p-8 shadow-card text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-red-100 text-healthcare-error rounded-full flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="px-2.5 py-1 rounded text-[10px] font-extrabold uppercase bg-red-50 text-red-700 border border-red-200 tracking-wider">
            HTTP 403 · Access Denied
          </span>
          <h1 className="text-2xl font-extrabold text-healthcare-textDark font-display mt-3">
            Unauthorized Privilege Level
          </h1>
          <p className="text-xs text-healthcare-textMedium mt-2 leading-relaxed">
            You do not have the required security permissions to access this page. Access is strictly restricted based on assigned role policies (Patient, Doctor, or Administrator).
          </p>
        </div>

        {user && (
          <div className="p-3 bg-healthcare-bgSecondary rounded-standard border border-healthcare-border text-xs text-left">
            <span className="text-[10px] uppercase font-bold text-healthcare-textMedium block">Your Signed In Account:</span>
            <div className="flex justify-between items-center mt-1">
              <span className="font-bold text-healthcare-textDark truncate">{user.email}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800 border border-blue-200">
                {user.role}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 pt-2">
          <Link href={getDashboardPath()}>
            <Button variant="primary" fullWidth className="justify-center gap-2">
              <Home className="w-4 h-4" /> Return to Authorized Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" fullWidth className="justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Go to Home Page
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
