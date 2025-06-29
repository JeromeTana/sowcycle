"use client";

import React from "react";
import { useLoading } from "@/stores/useLoading";
import { signOut } from "@/services/auth";
import { redirect } from "next/navigation";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export default function LogoutButton({ children }: LogoutButtonProps) {
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
    <button onClick={handleLogout}>
      {children}
    </button>
  );
}
