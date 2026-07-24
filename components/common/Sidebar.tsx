"use client";

import React from "react";
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
  X
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const role = user?.role || "patient";

  const getActiveStyles = () => {
    switch (role) {
      case "patient":
        return "bg-[#DFF1FF] text-[#0051CC] border-l-4 border-[#007AFF]";
      case "doctor":
        return "bg-[#FFE5E5] text-[#C41C3B] border-l-4 border-[#FF6B6B]";
      case "admin":
        return "bg-[#F3E8FF] text-[#6D28D9] border-l-4 border-[#8B5CF6]";
      default:
        return "bg-[#DFF1FF] text-[#0051CC] border-l-4 border-[#007AFF]";
    }
  };

  const getLinks = () => {
    if (role === "admin") {
      return [
        { name: "Admin Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Create Doctor Account", href: "/admin/create-doctor", icon: UserPlus },
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
  const activeStyle = getActiveStyles();

  return (
    <>
      {/* Mobile Sidebar Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs z-40 lg:hidden no-print"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-45 w-64 bg-white border-r border-[#E5E7EB] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static lg:z-0 lg:h-[calc(100vh-64px)] pt-16 lg:pt-0 no-print ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex-1 py-6 px-4 overflow-y-auto">
          <div className="flex items-center justify-between lg:hidden mb-6">
            <span className="font-bold text-[#007AFF] font-display text-lg">CareFlow Menu</span>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#F8FAFB] border border-[#E5E7EB] text-[#1F2937]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-3 px-2">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#9CA3AF]">
              {role} portal navigation
            </span>
          </div>

          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 font-sans ${
                    isActive
                      ? activeStyle
                      : "text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F8FAFB]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Support section */}
        <div className="p-4 border-t border-[#E5E7EB]">
          <Link
            href="/#faq"
            className="flex items-center gap-3 px-3.5 py-2 text-xs font-semibold text-[#6B7280] hover:text-[#1F2937] rounded-lg hover:bg-[#F8FAFB] transition-all font-sans"
            onClick={onClose}
          >
            <HelpCircle className="w-4 h-4 text-[#9CA3AF]" />
            <span>Support & Documentation</span>
          </Link>
          <div className="text-[10px] text-[#9CA3AF] px-3.5 pt-2 font-mono">
            v1.0.0 · CareFlow UI Design System
          </div>
        </div>
      </aside>
    </>
  );
}

