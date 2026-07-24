"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useUserNotifications } from "../../hooks/useNotification";
import { Bell, Menu, User as UserIcon, LogOut, Settings, Activity, X } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, signOut } = useAuth();
  const { notifications, markAsRead } = useUserNotifications(user?.id);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (e) {
      console.error("Sign out error", e);
    }
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case "patient":
        return "👤 Patient";
      case "doctor":
        return "👨‍⚕️ Doctor";
      case "admin":
        return "⚙️ Admin";
      default:
        return "User";
    }
  };

  const getRoleBadgeStyle = () => {
    switch (user?.role) {
      case "patient":
        return "bg-[#DFF1FF] text-[#0051CC] border-[#007AFF]/20";
      case "doctor":
        return "bg-[#FFE5E5] text-[#C41C3B] border-[#FF6B6B]/20";
      case "admin":
        return "bg-[#F3E8FF] text-[#6D28D9] border-[#8B5CF6]/20";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getNavLinks = () => {
    if (user?.role === "patient") {
      return [
        { name: "Dashboard", href: "/patient/dashboard" },
        { name: "Appointments", href: "/dashboard/appointments" },
        { name: "Medical Records & Bills", href: "/dashboard/billing" },
      ];
    }
    if (user?.role === "doctor") {
      return [
        { name: "Dashboard", href: "/doctor/dashboard" },
        { name: "Appointments", href: "/dashboard/appointments" },
        { name: "My Patients", href: "/dashboard/patients" },
      ];
    }
    if (user?.role === "admin") {
      return [
        { name: "Dashboard", href: "/admin/dashboard" },
        { name: "Users", href: "/admin/users" },
        { name: "Doctors", href: "/admin/doctors" },
        { name: "Create Doctor", href: "/admin/create-doctor" },
      ];
    }
    return [];
  };

  const navLinks = getNavLinks();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-[#E5E7EB] shadow-sm z-50 h-16 font-sans no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 hover:bg-[#F8FAFB] rounded-lg border border-[#E5E7EB] text-[#1F2937]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-[#007AFF] text-white p-1.5 rounded-lg text-lg flex items-center justify-center font-bold">
                🏥
              </div>
              <span className="text-xl font-bold text-[#1F2937] font-display tracking-tight">
                CareFlow
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {user && (
            <nav className="hidden md:flex gap-6 flex-1 justify-center">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-semibold transition-colors duration-150 py-1 border-b-2 ${
                      isActive
                        ? "text-[#007AFF] border-[#007AFF]"
                        : "text-[#6B7280] border-transparent hover:text-[#007AFF]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right Side Controls */}
          <div className="flex items-center gap-3">
            {user && (
              <>
                {/* Notifications Bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 hover:bg-[#F8FAFB] rounded-lg border border-[#E5E7EB] transition text-[#6B7280] hover:text-[#1F2937]"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF3B30] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-[#E5E7EB] p-4 z-55 animate-fade-in-up">
                      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2 mb-3">
                        <h3 className="font-semibold text-[#1F2937] text-sm font-display">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="text-xs font-bold text-[#007AFF]">{unreadCount} new</span>
                        )}
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-[#9CA3AF] text-center py-4">No recent notifications</p>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => markAsRead(notif.id)}
                              className={`p-3 rounded-lg border cursor-pointer transition ${
                                !notif.read ? "bg-[#DFF1FF]/40 border-[#007AFF]/20" : "bg-[#F8FAFB] border-[#E5E7EB]"
                              }`}
                            >
                              <p className="text-xs font-semibold text-[#1F2937]">{notif.title}</p>
                              <p className="text-xs text-[#6B7280] mt-0.5">{notif.message}</p>
                              <span className="text-[10px] text-[#9CA3AF] mt-1 block font-mono">
                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Menu */}
                <div className="relative" ref={userRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#F8FAFB] border border-transparent hover:border-[#E5E7EB] transition"
                  >
                    <div className="w-8 h-8 bg-[#007AFF] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                      {user.name ? user.name[0].toUpperCase() : "U"}
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getRoleBadgeStyle()}`}>
                      {getRoleLabel()}
                    </span>
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E5E7EB] overflow-hidden z-55 animate-fade-in-up">
                      <div className="p-4 border-b border-[#E5E7EB] bg-[#F8FAFB]">
                        <p className="font-semibold text-sm text-[#1F2937] truncate">{user.name}</p>
                        <p className="text-xs text-[#6B7280] truncate">{user.email}</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setShowUserDropdown(false)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F8FAFB] rounded-lg transition"
                        >
                          <UserIcon size={16} />
                          <span>Profile Settings</span>
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setShowUserDropdown(false)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F8FAFB] rounded-lg transition"
                        >
                          <Settings size={16} />
                          <span>System Settings</span>
                        </Link>
                      </div>
                      <div className="p-2 border-t border-[#E5E7EB]">
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            handleSignOut();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#FF3B30] hover:bg-[#FFEBEA] rounded-lg transition"
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-[#F8FAFB] rounded-lg text-[#6B7280]"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && user && (
          <div className="md:hidden border-t border-[#E5E7EB] bg-white py-3 space-y-2 px-2 animate-fade-in-up">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm font-semibold text-[#1F2937] hover:bg-[#F8FAFB] rounded-lg"
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

