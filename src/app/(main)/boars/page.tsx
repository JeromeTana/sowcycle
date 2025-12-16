"use client";

import BoarForm from "@/components/Boar/Form";
import BoarList from "@/components/Boar/List";
import DialogComponent from "@/components/DrawerDialog";
import TopBar from "@/components/TopBar";
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
import { getAllBoars } from "@/services/boar";
import { useBoarStore } from "@/stores/useBoarStore";
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

export default function BoarsPage() {
  const { boars, setBoars } = useBoarStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(filterSowOptions[0]);
  const [isLoading, setIsLoading] = useState(true);

  const filteredBoars = useMemo(() => {
    return boars
      .filter((boar) => boar.breed.includes(search))
      .filter((boar) => {
        return Object.entries(filter.value).every(([key, value]) => {
          return boar[key] === value;
        });
      });
  }, [boars, search, filter]);

  useEffect(() => {
    const fetchData = async () => {
      const boars = await getAllBoars();
      if (!boars) return;
      setBoars(boars);
      setIsLoading(false);
    };
    boars.length === 0 ? fetchData() : setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <>
        {/* TopBar Skeleton */}
        <div className="grid grid-cols-3 w-full items-center mb-4">
          <div className="flex"></div>
          <div className="flex justify-center">
            <Skeleton className="h-7 w-24" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>

        <div className="space-y-4 mb-20">
          {/* Search and Filter Skeleton */}
          <div className="flex gap-2">
            <Skeleton className="h-10 w-full rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>

          {/* BoarList Skeleton */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        </div>

        {/* FAB Skeleton */}
        <Skeleton className="h-14 w-14 rounded-full fixed bottom-24 right-4" />
      </>
    );
  }

  return (
    <>
      <TopBar title="สายพันธุ์" />
      <DialogComponent
        title="เพิ่มสายพันธุ์ใหม่"
        dialogTriggerButton={
          <div className="flex items-center gap-2 rounded-full bg-primary text-white p-4 cursor-pointer fixed z-10 bottom-24 right-4 shadow">
            <Plus size={22} />
          </div>
        }
      >
        <BoarForm />
      </DialogComponent>
      <div className="space-y-4 mb-20">
        <div className="flex gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startIcon={Search}
            placeholder="ค้นหาด้วยชื่อสายพันธุ์"
            className="bg-white rounded-full"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  JSON.stringify(filter.value) ===
                    JSON.stringify(filterSowOptions[0].value)
                    ? ""
                    : "bg-pink-500 hover:bg-pink-600 !text-white",
                  "rounded-full",
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
                    JSON.stringify(option.value) ===
                      JSON.stringify(filter.value)
                      ? "bg-black text-white hover:!bg-black hover:!text-white"
                      : "bg-white text-black",
                  )}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <BoarList boars={filteredBoars} />
      </div>
    </>
  );
}
