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
import { useLitterData } from "@/hooks/useLitterData";
import { useLitterFilters } from "@/hooks/useLitterFilters";
import { Litter } from "@/types/litter";
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader />
        <LitterStats litters={littersWithBreeds} />
        <FilterControls
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
        />
        <LittersList litters={filteredLitters} />
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-gray-900">ลูกหมู</h1>
      <p className="text-muted-foreground">
        ข้อมูลลูกหมูที่เกิดแล้วจากการผสมพันธุ์
      </p>
    </div>
  );
}

function LitterStats({ litters }: { litters: any[] }) {
  const totalPiglets = calculateTotalPiglets(litters);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <StatCard
        icon={<Fence className="text-blue-500" size={24} />}
        label="เกิดแล้ว"
        value={litters.length}
        unit="ครอก"
      />
      <StatCard
        icon={<PiggyBank className="text-pink-500" size={24} />}
        label="กำลังเลี้ยง"
        value={totalPiglets}
        unit="ตัว"
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {icon}
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">
              {value} <span className="text-sm">{unit}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
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
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
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
    <div className="space-y-4">
      {litters.map((litter, index) => (
        <LitterCard
          key={litter.id}
          litter={litter}
          index={litters.length - index}
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <Baby className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
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
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
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
