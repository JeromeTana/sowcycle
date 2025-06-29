"use client";

import DialogComponent from "@/components/DialogComponent";
import SowForm from "@/components/Sow/Form";
import SowList from "@/components/Sow/List";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getAllSowsWithLatestBreeding } from "@/services/sow";
import { useSowStore } from "@/stores/useSowStore";
import { ChevronDown, Filter, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const filterSowOptions = [
  {
    label: "ทั้งหมด",
    value: {},
  },
  {
    label: "ตั้งครรภ์",
    value: { is_available: false },
  },
  {
    label: "พร้อมผสม",
    value: { is_available: true },
  },
  {
    label: "ยังอยู่",
    value: { is_active: true },
  },
  {
    label: "ไม่อยู่",
    value: { is_active: false },
  },
];

export default function SowPage() {
  const { sows, setSows } = useSowStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(filterSowOptions[0]);
  const [isLoading, setIsLoading] = useState(true);

  const filteredSows = useMemo(() => {
    return sows
      .filter((sow) => sow.name.includes(search))
      .filter((sow) => {
        return Object.entries(filter.value).every(([key, value]) => {
          return sow[key] === value;
        });
      })
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
  }, [sows, search, filter]);

  useEffect(() => {
    const fetchData = async () => {
      const sows = await getAllSowsWithLatestBreeding();
      if (!sows) return;
      setSows(sows);
      setIsLoading(false);
    };
    sows.length === 0 ? fetchData() : null;
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4 mt-8">
        <div className="flex justify-between">
          <Skeleton className="w-48 h-8" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="w-2/3 h-10" />
          <Skeleton className="w-1/3 h-10" />
        </div>
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-8">
      <div className="flex justify-between">
        <h2 className="text-xl">แม่พันธุ์ทั้งหมด ({sows.length})</h2>
        <DialogComponent
          title="เพิ่มแม่พันธุ์ใหม่"
          dialogTriggerButton={
            <div className="flex items-center gap-2 rounded-full bg-primary text-white p-4 cursor-pointer fixed bottom-24 right-4 shadow">
              <Plus size={22} /> เพิ่มแม่พันธุ์
            </div>
          }
        >
          <SowForm />
        </DialogComponent>
      </div>
      <div className="flex gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startIcon={Search}
          placeholder="ค้นหาชื่อแม่พันธุ์"
          className="bg-white"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                JSON.stringify(filter.value) ===
                  JSON.stringify(filterSowOptions[0].value)
                  ? ""
                  : "bg-pink-500 hover:bg-pink-600 !text-white"
              )}
            >
              <Filter /> {filter.label} <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {filterSowOptions.map((option, key) => (
              <DropdownMenuItem
                key={key}
                onSelect={() => {
                  setFilter(option);
                }}
                className={cn(
                  JSON.stringify(option.value) === JSON.stringify(filter.value)
                    ? "bg-black text-white hover:!bg-black hover:!text-white"
                    : "bg-white text-black"
                )}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <SowList sows={filteredSows} />
    </div>
  );
}
