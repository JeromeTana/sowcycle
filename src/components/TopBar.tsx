"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, LogOut, Settings, User } from "lucide-react";
import { getCurrentUser } from "@/services/auth";
import DrawerDialog from "@/components/DrawerDialog";
import LogoutButton from "@/components/LogoutButton";
import { Button } from "./ui/button";

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
      <div className="bg-muted rounded-2xl p-4">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 rounded-full bg-neutral-300" />
          <p className="text-muted-foreground">{emailDisplay}</p>
        </div>
      </div>
      <a href="/boars" onClick={closeDialog}>
        <Button
          variant={"secondary"}
          size={"lg"}
          className="w-full justify-start px-4"
        >
          <span>สายพันธุ์</span>
        </Button>
      </a>
      <a href="/setting" onClick={closeDialog}>
        <Button
          variant={"secondary"}
          size={"lg"}
          className="w-full justify-start px-4"
        >
          {/* <Settings size={16} /> */}
          <span>ตั้งค่า</span>
        </Button>
      </a>
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
