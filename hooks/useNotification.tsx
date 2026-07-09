"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Notification } from "../types";
import { getNotifications, markNotificationRead } from "../lib/firestore";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (type: ToastType, title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, title: string, message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function useUserNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await getNotifications(userId);
      setNotifications(data);
    } catch (e) {
      console.warn("Failed to fetch notifications:", e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const markAsRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) => 
        prev.map((n) => n.id === id ? { ...n, read: true } : n)
      );
    } catch (e) {
      console.warn("Failed to mark notification read:", e);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [userId, fetchNotifications]);

  return { notifications, loading, refresh: fetchNotifications, markAsRead };
}
