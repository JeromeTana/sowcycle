"use client";

import React from "react";
import { ChevronLeft, LogOut, Settings, User } from "lucide-react";
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
          <PopoverContent align="end" className="w-56 p-2">
            <div className="grid gap-1">
              <div className="px-2 py-1.5 text-sm font-semibold text-gray-900">
                บัญชีผู้ใช้
              </div>
              <div className="h-px bg-gray-100 my-1" />
              <a
                href="/setting"
                className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Settings size={16} />
                <span>ตั้งค่า</span>
              </a>
              <LogoutButton>
                <div className="flex items-center gap-2 px-2 py-2 w-full text-left text-sm text-red-600 rounded-md hover:bg-red-50 transition-colors">
                  <LogOut size={16} />
                  <span>ออกจากระบบ</span>
                </div>
              </LogoutButton>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
