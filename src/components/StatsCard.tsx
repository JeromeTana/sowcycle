"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

interface StatsCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  value: number;
  iconColor: string;
  unit?: string;
  className?: string;
  trendData?: { value: number }[];
  trendColor?: string;
}

export function StatsCard({
  icon: Icon,
  title,
  value,
  iconColor,
  unit = "ตัว",
  className,
  trendData,
  trendColor = "#ec4899",
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col bg-white rounded-2xl p-4 overflow-hidden relative",
        className
      )}
    >
      <div className="z-10 flex items-start justify-between">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className="p-2 rounded-full bg-gray-50">
          <Icon size={20} className={iconColor} />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="z-10 mt-2">
          <div className={cn("text-2xl font-bold")}>
            {value}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              {unit}
            </span>
          </div>
        </div>

        {trendData && trendData.length > 0 && (
          <div className="flex-1 h-12 pointer-events-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={trendColor}
                  fill="none"
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
