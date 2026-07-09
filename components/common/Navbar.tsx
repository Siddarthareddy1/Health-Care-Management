"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useUserNotifications } from "../../hooks/useNotification";
import { Bell, Menu, User as UserIcon, LogOut, Settings, Activity } from "lucide-react";
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

  return (
    <nav className="bg-white border-b border-healthcare-border h-16 px-6 flex items-center justify-between sticky top-0 z-30 shadow-subtle no-print font-sans">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-md hover:bg-healthcare-bgSecondary border border-healthcare-border text-healthcare-textDark"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-healthcare-primary text-white p-1.5 rounded-md">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-healthcare-primary font-display tracking-tight">CareFlow</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-md hover:bg-healthcare-bgSecondary border border-healthcare-border text-healthcare-textMedium hover:text-healthcare-textDark relative transition-all"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-healthcare-error text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-healthcare-border rounded-standard shadow-lg z-55 py-2">
              <div className="px-4 py-2 border-b border-healthcare-border flex items-center justify-between">
                <span className="font-semibold text-healthcare-textDark text-sm font-display">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-xs text-healthcare-accent font-semibold">{unreadCount} new</span>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-healthcare-textLight">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`px-4 py-3 border-b border-healthcare-border last:border-0 hover:bg-healthcare-bgSecondary cursor-pointer transition-all ${
                        !notif.read ? "bg-blue-50/40" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold ${!notif.read ? "text-healthcare-primary" : "text-healthcare-textDark"}`}>
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-healthcare-textLight">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-healthcare-textMedium mt-0.5 leading-normal">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 p-1.5 rounded-md hover:bg-healthcare-bgSecondary transition-all border border-transparent hover:border-healthcare-border"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-healthcare-border object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-healthcare-primary text-white flex items-center justify-center font-bold text-sm">
                {user?.name ? user.name[0] : "U"}
              </div>
            )}
            <div className="hidden md:flex flex-col items-start text-left">
              <span className="text-xs font-bold text-healthcare-textDark line-clamp-1">{user?.name || "Guest User"}</span>
              <span className="text-[10px] font-semibold text-healthcare-textMedium uppercase tracking-wider">{user?.role}</span>
            </div>
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-healthcare-border rounded-standard shadow-lg z-55 py-1">
              <div className="px-4 py-2 border-b border-healthcare-border">
                <p className="text-xs font-semibold text-healthcare-textMedium">Signed in as</p>
                <p className="text-xs font-bold text-healthcare-textDark truncate mt-0.5">{user?.email}</p>
              </div>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2 px-4 py-2 text-xs text-healthcare-textDark hover:bg-healthcare-bgSecondary font-medium"
                onClick={() => setShowUserDropdown(false)}
              >
                <UserIcon className="w-4 h-4 text-healthcare-textMedium" />
                My Profile
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-2 px-4 py-2 text-xs text-healthcare-textDark hover:bg-healthcare-bgSecondary font-medium"
                onClick={() => setShowUserDropdown(false)}
              >
                <Settings className="w-4 h-4 text-healthcare-textMedium" />
                Settings
              </Link>
              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  handleSignOut();
                }}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs text-healthcare-error hover:bg-red-50 font-bold border-t border-healthcare-border"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
