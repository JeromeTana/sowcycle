"use client";

import React from "react";
import { ChevronLeft, Settings, User } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import LogoutButton from "@/components/LogoutButton";

export default function TopBar({
  title,
  hasBack,
}: {
  title?: string;
  hasBack?: boolean;
}) {
  return (
    <div className="grid grid-cols-3 w-full items-center mb-4">
      <div className="flex">
        {hasBack && (
          <button
            onClick={() => {
              window.history.back();
            }}
            className="p-2 bg-white rounded-full border"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>
      <h1 className="text-center text-lg font-semibold">
        {title || "หน้าหลัก"}
      </h1>
      <div className="flex justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors">
              <User
                size={32}
                className="text-gray-600 bg-gray-200 rounded-full p-1.5"
              />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-48">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-900 border-b pb-2">
                Account
              </div>
              <a
                href="/setting"
                className="text-sm font-medium text-gray-900 border-b pb-2"
              >
                Settings
              </a>
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
