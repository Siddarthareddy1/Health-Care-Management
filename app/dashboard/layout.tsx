"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-healthcare-bgSecondary flex flex-col items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-healthcare-primary mb-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="font-semibold text-healthcare-textMedium text-sm font-sans">Verifying security session...</span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-healthcare-bgSecondary flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
