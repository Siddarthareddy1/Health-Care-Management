"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  CreditCard, 
  User, 
  Settings,
  UserPlus,
  Stethoscope,
  ShieldCheck,
  HelpCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Activity,
  FileText
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const role = user?.role || "patient";

  const getLinks = () => {
    if (role === "admin") {
      return [
        { name: "Admin Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Create Doctor", href: "/admin/create-doctor", icon: UserPlus },
        { name: "User Directory", href: "/admin/users", icon: ShieldCheck },
        { name: "Doctor Roster", href: "/admin/doctors", icon: Stethoscope },
        { name: "Appointments", href: "/dashboard/appointments", icon: Calendar },
        { name: "Patients List", href: "/dashboard/patients", icon: Users },
        { name: "Billing & Financials", href: "/dashboard/billing", icon: CreditCard },
        { name: "Admin Profile", href: "/dashboard/profile", icon: User },
        { name: "System Settings", href: "/dashboard/settings", icon: Settings },
      ];
    }

    if (role === "doctor") {
      return [
        { name: "Doctor Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
        { name: "My Appointments", href: "/dashboard/appointments", icon: Calendar },
        { name: "Assigned Patients", href: "/dashboard/patients", icon: Users },
        { name: "Doctor Profile", href: "/dashboard/profile", icon: User },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
      ];
    }

    // Patient links
    return [
      { name: "Patient Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
      { name: "My Appointments", href: "/dashboard/appointments", icon: Calendar },
      { name: "Medical Records & Bills", href: "/dashboard/billing", icon: CreditCard },
      { name: "My Profile", href: "/dashboard/profile", icon: User },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ];
  };

  const links = getLinks();

  return (
    <>
      {/* Mobile Sidebar Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 lg:hidden no-print"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-45 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-all duration-300 lg:translate-x-0 lg:static lg:z-0 lg:h-[calc(100vh-64px)] pt-16 lg:pt-0 no-print shadow-subtle ${
          isCollapsed ? "lg:w-20" : "lg:w-64"
        } ${
          isOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex-1 py-6 px-3 overflow-y-auto">
          {/* Mobile Top Close */}
          <div className="flex items-center justify-between lg:hidden mb-6 px-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                🏥
              </div>
              <span className="font-bold text-slate-900 font-display text-base">CareFlow HMS</span>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 border border-slate-200 text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Header Section */}
          {!isCollapsed && (
            <div className="hidden lg:flex items-center justify-between mb-4 px-3">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 font-mono">
                {role} Navigation
              </span>
              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Collapse Sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {isCollapsed && onToggleCollapse && (
            <div className="hidden lg:flex justify-center mb-4">
              <button
                onClick={onToggleCollapse}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200/80 shadow-xs"
                title="Expand Sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Links list */}
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={onClose}
                  title={isCollapsed ? link.name : undefined}
                  className={`flex items-center ${
                    isCollapsed ? "justify-center px-0 py-3" : "gap-3 px-3.5 py-2.5"
                  } rounded-xl text-xs font-semibold transition-all duration-150 font-sans ${
                    isActive
                      ? "bg-teal-50 text-teal-700 font-bold border border-teal-200/80 shadow-subtle"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-teal-600" : "text-slate-400"}`} />
                  {!isCollapsed && <span className="truncate">{link.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer section */}
        <div className="p-3 border-t border-slate-200/80">
          <Link
            href="/#faq"
            className={`flex items-center ${
              isCollapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3.5 py-2"
            } text-xs font-semibold text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-all font-sans`}
            onClick={onClose}
            title={isCollapsed ? "Support & FAQ" : undefined}
          >
            <HelpCircle className="w-4.5 h-4.5 text-slate-400 shrink-0" />
            {!isCollapsed && <span>Support & FAQ</span>}
          </Link>
          {!isCollapsed && (
            <div className="text-[10px] text-slate-400 px-3.5 pt-2 font-mono">
              v2.0.0 · CareFlow Enterprise
            </div>
          )}
        </div>
      </aside>
    </>
  );
}


