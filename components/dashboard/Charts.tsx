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
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 5200 },
  { name: "Mar", revenue: 6800 },
  { name: "Apr", revenue: 6100 },
  { name: "May", revenue: 8500 },
  { name: "Jun", revenue: 9800 },
  { name: "Jul", revenue: 12500 },
];

const specialtyData = [
  { name: "Cardiology", appointments: 45, color: "#1E40AF" },
  { name: "Pediatrics", appointments: 30, color: "#3B82F6" },
  { name: "Orthopedics", appointments: 25, color: "#10B981" },
  { name: "Dermatology", appointments: 20, color: "#F59E0B" },
  { name: "Neurology", appointments: 15, color: "#EF4444" },
];

export function RevenueChart() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-72 bg-healthcare-bgSecondary rounded-standard animate-pulse" />;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#1E40AF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="name" stroke="#6B7280" fontSize={11} fontWeight={600} />
          <YAxis stroke="#6B7280" fontSize={11} fontWeight={600} tickFormatter={(v) => `$${v}`} />
          <Tooltip
            contentStyle={{ 
              backgroundColor: "#FFFFFF", 
              borderRadius: "8px", 
              border: "1px solid #E5E7EB",
              fontFamily: "Inter, sans-serif"
            }}
            formatter={(value) => [`$${value}`, "Revenue"]}
          />
          <Area type="monotone" dataKey="revenue" stroke="#1E40AF" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
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
    return <div className="h-72 bg-healthcare-bgSecondary rounded-standard animate-pulse" />;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={specialtyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="name" stroke="#6B7280" fontSize={11} fontWeight={600} />
          <YAxis stroke="#6B7280" fontSize={11} fontWeight={600} />
          <Tooltip
            contentStyle={{ 
              backgroundColor: "#FFFFFF", 
              borderRadius: "8px", 
              border: "1px solid #E5E7EB",
              fontFamily: "Inter, sans-serif"
            }}
          />
          <Bar dataKey="appointments" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={45}>
            {specialtyData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
