"use client";

import SowList from "@/components/Sow/List";
import SowForm from "@/components/Sow/Form";
import { useEffect } from "react";
import { useSowStore } from "@/stores/useSowStore";
import { getAllSows } from "@/services/sow";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";

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
    <div>
      <div className="space-y-4">
        <p>แม่พันธุ์ใกล้คลอด</p>
        <SowList sows={sows.filter((sow) => sow.is_available === false)} />
      </div>
      <div className="mt-10 space-y-4">
        <div className="flex justify-between">
          <p>แม่พันธุ์ทั้งหมด</p>
          <Dialog>
            <DialogTrigger asChild>
              <div>
                <Button>
                  <Plus /> เพิ่มแม่พันธุ์
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>เพิ่มแม่พันธุ์ใหม่</DialogTitle>
              </DialogHeader>
              <SowForm />
            </DialogContent>
          </Dialog>
        </div>
        <SowList sows={sows} />
      </div>
    </div>
  );
}
