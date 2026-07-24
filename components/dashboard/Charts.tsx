"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

const revenueData = [
  { name: "Jan", revenue: 4200, appointments: 40 },
  { name: "Feb", revenue: 5600, appointments: 52 },
  { name: "Mar", revenue: 7100, appointments: 68 },
  { name: "Apr", revenue: 6400, appointments: 60 },
  { name: "May", revenue: 8900, appointments: 85 },
  { name: "Jun", revenue: 10400, appointments: 98 },
  { name: "Jul", revenue: 13200, appointments: 120 },
];

const specialtyData = [
  { name: "Cardiology", consultations: 48, color: "#0F766E" },
  { name: "Pediatrics", consultations: 34, color: "#0D9488" },
  { name: "Orthopedics", consultations: 28, color: "#0284C7" },
  { name: "Dermatology", consultations: 22, color: "#14B8A6" },
  { name: "Neurology", consultations: 18, color: "#6366F1" },
];

export function RevenueChart() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-72 bg-slate-100/70 rounded-2xl animate-pulse" />;
  }

  return (
    <div className="h-72 w-full font-sans">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenueTeal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0F766E" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} fontWeight={600} tickLine={false} />
          <YAxis stroke="#94A3B8" fontSize={11} fontWeight={600} tickFormatter={(v) => `$${v}`} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ 
              backgroundColor: "#FFFFFF", 
              borderRadius: "12px", 
              border: "1px solid #E2E8F0",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.08)",
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 600
            }}
            formatter={(value) => [`$${value}`, "Revenue"]}
          />
          <Area type="monotone" dataKey="revenue" stroke="#0F766E" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenueTeal)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SpecialtyChart() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-72 bg-slate-100/70 rounded-2xl animate-pulse" />;
  }

  return (
    <div className="h-72 w-full font-sans">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={specialtyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} fontWeight={600} tickLine={false} />
          <YAxis stroke="#94A3B8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ 
              backgroundColor: "#FFFFFF", 
              borderRadius: "12px", 
              border: "1px solid #E2E8F0",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.08)",
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 600
            }}
          />
          <Bar dataKey="consultations" radius={[8, 8, 0, 0]} maxBarSize={40}>
            {specialtyData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

