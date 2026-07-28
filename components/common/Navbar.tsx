"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useUserNotifications } from "../../hooks/useNotification";
import { Bell, Menu, User as UserIcon, LogOut, Settings, Search, Command, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, signOut } = useAuth();
  const { notifications, markAsRead } = useUserNotifications(user?.id);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

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

    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearchModal(prev => !prev);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
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
        return "Patient Portal";
      case "doctor":
        return "Doctor Console";
      case "admin":
        return "System Admin";
      default:
        return "Member";
    }
  };

  const getRoleBadgeStyle = () => {
    switch (user?.role) {
      case "patient":
        return "bg-indigo-50 text-indigo-700 border-indigo-200/80";
      case "doctor":
        return "bg-purple-50 text-purple-700 border-purple-200/80";
      case "admin":
        return "bg-pink-50 text-pink-700 border-pink-200/80";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const searchShortcuts = [
    { title: "Dashboard Overview", href: `/${user?.role || 'patient'}/dashboard` },
    { title: "Appointments Schedule", href: "/dashboard/appointments" },
    { title: "Billing & Medical Records", href: "/dashboard/billing" },
    { title: "Profile Settings", href: "/dashboard/profile" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-sm z-50 h-16 font-sans no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full gap-4">
          {/* Logo & Sidebar Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 text-slate-700 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-500/20">
                🏥
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-[#0F172A] font-poppins tracking-tight leading-none">
                  CareFlow
                </span>
                <span className="text-[10px] font-bold text-[#6366F1] uppercase tracking-widest font-mono">Healthcare System</span>
              </div>
            </Link>
          </div>

          {/* Global Search Bar (Trigger) */}
          {user && (
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <button
                onClick={() => setShowSearchModal(true)}
                className="w-full flex items-center justify-between px-4 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl text-xs text-slate-500 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-400" />
                  <span>Search patients, doctors, appointments...</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded-md text-slate-500 shadow-2xs">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </div>
              </button>
            </div>
          )}

          {/* Right Side Controls */}
          <div className="flex items-center gap-3">
            {user && (
              <>
                {/* Search icon button for mobile */}
                <button
                  onClick={() => setShowSearchModal(true)}
                  className="md:hidden p-2 hover:bg-slate-100 rounded-xl border border-slate-200/80 text-slate-600"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Notifications Bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 hover:bg-slate-100 rounded-xl border border-slate-200/80 transition text-slate-600 hover:text-slate-900"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-55 animate-fade-in-up">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                        <h3 className="font-bold text-slate-900 text-sm font-poppins">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                            {unreadCount} unread
                          </span>
                        )}
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-6 font-sans">No new notifications</p>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => markAsRead(notif.id)}
                              className={`p-3 rounded-xl border cursor-pointer transition ${
                                !notif.read ? "bg-indigo-50/50 border-indigo-200/60" : "bg-slate-50 border-slate-200/60"
                              }`}
                            >
                              <p className="text-xs font-bold text-slate-900 font-poppins">{notif.title}</p>
                              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-sans">{notif.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Menu Dropdown */}
                <div className="relative" ref={userRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition"
                  >
                    <div className="w-9 h-9 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/20">
                      {user.name ? user.name[0].toUpperCase() : "U"}
                    </div>
                    <span className={`hidden sm:inline-flex text-xs font-bold px-2.5 py-1 rounded-full border ${getRoleBadgeStyle()}`}>
                      {getRoleLabel()}
                    </span>
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-55 animate-fade-in-up">
                      <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <p className="font-bold text-sm text-slate-900 font-poppins truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate mt-0.5 font-sans">{user.email}</p>
                        <span className="inline-block text-[10px] font-bold text-indigo-600 uppercase tracking-wider mt-2 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {user.role} active session
                        </span>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setShowUserDropdown(false)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                        >
                          <UserIcon size={16} className="text-indigo-500" />
                          <span>My Profile Settings</span>
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setShowUserDropdown(false)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                        >
                          <Settings size={16} className="text-indigo-500" />
                          <span>System Preferences</span>
                        </Link>
                      </div>
                      <div className="p-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            handleSignOut();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition"
                        >
                          <LogOut size={16} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Global Search Modal Overlay */}
      {showSearchModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/40 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in-up">
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <Search className="w-5 h-5 text-indigo-600" />
              <input
                type="text"
                autoFocus
                placeholder="Type to search patients, appointments, billing invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none text-sm text-slate-900 focus:outline-none placeholder-slate-400 font-sans"
              />
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Quick Shortcuts
              </span>
              {searchShortcuts.map((s, idx) => (
                <Link
                  key={idx}
                  href={s.href}
                  onClick={() => setShowSearchModal(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50/60 border border-transparent hover:border-indigo-100 text-xs font-semibold text-slate-700 transition font-sans"
                >
                  <span>{s.title}</span>
                  <span className="text-[10px] text-indigo-600 font-mono font-bold">Jump →</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
