"use client";

import React from "react";
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-10 grid items-center w-full grid-cols-3 p-2 mb-6 bg-gradient-to-b from-background via-60% via-background to-background/0"
    >
      <div className="flex">
        {hasBack && (
          <button
            onClick={() => {
              window.history.back();
            }}
            className="p-2 bg-white border rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>
      <h1 className="text-lg font-semibold text-center">
        {title || "หน้าหลัก"}
      </h1>
      <div className="flex justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center justify-center p-2 transition-colors rounded-full hover:bg-gray-100">
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
              <div className="h-px my-1 bg-gray-100" />
              <a
                href="/setting"
                className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 transition-colors rounded-md hover:bg-gray-100"
              >
                <Settings size={16} />
                <span>ตั้งค่า</span>
              </a>
              <LogoutButton>
                <div className="flex items-center w-full gap-2 px-2 py-2 text-sm text-left text-red-600 transition-colors rounded-md hover:bg-red-50">
                  <LogOut size={16} />
                  <span>ออกจากระบบ</span>
                </div>
              </LogoutButton>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </motion.div>
  );
}
