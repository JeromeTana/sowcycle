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
import { ChevronDown, Filter, ListFilter, Plus, Search } from "lucide-react";
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
        <div className="grid items-center w-full grid-cols-3 mb-4">
          <div className="flex"></div>
          <div className="flex justify-center">
            <Skeleton className="w-24 h-7" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        </div>

        <div className="space-y-4">
          {/* Search and Filter Skeleton */}
          <div className="flex gap-2">
            <Skeleton className="w-full h-10 rounded-full" />
            <Skeleton className="w-32 h-10 rounded-full" />
          </div>

          {/* BoarList Skeleton */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="w-full h-32 rounded-xl" />
            ))}
          </div>
        </div>

        {/* FAB Skeleton */}
        <Skeleton className="fixed rounded-full h-14 w-14 bottom-24 right-4" />
      </>
    );
  }

  return (
    <>
      <TopBar title="สายพันธุ์" />
      <DialogComponent
        title="เพิ่มสายพันธุ์ใหม่"
        dialogTriggerButton={
          <div className="fixed z-10 flex items-center gap-2 p-4 text-white rounded-full shadow cursor-pointer bg-primary bottom-24 right-4">
            <Plus size={22} />
          </div>
        }
      >
        <BoarForm />
      </DialogComponent>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startIcon={Search}
            placeholder="ค้นหาด้วยชื่อสายพันธุ์"
            className="bg-white rounded-full"
          />
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={"outline"}
                size="icon"
                className={cn(
                  JSON.stringify(filter.value) ===
                    JSON.stringify(filterSowOptions[0].value)
                    ? ""
                    : "bg-pink-500 hover:bg-pink-600 !text-white",
                  "size-12 rounded-full p-4",
                )}
              >
                <ListFilter />
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
          </DropdownMenu> */}
        </div>
        <BoarList boars={filteredBoars} />
      </div>
    </>
  );
}
