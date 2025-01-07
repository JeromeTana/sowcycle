"use client";

import SowList from "@/components/Sow/List";
import SowForm from "@/components/Sow/Form";
import { useEffect, useMemo, useState } from "react";
import { useSowStore } from "@/stores/useSowStore";
import { getAllSowsWithLatestBreeding } from "@/services/sow";

import { Button } from "@/components/ui/button";
import {
  Check,
  Heart,
  LayoutDashboard,
  LogOut,
  PiggyBank,
  Plus,
  Search,
  X,
} from "lucide-react";
import DialogComponent from "@/components/DialogComponent";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { signOut } from "@/services/auth";
import { redirect } from "next/navigation";
import { useLoading } from "@/stores/useLoading";

export default function Page() {
  const { sows, setSows } = useSowStore();
  const { setIsLoading: setIsLoadingDialog } = useLoading();
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({});
  const filterOptions = [
    {
      label: (
        <>
          <LayoutDashboard />
          ทั้งหมด
        </>
      ),
      value: {},
    },
    {
      label: (
        <>
          <Heart />
          ตั้งครรภ์
        </>
      ),
      value: { is_available: false },
    },
    {
      label: (
        <>
          <PiggyBank />
          พร้อมผสม
        </>
      ),
      value: { is_available: true },
    },
    {
      label: (
        <>
          <Check />
          ยังอยู่
        </>
      ),
      value: { is_active: true },
    },
    {
      label: (
        <>
          <X />
          ไม่อยู่
        </>
      ),
      value: { is_active: false },
    },
  ];

  const breededSows = sows
    .filter(
      (sow) =>
        !sow.is_available &&
        sow.breedings?.some(
          (breeding) =>
            new Date(breeding.expected_farrow_date).getTime() - Date.now() <
            30 * 24 * 60 * 60 * 1000
        )
    )
    .sort((a, b) => {
      return (
        new Date(a.breedings[0].breed_date).getTime() -
        new Date(b.breedings[0].breed_date).getTime()
      );
    });

  const filteredSows = useMemo(() => {
    return sows
      .filter((sow) => sow.name.includes(search))
      .filter((sow) => {
        if (!filter) return true;
        return Object.entries(filter).every(([key, value]) => {
          return sow[key] === value;
        });
      });
  }, [sows, search, filter]);

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
        <div className="space-y-4 p-5  border border-pink-300 bg-pink-100 rounded-2xl">
          <h2 className="text-xl font-bold">แม่พันธุ์ใกล้คลอด</h2>
          <SowList sows={breededSows} />
        </div>
      )}
      <div className="space-y-4">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">แม่พันธุ์ทั้งหมด</h2>
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
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startIcon={Search}
          placeholder="ค้นหาชื่อแม่พันธุ์"
          className="bg-white"
        />
        <div className="flex gap-2 overflow-auto">
          {filterOptions.map((option, index) => (
            <Button
              key={index}
              onClick={() => {
                setFilter(option.value);
              }}
              variant={"outline"}
              className={cn(
                JSON.stringify(option.value) === JSON.stringify(filter)
                  ? "bg-black text-white hover:bg-black hover:text-white"
                  : "bg-white text-black",
                "text-sm rounded-full"
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <SowList sows={filteredSows} />
      </div>
    </div>
  );
}
