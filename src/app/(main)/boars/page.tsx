"use client";

import BoarsContent from "@/components/Boar/BoarsContent";
import TopBar from "@/components/TopBar";

export default function BoarsPage() {
  return (
    <>
      <TopBar title="สายพันธุ์" />
      <main className="p-4 pt-0 md:pb-8 md:p-8">
        <BoarsContent />
      </main>
    </>
  );
}
