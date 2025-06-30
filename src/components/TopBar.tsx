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
    <div className="flex justify-end items-center">
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors">
            <User size={32} className="text-gray-600 bg-gray-200 rounded-full p-1.5" />
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
  );
}
