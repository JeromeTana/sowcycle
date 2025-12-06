"use client";

import React from "react";
import { Home, Calendar, PiggyBank, Dna, Fence } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full z-50 flex items-center justify-center py-2 px-4 bg-white/80 backdrop-blur border-t border-gray-200">
      <nav className="grid grid-cols-5 gap-6">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-2 transition-colors ${
            pathname === "/"
              ? "text-pink-500"
              : "text-gray-600 hover:text-pink-500"
          }`}
        >
          <Home size={20} />
          <span className="text-xs mt-1">หน้าหลัก</span>
        </Link>
        <Link
          href="/sows"
          className={`flex flex-col items-center justify-center py-2 transition-colors ${
            pathname === "/sows"
              ? "text-pink-500"
              : "text-gray-600 hover:text-pink-500"
          }`}
        >
          <PiggyBank size={22} />
          <span className="text-xs mt-1">แม่พันธุ์</span>
        </Link>
        <Link
          href="/boars"
          className={`flex flex-col items-center justify-center py-2 transition-colors ${
            pathname === "/boars"
              ? "text-pink-500"
              : "text-gray-600 hover:text-pink-500"
          }`}
        >
          <Dna size={22} />
          <span className="text-xs mt-1">สายพันธุ์</span>
        </Link>
        <Link
          href="/litters"
          className={`flex flex-col items-center justify-center py-2 transition-colors ${
            pathname === "/litters"
              ? "text-pink-500"
              : "text-gray-600 hover:text-pink-500"
          }`}
        >
          <Fence size={22} />
          <span className="text-xs mt-1">ครอก</span>
        </Link>
        <Link
          href="/calendar"
          className={`flex flex-col items-center justify-center py-2 transition-colors ${
            pathname === "/calendar"
              ? "text-pink-500"
              : "text-gray-600 hover:text-pink-500"
          }`}
        >
          <Calendar size={22} />
          <span className="text-xs mt-1">Calendar</span>
        </Link>
      </nav>
    </div>
  );
}
