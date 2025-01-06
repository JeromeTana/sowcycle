"use client";

import { useLoading } from "@/stores/useLoading";
import { LoaderIcon } from "lucide-react";
import React from "react";

export default function Loader() {
  const { isLoading } = useLoading();

  return (
    <div>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full text-white bg-[#00000080] z-[9999]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <LoaderIcon className="animate-spin" size={40} />
          </div>
        </div>
      )}
    </div>
  );
}
