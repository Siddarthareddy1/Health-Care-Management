import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  color?: "indigo" | "purple" | "cyan" | "pink" | "green" | "orange" | "red";
  change?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({
  title,
  value,
  icon,
  description,
  color = "indigo",
  change,
  trend,
}: StatCardProps) {
  const colorStyles = {
    indigo: {
      cardBg: "bg-white border-[#E2E8F0] hover:border-indigo-300 hover:shadow-indigo-500/10",
      iconBg: "bg-indigo-50 text-[#6366F1] border border-indigo-100",
    },
    purple: {
      cardBg: "bg-white border-[#E2E8F0] hover:border-purple-300 hover:shadow-purple-500/10",
      iconBg: "bg-purple-50 text-[#8B5CF6] border border-purple-100",
    },
    cyan: {
      cardBg: "bg-white border-[#E2E8F0] hover:border-cyan-300 hover:shadow-cyan-500/10",
      iconBg: "bg-cyan-50 text-[#06B6D4] border border-cyan-100",
    },
    pink: {
      cardBg: "bg-white border-[#E2E8F0] hover:border-pink-300 hover:shadow-pink-500/10",
      iconBg: "bg-pink-50 text-[#EC4899] border border-pink-100",
    },
    green: {
      cardBg: "bg-white border-[#E2E8F0] hover:border-emerald-300 hover:shadow-emerald-500/10",
      iconBg: "bg-emerald-50 text-[#10B981] border border-emerald-100",
    },
    orange: {
      cardBg: "bg-white border-[#E2E8F0] hover:border-amber-300 hover:shadow-amber-500/10",
      iconBg: "bg-amber-50 text-[#F59E0B] border border-amber-100",
    },
    red: {
      cardBg: "bg-white border-[#E2E8F0] hover:border-rose-300 hover:shadow-rose-500/10",
      iconBg: "bg-rose-50 text-[#EF4444] border border-rose-100",
    },
  };

  const style = colorStyles[color] || colorStyles.indigo;

  return (
    <div className={`p-6 rounded-[12px] border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${style.cardBg}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-full ${style.iconBg} flex items-center justify-center text-xl shadow-xs shrink-0`}>
          {icon}
        </div>
        {change && (
          <span className="text-xs font-bold text-[#475569] bg-[#F1F5F9] border border-[#E2E8F0] px-2.5 py-1 rounded-full">
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold text-[#475569] mb-1 font-sans uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-extrabold text-[#0F172A] font-poppins tracking-tight">{value}</p>
        {trend && (
          <div className="flex items-center gap-1.5 mt-2 text-xs font-sans">
            <span className={`font-bold px-2 py-0.5 rounded-full ${
              trend.isPositive ? "bg-emerald-50 text-[#10B981] border border-emerald-200/60" : "bg-rose-50 text-[#EF4444] border border-rose-200/60"
            }`}>
              {trend.isPositive ? "↑" : "↓"} {trend.value}%
            </span>
            <span className="text-[#64748B] font-medium">vs last month</span>
          </div>
        )}
        {!trend && description && (
          <p className="text-xs text-[#64748B] mt-2 font-medium leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
}
