"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function DashboardRouterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login");
      } else if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (user.role === "doctor") {
        router.push("/doctor/dashboard");
      } else if (user.role === "patient") {
        router.push("/patient/dashboard");
      } else {
        router.push("/patient/dashboard");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-healthcare-bgSecondary flex flex-col items-center justify-center p-4 font-sans">
      <svg className="animate-spin h-10 w-10 text-healthcare-primary mb-4" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <span className="font-semibold text-healthcare-textMedium text-sm">
        Directing to your secure portal...
      </span>
    </div>
  );
}
