"use client";

import SowList from "@/components/Sow/List";
import SowForm from "@/components/Sow/Form";
import { useEffect, useState } from "react";
import { useSowStore } from "@/stores/useSowStore";
import { getAllSows } from "@/services/sow";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DialogComponent from "@/components/DialogComponent";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const { sows, setSows } = useSowStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const sows = await getAllSows();
      if (!sows) return;
      setSows(sows);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading)
    return (
      <div>
        <Skeleton className=" w-40 h-8" />
        <Skeleton className="w-full h-80 mt-4 rounded-xl" />
        <div className="flex justify-between mt-8">
          <Skeleton className=" w-40 h-8" />
          <Skeleton className=" w-32 h-8" />
        </div>
        <Skeleton className="w-full h-40 mt-4 rounded-xl" />
        <Skeleton className="w-full h-40 mt-2 rounded-xl" />
      </div>
    );

  return (
    <div className="space-y-8">
      {sows.some((sow) => !sow.is_available) && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">แม่พันธุ์ตั้งครรภ์</h2>
          <SowList
            sows={sows
              .filter((sow) => !sow.is_available)
              .sort(
                (a, b) =>
                  new Date(a.breedings[0].expected_farrow_date).getTime() -
                  new Date(b.breedings[0].expected_farrow_date).getTime()
              )}
          />
        </div>
      )}
      <div className="space-y-4">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">แม่พันธุ์ทั้งหมด</h2>
          <DialogComponent
            title="เพิ่มแม่พันธุ์ใหม่"
            dialogTriggerButton={
              <Button variant={"outline"}>
                <Plus /> เพิ่มแม่พันธุ์
              </Button>
            }
          >
            <SowForm />
          </DialogComponent>
        </div>
        <SowList sows={sows} />
      </div>
    </div>
  );
}
