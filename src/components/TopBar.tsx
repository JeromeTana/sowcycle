"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { getCurrentUser } from "@/services/auth";
import DrawerDialog from "@/components/DrawerDialog";
import LogoutButton from "@/components/LogoutButton";
import { Button } from "./ui/button";
import BoarsContent from "@/components/Boar/BoarsContent";
import DurationSetting from "@/components/Settings/DurationSetting";

type AccountMenuProps = {
  setDialog?: React.Dispatch<React.SetStateAction<boolean>>;
  isDialogOpen?: boolean;
};

function AccountMenu({ setDialog }: AccountMenuProps) {
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const user = await getCurrentUser();
        if (isMounted) {
          setUserEmail(user?.email ?? null);
        }
      } catch (error) {
        console.error("Failed to load user details", error);
      } finally {
        if (isMounted) {
          setIsLoadingUser(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const emailDisplay = isLoadingUser
    ? "กำลังโหลด..."
    : userEmail ?? "ไม่พบอีเมล";

  const closeDialog = React.useCallback(() => {
    setDialog?.(false);
  }, [setDialog]);

  return (
    <div className="grid gap-4">
      <div className="bg-muted rounded-3xl p-4">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 rounded-full bg-neutral-300" />
          <p className="text-muted-foreground">{emailDisplay}</p>
        </div>
      </div>
      <DrawerDialog
        title="สายพันธุ์"
        dialogTriggerButton={
          <Button
            variant={"secondary"}
            size={"lg"}
            className="w-full px-4 justify-between"
          >
            <span>สายพันธุ์</span>
            <ChevronRight size={20} className="text-muted-foreground" />
          </Button>
        }
      >
        <BoarsContent />
      </DrawerDialog>
      <div className="flex flex-col overflow-clip rounded-3xl divide-y ">
        <DrawerDialog
          title="ตั้งค่าระยะเวลาตั้งครรภ์"
          dialogTriggerButton={
            <Button
              variant={"secondary"}
              size={"lg"}
              className="w-full justify-between px-4 rounded-none"
            >
              <span>ระยะเวลาตั้งครรภ์</span>
              <ChevronRight size={20} className="text-muted-foreground" />
            </Button>
          }
        >
          <DurationSetting
            title="ระยะเวลาตั้งครรภ์ (วัน)"
            settingKey="pregnancyDuration"
            defaultDuration={114}
            min={100}
            max={130}
            description="ระยะเวลาการตั้งครรภ์ของแม่สุกร (ปกติ 114 วัน)"
          />
        </DrawerDialog>

        <DrawerDialog
          title="ตั้งค่าระยะเวลาเลี้ยงขุน"
          dialogTriggerButton={
            <Button
              variant={"secondary"}
              size={"lg"}
              className="w-full justify-between px-4 rounded-none"
            >
              <span>ระยะเวลาเลี้ยงขุน</span>
              <ChevronRight size={20} className="text-muted-foreground" />
            </Button>
          }
        >
          <DurationSetting
            title="ระยะเวลาเลี้ยงขุน (วัน)"
            settingKey="fatteningDuration"
            defaultDuration={145}
            min={120}
            max={180}
            description="ระยะเวลาการเลี้ยงขุนลูกสุกร (ปกติ 145 วัน)"
          />
        </DrawerDialog>
      </div>
      <LogoutButton>
        <Button
          variant={"secondary"}
          size={"lg"}
          className="w-full justify-start text-red-500 px-4"
        >
          {/* <LogOut size={16} /> */}
          <span>ออกจากระบบ</span>
        </Button>
      </LogoutButton>
    </div>
  );
}

export default function TopBar({
  title,
  hasBack,
}: {
  title?: string;
  hasBack?: boolean;
}) {
  return (
    <motion.div
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-10 grid items-center w-full grid-cols-3 p-2 mb-4 bg-gradient-to-b from-background via-60% via-background to-background/0"
    >
      <div className="flex">
        {hasBack && (
          <button
            onClick={() => {
              window.history.back();
            }}
            className="p-2 rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>
      <h1 className="text-lg font-semibold text-center">
        {title || "หน้าหลัก"}
      </h1>
      <div className="flex justify-end">
        <DrawerDialog
          title="บัญชีผู้ใช้"
          dialogTriggerButton={
            <button className="flex items-center justify-center p-2 transition-colors rounded-full hover:bg-gray-100">
              <User
                size={32}
                className="text-gray-600 bg-gray-200 rounded-full p-1.5"
              />
            </button>
          }
        >
          <AccountMenu />
        </DrawerDialog>
      </div>
    </motion.div>
  );
}
