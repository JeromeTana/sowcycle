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
  ChevronDown,
  Filter,
  Heart,
  PiggyBank,
  Plus,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// Types
interface FilterOption {
  label: string;
  value: Record<string, any>;
}

interface SowStats {
  total: number;
  pregnant: number;
  availableForBreeding: number;
  active: number;
  inactive: number;
}

// Constants
const FILTER_OPTIONS: FilterOption[] = [
  { label: "ทั้งหมด", value: {} },
  { label: "ตั้งครรภ์", value: { is_available: false } },
  { label: "พร้อมผสม", value: { is_available: true } },
  { label: "ยังอยู่", value: { is_active: true } },
  { label: "ไม่อยู่", value: { is_active: false } },
];

// Hooks
const useSowData = () => {
  const { sows, setSows } = useSowStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sowsData = await getAllSowsWithLatestBreeding();
        if (sowsData) {
          setSows(sowsData);
        }
      } catch (error) {
        console.error("Failed to fetch sows:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (sows.length === 0) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [sows.length, setSows]);

  return { sows, isLoading };
};

const useSowFilters = (sows: any[]) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterOption>(FILTER_OPTIONS[0]);

  const filteredSows = useMemo(() => {
    return sows
      .filter((sow) => sow.name.toLowerCase().includes(search.toLowerCase()))
      .filter((sow) => {
        return Object.entries(filter.value).every(
          ([key, value]) => sow[key] === value
        );
      })
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
  }, [sows, search, filter]);

  return {
    search,
    setSearch,
    filter,
    setFilter,
    filteredSows,
  };
};

const useSowStats = (sows: any[]): SowStats => {
  return useMemo(
    () => ({
      total: sows.length,
      pregnant: sows.filter((sow) => !sow.is_available).length,
      availableForBreeding: sows.filter((sow) => sow.is_available).length,
      active: sows.filter((sow) => sow.is_active).length,
      inactive: sows.filter((sow) => !sow.is_active).length,
    }),
    [sows]
  );
};

// Components
const StatsCard = ({
  icon: Icon,
  title,
  value,
  iconColor,
}: {
  icon: any;
  title: string;
  value: number;
  iconColor: string;
}) => (
  <div className="flex items-center gap-4 bg-white rounded-lg p-4">
    <Icon size={24} className={iconColor} />
    <div>
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-2xl font-bold">
        {value} <span className="text-sm">ตัว</span>
      </div>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-between">
      <Skeleton className="w-48 h-8" />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="w-2/3 h-10" />
      <Skeleton className="w-1/3 h-10" />
    </div>
    {[...Array(3)].map((_, i) => (
      <Skeleton key={i} className="h-48 w-full" />
    ))}
  </div>
);

const AddSowButton = () => (
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
);

const StatsSection = ({ stats }: { stats: SowStats }) => (
  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
    <StatsCard
      icon={PiggyBank}
      title="จำนวนทั้งหมด"
      value={stats.total}
      iconColor="text-blue-500"
    />
    <StatsCard
      icon={Heart}
      title="กำลังตั้งครรภ์"
      value={stats.pregnant}
      iconColor="text-pink-500"
    />
  </div>
);

const FilterControls = ({
  search,
  setSearch,
  filter,
  setFilter,
}: {
  search: string;
  setSearch: (value: string) => void;
  filter: FilterOption;
  setFilter: (value: FilterOption) => void;
}) => {
  const isFilterActive =
    JSON.stringify(filter.value) !== JSON.stringify(FILTER_OPTIONS[0].value);

  return (
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
            variant="outline"
            className={cn(
              isFilterActive && "bg-pink-500 hover:bg-pink-600 !text-white"
            )}
          >
            <Filter /> {filter.label} <ChevronDown />
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
                    : "bg-white text-black"
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
};

// Main Component
export default function SowPage() {
  const { sows, isLoading } = useSowData();
  const { search, setSearch, filter, setFilter, filteredSows } =
    useSowFilters(sows);
  const stats = useSowStats(sows);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6 mb-20">
      <div className="flex justify-between">
        <h2 className="text-2xl">แม่พันธุ์</h2>
        <AddSowButton />
      </div>

      <StatsSection stats={stats} />

      <FilterControls
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
      />

      <SowList sows={filteredSows} />
    </div>
  );
}
