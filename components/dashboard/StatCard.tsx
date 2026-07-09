import React from "react";
import Card from "../common/Card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
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
  trend,
}: StatCardProps) {
  return (
    <Card className="flex items-center justify-between p-5">
      <div className="flex-1">
        <p className="text-xs font-bold text-healthcare-textMedium uppercase tracking-wider font-sans">{title}</p>
        <h4 className="text-2xl font-bold text-healthcare-textDark font-display mt-1 tracking-tight">{value}</h4>
        {trend && (
          <div className="flex items-center gap-1 mt-1.5 text-xs">
            <span className={`font-bold ${trend.isPositive ? "text-healthcare-success" : "text-healthcare-error"}`}>
              {trend.isPositive ? "↑" : "↓"} {trend.value}%
            </span>
            <span className="text-healthcare-textLight font-medium">since last month</span>
          </div>
        )}
        {!trend && description && (
          <p className="text-xs text-healthcare-textMedium mt-1.5 font-medium">{description}</p>
        )}
      </div>
      <div className="bg-blue-50 text-healthcare-primary p-3 rounded-full flex items-center justify-center ml-4">
        {icon}
      </div>
    </Card>
  );
}
