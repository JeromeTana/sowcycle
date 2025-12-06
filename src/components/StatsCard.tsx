"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { CountUp } from "./animations/CountUp";
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
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "flex flex-col bg-white rounded-xl p-4 overflow-hidden relative",
        className,
      )}
    >
      <div className="flex justify-between items-start z-10">
        <div className="text-sm text-muted-foreground font-medium">{title}</div>
        <div className="p-2 bg-gray-50 rounded-full">
          <Icon size={20} className={iconColor} />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="mt-2 z-10">
          <div className="text-2xl font-bold">
            {value}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              {unit}
            </span>
          </div>
        </div>

        {trendData && trendData.length > 0 && (
          <div className="h-12 pointer-events-none flex-1">
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
    </motion.div>
  );
}
