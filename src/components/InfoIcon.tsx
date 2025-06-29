import { cn } from "@/lib/utils";
import React from "react";

interface InfoIconProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  label: string;
  icon: React.ReactNode;
  className?: string;
}

export default function InfoIcon({
  children,
  label,
  icon,
  className,
}: InfoIconProps) {
  return (
    <div className="inline-flex items-start gap-2 text-muted-foreground">
      <div
        className={cn(
          className,
          "bg-gray-50 text-muted-foreground border p-2 rounded-lg"
        )}
      >
        {icon}
      </div>
      <p className="inline-flex flex-col gap-1">
        <span className="text-xs">{label}</span>
        <span className="text-black">{children}</span>
      </p>
    </div>
  );
}
