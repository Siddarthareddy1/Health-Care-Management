import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  color?: "blue" | "green" | "orange" | "red" | "purple";
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
  color = "blue",
  change,
  trend,
}: StatCardProps) {
  const colorStyles = {
    blue: {
      cardBg: "bg-white border-[#007AFF]/20 hover:border-[#007AFF]/40",
      iconBg: "bg-[#DFF1FF] text-[#007AFF]",
    },
    green: {
      cardBg: "bg-white border-[#34C759]/20 hover:border-[#34C759]/40",
      iconBg: "bg-[#E8F8EC] text-[#34C759]",
    },
    orange: {
      cardBg: "bg-white border-[#FF9500]/20 hover:border-[#FF9500]/40",
      iconBg: "bg-[#FFF4E5] text-[#FF9500]",
    },
    red: {
      cardBg: "bg-white border-[#FF3B30]/20 hover:border-[#FF3B30]/40",
      iconBg: "bg-[#FFEBEA] text-[#FF3B30]",
    },
    purple: {
      cardBg: "bg-white border-[#8B5CF6]/20 hover:border-[#8B5CF6]/40",
      iconBg: "bg-[#F3E8FF] text-[#8B5CF6]",
    },
  };

  const style = colorStyles[color];

  return (
    <div className={`p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 ${style.cardBg}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 rounded-xl ${style.iconBg} text-xl flex items-center justify-center`}>
          {icon}
        </div>
        {change && (
          <span className="text-xs font-semibold text-[#6B7280] bg-[#F8FAFB] border border-[#E5E7EB] px-2.5 py-1 rounded-full">
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold text-[#6B7280] mb-1 font-sans">{title}</p>
        <p className="text-3xl font-extrabold text-[#1F2937] font-display tracking-tight">{value}</p>
        {trend && (
          <div className="flex items-center gap-1 mt-2 text-xs">
            <span className={`font-bold ${trend.isPositive ? "text-[#34C759]" : "text-[#FF3B30]"}`}>
              {trend.isPositive ? "↑" : "↓"} {trend.value}%
            </span>
            <span className="text-[#9CA3AF] font-medium">vs last month</span>
          </div>
        )}
        {!trend && description && (
          <p className="text-xs text-[#6B7280] mt-2 font-medium">{description}</p>
        )}
      </div>
    </div>
  );
}

