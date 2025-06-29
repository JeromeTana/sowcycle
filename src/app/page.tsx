"use client";

import SowList from "@/components/Sow/List";
import SowForm from "@/components/Sow/Form";
import { useEffect, useMemo, useState } from "react";
import { useSowStore } from "@/stores/useSowStore";
import { getAllSowsWithLatestBreeding } from "@/services/sow";

import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  LogOut,
  Plus,
  Search,
} from "lucide-react";
import DialogComponent from "@/components/DialogComponent";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { signOut } from "@/services/auth";
import { redirect } from "next/navigation";
import { useLoading } from "@/stores/useLoading";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import TabsComponent from "@/components/TabsComponent";
import BoarForm from "@/components/Boar/Form";
import { useBoarStore } from "@/stores/useBoarStore";
import BoarList from "@/components/Boar/List";
import { getAllBoars } from "@/services/boar";

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

const sortOptions = [
  {
    label: "ชื่อ",
    value: "name",
  },
  {
    label: "วันที่ผสม",
    value: "breedings[0].breed_date",
  },
  {
    label: "วันที่คลอด",
    value: "breedings[0].actual_farrow_date",
  },
  {
    label: "จำนวนวันใกล้คลอด",
    value: "",
  },
];

const tabOptions = [
  {
    label: "แม่พันธุ์",
    value: "sow",
    content: <SowLayout />,
    default: true,
  },
  {
    label: "พ่อพันธุ์",
    value: "boar",
    content: <BoarLayout />,
  },
];

export default function Page() {
  const { sows, setSows } = useSowStore();
  const { setBoars } = useBoarStore();
  const { setIsLoading: setIsLoadingDialog } = useLoading();
  const [isLoading, setIsLoading] = useState(true);

  const [isExpanded, setIsExpanded] = useState(false);

  const breededSows = sows
    .filter((sow) => !sow.is_available)
    .sort((a, b) => {
      return (
        new Date(a.breedings[0].breed_date).getTime() -
        new Date(b.breedings[0].breed_date).getTime()
      );
    });

  const handleLogout = async () => {
    setIsLoadingDialog(true);
    try {
      signOut().then((res) => {
        if (res) {
          setIsLoadingDialog(false);
          redirect("/login");
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const sows = await getAllSowsWithLatestBreeding();
      if (!sows) return;
      setSows(sows);

      const boars = await getAllBoars();
      if (!boars) return;
      setBoars(boars);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading)
    return (
      <div>
        <Skeleton className="w-full h-[40rem] rounded-2xl" />
        <div className="flex justify-between mt-16">
          <Skeleton className=" w-40 h-8" />
          <Skeleton className=" w-32 h-8" />
        </div>
        <Skeleton className="w-full h-40 mt-4 rounded-xl" />
        <Skeleton className="w-full h-40 mt-2 rounded-xl" />
      </div>
    );

  return (
    <div className="space-y-16">
      <Button variant={"ghost"} onClick={handleLogout}>
        <LogOut />
        Logout
      </Button>
      {breededSows.length > 0 && (
        <div className="space-y-4 ">
          <h2 className="text-xl">แม่พันธุ์ใกล้คลอด ({breededSows.length})</h2>
          <SowList sows={isExpanded ? breededSows : breededSows.slice(0, 3)} />
          {breededSows.length > 3 && (
            <Button
              variant={"outline"}
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 w-full border-none rounded-xl bg-transparent hover:bg-transparent shadow-none"
            >
              {isExpanded ? <ChevronUp /> : <ChevronDown />}
              {isExpanded ? "ย่อ" : "ดูทั้งหมด"}
            </Button>
          )}
        </div>
      )}
      <TabsComponent tabOptions={tabOptions} />
    </div>
  );
}

function SowLayout() {
  const { sows } = useSowStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(filterSowOptions[0]);

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
  return (
    <div className="space-y-4 mt-8">
      <div className="flex justify-between">
        <h2 className="text-xl">แม่พันธุ์ทั้งหมด ({sows.length})</h2>
        <DialogComponent
          title="เพิ่มแม่พันธุ์ใหม่"
          dialogTriggerButton={
            <Button>
              <Plus /> เพิ่มแม่พันธุ์
            </Button>
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

function BoarLayout() {
  const { boars } = useBoarStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(filterSowOptions[0]);

  const filteredBoars = useMemo(() => {
    return boars
      .filter((boar) => boar.breed.includes(search))
      .filter((boar) => {
        return Object.entries(filter.value).every(([key, value]) => {
          return boar[key] === value;
        });
      });
  }, [boars, search, filter]);
  return (
    <div className="space-y-4 mt-8">
      <div className="flex justify-between">
        <h2 className="text-xl">พ่อพันธุ์ทั้งหมด ({boars.length})</h2>
        <DialogComponent
          title="เพิ่มพ่อพันธุ์ใหม่"
          dialogTriggerButton={
            <Button>
              <Plus /> เพิ่มพ่อพันธุ์
            </Button>
          }
        >
          <BoarForm />
        </DialogComponent>
      </div>
      <div className="flex gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startIcon={Search}
          placeholder="ค้นหาชื่อพ่อพันธุ์"
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
      <BoarList boars={filteredBoars} />
    </div>
  );
}
