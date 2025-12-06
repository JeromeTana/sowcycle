import { cn } from "@/lib/utils";
import React from "react";

interface StatsCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  value: number;
  iconColor: string;
  unit?: string;
  className?: string;
}

export function StatsCard({
  icon: Icon,
  title,
  value,
  iconColor,
  unit = "ตัว",
  className,
}: StatsCardProps) {
  return (
    <div className={cn("flex flex-col bg-white rounded-xl p-4", className)}>
      <div className="flex justify-between">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="p-2 bg-gray-100 rounded-full">
          <Icon size={20} className={iconColor} />
        </div>
      </div>
      <div className="text-2xl font-bold">
        {value} <span className="text-sm">{unit}</span>
      </div>
    </div>
  );
}
