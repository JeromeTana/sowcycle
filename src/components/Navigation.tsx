"use client";

import React from "react";
import { Home, Calendar, PiggyBank, Dna, Fence } from "lucide-react";
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
  {
    href: "/boars",
    label: "สายพันธุ์",
    icon: Dna,
  },
  {
    href: "/litters",
    label: "ครอก",
    icon: Fence,
  },
  {
    href: "/calendar",
    label: "Calendar",
    icon: Calendar,
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-2 left-0 right-0 w-fit m-auto rounded-full z-50 flex items-center justify-center py-2 px-8 bg-white backdrop-blur border border-gray-200">
      <nav className="grid grid-cols-5 gap-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 transition-colors ${
                isActive ? "text-pink-500" : "text-gray-600 hover:text-pink-500"
              }`}
            >
              <item.icon size={26} />
              <span className="text-xs mt-2">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
