"use client";

import React from "react";
import { Home, Calendar, Heart, Users, PiggyBank } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="sticky bottom-0 left-0 right-0 w-full z-50 flex items-center justify-center py-2 px-4 bg-white/80 backdrop-blur border-t border-gray-200">
      <nav className="grid grid-cols-2 gap-8">
        {/* <Link
          href="/"
          className="flex flex-col items-center justify-center text-gray-600 py-2"
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </Link> */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-2 transition-colors ${
            pathname === "/" ? "text-pink-500" : "text-gray-600 hover:text-pink-500"
          }`}
        >
          <PiggyBank size={22} />
          <span className="text-xs mt-1">Sows</span>
        </Link>
        {/* <Link
          href="/breeding"
          className="flex flex-col items-center justify-center text-gray-600 py-2"
        >
          <Heart size={20} />
          <span className="text-xs mt-1">Breeding</span>
        </Link> */}
        <Link
          href="/calendar"
          className={`flex flex-col items-center justify-center py-2 transition-colors ${
            pathname === "/calendar" ? "text-pink-500" : "text-gray-600 hover:text-pink-500"
          }`}
        >
          <Calendar size={22} />
          <span className="text-xs mt-1">Calendar</span>
        </Link>
      </nav>
    </div>
  );
}
