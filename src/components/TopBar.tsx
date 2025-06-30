"use client";

import React from "react";
import { User } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import LogoutButton from "@/components/LogoutButton";

export default function TopBar() {
  return (
    <div className="sticky top-0 left-0 right-0 w-full z-50 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-screen-sm mx-auto flex justify-between items-center px-4 py-3">
        <h1 className="text-lg font-semibold text-pink-500">SowCycle</h1>
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors">
              <User size={20} className="text-gray-600" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-48">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-900 border-b pb-2">
                Account
              </div>
              <LogoutButton>
                <div className="w-full text-left text-sm text-red-500 hover:text-red-700 py-1 transition-colors">
                  Logout
                </div>
              </LogoutButton>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
