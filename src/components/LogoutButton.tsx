"use client";

import React from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useLoading } from "@/stores/useLoading";
import { signOut } from "@/services/auth";
import { redirect } from "next/navigation";

export default function LogoutButton() {
  const { setIsLoading: setIsLoadingDialog } = useLoading();
  const handleLogout = async () => {
    setIsLoadingDialog(true);
    try {
      signOut().then((res) => {
        if (res) {
          setIsLoadingDialog(false);
          redirect("/login");
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Button variant={"ghost"} onClick={handleLogout}>
      <LogOut />
      Logout
    </Button>
  );
}
