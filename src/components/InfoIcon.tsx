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
          "bg-muted text-muted-foreground p-3 rounded-xl",
          className
        )}
      >
        {icon}
      </div>
      <div className="inline-flex flex-col gap-1">
        <div className="text-sm">{label}</div>
        <div className="text-black">{children}</div>
      </div>
    </div>
  );
}
