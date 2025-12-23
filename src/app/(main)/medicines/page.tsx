"use client";

import MedicineForm from "@/components/Medicine/Form";
import MedicineList from "@/components/Medicine/List";
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
import { getAllMedicines } from "@/services/medicine";
import { useMedicineStore } from "@/stores/useMedicineStore";
import { ChevronDown, Filter, ListFilter, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function MedicinesPage() {
  const { medicines, setMedicines } = useMedicineStore();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const filteredMedicines = useMemo(() => {
    return medicines
      .filter((medicine) => medicine.title.includes(search))
  }, [medicines, search]);

  useEffect(() => {
    const fetchData = async () => {
      const medicines = await getAllMedicines();
      if (!medicines) return;
      setMedicines(medicines);
      setIsLoading(false);
    };
    medicines.length === 0 ? fetchData() : setIsLoading(false);
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

          {/* MedicineList Skeleton */}
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
      <TopBar title="ยาวัคซีน" />
      <DialogComponent
        title="เพิ่มยาวัคซีนใหม่"
        dialogTriggerButton={
          <div className="fixed z-10 flex items-center gap-2 p-4 text-white rounded-full shadow cursor-pointer bg-primary bottom-24 right-4">
            <Plus size={22} />
          </div>
        }
      >
        <MedicineForm />
      </DialogComponent>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startIcon={Search}
            placeholder="ค้นหาด้วยชื่อยาวัคซีน"
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
                    : "bg-primary hover:bg-pink-600 !text-white",
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
        <MedicineList medicines={filteredMedicines} />
      </div>
    </>
  );
}
