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
import {
  Check,
  ChevronDown,
  Filter,
  Heart,
  PiggyBank,
  Plus,
  Search,
} from "lucide-react";
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

  // Calculate stats
  const stats = useMemo(() => {
    const total = sows.length;
    const pregnant = sows.filter((sow) => sow.is_available === false).length;
    const availableForBreeding = sows.filter(
      (sow) => sow.is_available === true
    ).length;
    const active = sows.filter((sow) => sow.is_active === true).length;
    const inactive = sows.filter((sow) => sow.is_active === false).length;

    return {
      total,
      pregnant,
      availableForBreeding,
      active,
      inactive,
    };
  }, [sows]);

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
    sows.length === 0 ? fetchData() : setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="w-48 h-8" />
        </div>
        {/* Stats Section Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Skeleton className="h-20 col-span-2 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
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
    <div className="space-y-6 mb-20">
      <div className="flex justify-between">
        <h2 className="text-2xl">แม่พันธุ์</h2>
        <DialogComponent
          title="เพิ่มแม่พันธุ์ใหม่"
          dialogTriggerButton={
            <div className="flex items-center gap-2 rounded-full bg-primary text-white p-4 cursor-pointer fixed bottom-24 right-4 shadow">
              <Plus size={22} />
            </div>
          }
        >
          <SowForm />
        </DialogComponent>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="flex items-center gap-4 bg-white col-span-2 rounded-lg p-4">
          <PiggyBank size={24} className="text-blue-500" />
          <div>
            <div className="text-sm text-gray-600">ทั้งหมด</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white rounded-lg p-4">
          <Heart size={24} className="text-pink-500" />
          <div>
            <div className="text-sm text-gray-600">ตั้งครรภ์</div>
            <div className="text-2xl font-bold">{stats.pregnant}</div>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white rounded-lg p-4">
          <Check size={24} className="text-emerald-500" />
          <div>
            <div className="text-sm text-gray-600">พร้อมผสม</div>
            <div className="text-2xl font-bold">
              {stats.availableForBreeding}
            </div>
          </div>
        </div>
        {/* <div className="bg-white rounded-lg p-4">
          <div className="text-sm text-gray-600">ยังอยู่</div>
          <div className="text-2xl font-bold text-emerald-600">
            {stats.active}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4">
          <div className="text-sm text-gray-600">ไม่อยู่</div>
          <div className="text-2xl font-bold text-red-600">
            {stats.inactive}
          </div>
        </div> */}
      </div>

      <div className="flex gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startIcon={Search}
          placeholder="ค้นหาด้วยชื่อแม่พันธุ์"
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
