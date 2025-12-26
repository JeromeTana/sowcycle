"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface StatsCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  value: number;
  iconColor: string;
  unit?: string;
  className?: string;
  trendData?: { value: number }[];
  trendColor?: string;
  variant?: "default" | "vertical";
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
  variant = "default",
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
        {/* <div className="p-2 rounded-full bg-gray-50">
          <Icon size={20} className={iconColor} />
        </div> */}
        <ChevronRight size={20} className="text-muted-foreground" />
      </div>

      <div
        className={cn(
          "flex",
          variant === "vertical" ? "flex-col gap-2" : "gap-4 mt-8"
        )}
      >
        <div className="z-10 mt-2  flex-1">
          <div
            className={cn(
              "font-bold",
              iconColor,
              variant === "vertical" ? "text-2xl " : "text-3xl"
            )}
          >
            {value}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              {unit}
            </span>
          </div>
        </div>

        {trendData && trendData.length > 0 && (
          <div
            className={cn(
              "pointer-events-none min-w-0",
              variant === "vertical" ? "h-20 w-full mt-4" : "flex-1 h-12"
            )}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={trendColor}
                  fill={trendColor}
                  fillOpacity={0.1}
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
