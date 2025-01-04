"use client";

import SowList from "@/components/Sow/List";
import SowForm from "@/components/Sow/Form";
import { useEffect } from "react";
import { useSowStore } from "@/stores/useSowStore";
import { getAllSows } from "@/services/sow";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { sows, setSows } = useSowStore();

  useEffect(() => {
    const fetchData = async () => {
      const sows = await getAllSows();
      if (!sows) return;
      setSows(sows);
    };
    fetchData();
    return () => {};
  }, []);

  if (sows.length === 0) return <div>Loading...</div>;

  return (
    <div suppressHydrationWarning>
      <Dialog>
        <DialogTrigger asChild>
          <Button>เพิ่มแม่หมู</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <SowForm />
        </DialogContent>
      </Dialog>
      <SowList sows={sows} />
    </div>
  );
}
