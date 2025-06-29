import LogoutButton from "@/components/LogoutButton";
import React from "react";

export default function AccountPage() {
  return (
    <div className="mb-4">
      <LogoutButton>
        <span className="text-red-500 bg-white px-4 py-2 rounded-lg">Logout</span>
      </LogoutButton>
    </div>
  );
}
