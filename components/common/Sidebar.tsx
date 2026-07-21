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

  const getLinks = () => {
    if (role === "admin") {
      return [
        { name: "Admin Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Create Doctor", href: "/admin/create-doctor", icon: UserPlus },
        { name: "Manage Users", href: "/admin/users", icon: ShieldCheck },
        { name: "Manage Doctors", href: "/admin/doctors", icon: Stethoscope },
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
      { name: "My Bills", href: "/dashboard/billing", icon: CreditCard },
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
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs z-40 lg:hidden no-print"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-45 w-64 bg-white border-r border-healthcare-border flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static lg:z-0 lg:h-[calc(100vh-64px)] no-print ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex-1 py-6 px-4 overflow-y-auto">
          <div className="flex items-center justify-between lg:hidden mb-6">
            <span className="font-bold text-healthcare-primary font-display">CareFlow Menu</span>
            <button 
              onClick={onClose}
              className="p-1 rounded-md hover:bg-healthcare-bgSecondary border border-healthcare-border text-healthcare-textDark"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4 px-2">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-healthcare-textLight">
              {role} Navigation
            </span>
          </div>

          <nav className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-standard text-sm font-semibold transition-all duration-150 font-sans ${
                    isActive
                      ? "bg-blue-50 text-healthcare-primary border-l-4 border-healthcare-primary pl-3"
                      : "text-healthcare-textMedium hover:text-healthcare-textDark hover:bg-healthcare-bgSecondary"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-healthcare-primary" : "text-healthcare-textMedium"}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Support section */}
        <div className="p-4 border-t border-healthcare-border">
          <Link
            href="/#faq"
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-healthcare-textMedium hover:text-healthcare-textDark rounded-standard hover:bg-healthcare-bgSecondary transition-all font-sans"
            onClick={onClose}
          >
            <HelpCircle className="w-5 h-5 text-healthcare-textMedium" />
            FAQ & Support
          </Link>
          <div className="text-[10px] text-healthcare-textLight px-4 pt-2 font-mono">
            v1.0.0 · Role-Secured Architecture
          </div>
        </div>
      </aside>
    </>
  );
}
