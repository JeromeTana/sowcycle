"use client";

import React from "react";
import {
  Home,
  Calendar,
  PiggyBank,
  Dna,
  Fence,
  Syringe,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    label: "หน้าหลัก",
    icon: Home,
  },
  {
    href: "/sows",
    label: "แม่พันธุ์",
    icon: PiggyBank,
  },
  // {
  //   href: "/boars",
  //   label: "สายพันธุ์",
  //   icon: Dna,
  // },
  {
    href: "/litters",
    label: "ครอก",
    icon: Fence,
  },
  {
    href: "/medicines",
    label: "ยาวัคซีน",
    icon: Syringe,
  },
  // {
  //   href: "/inventory",
  //   label: "เก็บของ",
  //   icon: LayoutGrid,
  // },
  {
    href: "/calendar",
    label: "Calendar",
    icon: Calendar,
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="z-50 flex items-center justify-center pt-2 p-4 bg-white">
      <nav className="grid grid-cols-5 gap-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-gray-600 md:hover:text-primary"
              }`}
            >
              <item.icon size={24} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
