"use client";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Baby,
  PiggyBank,
  Fence,
  Filter,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import LitterCard from "@/components/Litter/Card";
import { FadeIn } from "@/components/animations/FadeIn";
import { useLitterData } from "@/hooks/useLitterData";
import { useLitterFilters } from "@/hooks/useLitterFilters";
import { Litter } from "@/types/litter";
import { cn } from "@/lib/utils";
import TopBar from "@/components/TopBar";
import { StatsCard } from "@/components/StatsCard";

// Types
interface FilterOption {
  label: string;
  value: Record<string, any>;
}

// Constants
const FILTER_OPTIONS: FilterOption[] = [
  { label: "ทั้งหมด", value: {} },
  { label: "ยังไม่ขุน", value: { fattening_at: "null" } },
  { label: "กำลังขุน", value: { fattening_at: "not_null", sold_at: "null" } },
  { label: "ขายแล้ว", value: { sold_at: "not_null" } },
];

export default function LittersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterOption>(FILTER_OPTIONS[0]);
  const { littersWithBreeds, isLoading, error } = useLitterData();

  // Apply filters to litters
  const filteredLitters = useLitterFilters(littersWithBreeds, search).filter(
    (litter) => {
      return Object.entries(filter.value).every(([key, value]) => {
        if (value === "null") {
          return litter[key] === null;
        } else if (value === "not_null") {
          return litter[key] !== null;
        }
        return litter[key] === value;
      });
    },
  );

  if (error) {
    return <ErrorState />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <>
      <TopBar title="ครอกลูกหมู" />
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto space-y-4">
          {/*<PageHeader />*/}
          {/* <LitterStats litters={littersWithBreeds} /> */}
          <FilterControls
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
          />
          <LittersList litters={filteredLitters} />
        </div>
      </div>
    </>
  );
}

function LitterStats({ litters }: { litters: any[] }) {
  const totalPiglets = calculateTotalPiglets(litters);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      <StatsCard
        icon={Fence}
        title="เกิดแล้วทั้งหมด"
        value={litters.length}
        iconColor="text-blue-500"
        unit="ครอก"
      />
      <StatsCard
        icon={PiggyBank}
        title="กำลังขุน"
        value={totalPiglets}
        iconColor="text-pink-500"
        unit="ตัว"
      />
    </div>
  );
}

function FilterControls({
  search,
  setSearch,
  filter,
  setFilter,
}: {
  search: string;
  setSearch: (value: string) => void;
  filter: FilterOption;
  setFilter: (value: FilterOption) => void;
}) {
  const isFilterActive =
    JSON.stringify(filter.value) !== JSON.stringify(FILTER_OPTIONS[0].value);

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Input
          placeholder="ค้นหาด้วยชื่อแม่พันธุ์ หรือ สายพันธุ์"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 rounded-full"
        />
        <Search
          className="absolute transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground"
          size={20}
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "flex items-center gap-2 rounded-full",
              isFilterActive && "bg-pink-500 hover:bg-pink-600 !text-white",
            )}
          >
            <Filter size={16} />
            {filter.label}
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {FILTER_OPTIONS.map((option, index) => {
            const isSelected =
              JSON.stringify(option.value) === JSON.stringify(filter.value);
            return (
              <DropdownMenuItem
                key={index}
                onSelect={() => setFilter(option)}
                className={cn(
                  isSelected
                    ? "bg-black text-white hover:!bg-black hover:!text-white"
                    : "bg-white text-black",
                )}
              >
                {option.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function LittersList({ litters }: { litters: any[] }) {
  if (litters.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-2">
      {litters.map((litter, index) => (
        <FadeIn key={litter.id} delay={index * 0.1}>
          <LitterCard litter={litter} index={litters.length - index} />
        </FadeIn>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <Baby className="mx-auto mb-4 text-gray-400" size={48} />
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          ยังไม่มีข้อมูลลูกหมู
        </h3>
        <p className="text-muted-foreground">
          ยังไม่มีการผสมพันธุ์ที่คลอดลูกแล้ว
        </p>
      </CardContent>
    </Card>
  );
}

function LoadingState() {
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

      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* LitterStats Skeleton */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <Skeleton className="h-[140px] rounded-xl" />
            <Skeleton className="h-[140px] rounded-xl" />
          </div>

          {/* FilterControls Skeleton */}
          <div className="flex gap-2">
            <Skeleton className="w-full h-10 rounded-full" />
            <Skeleton className="w-32 h-10 rounded-full" />
          </div>

          {/* LittersList Skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ErrorState() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-red-500">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Utility functions
function calculateTotalPiglets(litters: Litter[]): number {
  return litters
    .filter((litter) => !litter.sold_at)
    .reduce((total, litter) => total + (litter.piglets_born_count || 0), 0);
}
