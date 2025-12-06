"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  PiggyBank,
  Dna,
  Fence,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      label: "หน้าหลัก",
      icon: Home,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "แม่พันธุ์",
      icon: PiggyBank,
      href: "/sows",
      active: pathname === "/sows" || pathname.startsWith("/sows/"),
    },
    {
      label: "สายพันธุ์",
      icon: Dna,
      href: "/boars",
      active: pathname === "/boars" || pathname.startsWith("/boars/"),
    },
    {
      label: "ครอก",
      icon: Fence,
      href: "/litters",
      active: pathname === "/litters" || pathname.startsWith("/litters/"),
    },
    {
      label: "ปฏิทิน",
      icon: Calendar,
      href: "/calendar",
      active: pathname === "/calendar" || pathname.startsWith("/calendar/"),
    },
  ];

  return (
    <div className={cn("pb-12 min-h-screen border-r bg-white", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mb-6 px-4 flex items-center">
             <h2 className="text-2xl font-bold tracking-tight text-pink-600">
              SowCycle
            </h2>
          </div>

          <div className="space-y-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={route.active ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start font-normal",
                  route.active
                    ? "bg-pink-50 text-pink-600 hover:bg-pink-100 hover:text-pink-700"
                    : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
                )}
                asChild
              >
                <Link href={route.href}>
                  <route.icon className={cn("mr-2 h-5 w-5", route.active ? "text-pink-600" : "text-gray-500")} />
                  {route.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
