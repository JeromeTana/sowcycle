"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import InfoIcon from "@/components/InfoIcon";
import { getAllLitters } from "@/services/litter";
import { getAllSows } from "@/services/sow";
import { Litter } from "@/types/litter";
import { Sow } from "@/types/sow";
import {
  Search,
  Baby,
  PiggyBank,
  Dna,
  Fence,
  Pen,
  Check,
  Cake,
  Beef,
  Banknote,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import DialogComponent from "@/components/DialogComponent";
import { FarrowForm } from "@/components/Litter/Form";
import { useLitterStore } from "@/stores/useLitterStore";

export default function LittersPage() {
  const { litters, setLitters } = useLitterStore();
  const [sows, setSows] = useState<Sow[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Derive litters with litters from store
  const littersWithLitters = useMemo(() => {
    // Filter litters that have actual_farrow_date (litters have been born)
    const littersWithActualFarrow = litters.filter(
      (litter) => litter.actual_farrow_date && !litter.is_aborted
    );

    // Combine litter data with sow information
    return littersWithActualFarrow.map((litter) => {
      const sow = sows.find((sow) => sow.id === litter.sow_id);
      return { ...litter, sow };
    });
  }, [litters, sows]);

  const filteredLitters = useMemo(() => {
    let filtered = littersWithLitters;

    if (search) {
      filtered = littersWithLitters.filter((litter) => {
        const sowName = litter.sow?.name?.toLowerCase() || "";
        const boarBreed = litter.boars?.breed?.toLowerCase() || "";
        const searchLower = search.toLowerCase();

        return sowName.includes(searchLower) || boarBreed.includes(searchLower);
      });
    }

    // Sort by actual_farrow_date (oldest first)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.actual_farrow_date!).getTime();
      const dateB = new Date(b.actual_farrow_date!).getTime();
      return dateB - dateA;
    });
  }, [littersWithLitters, search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [littersData, sowsData] = await Promise.all([
          getAllLitters(),
          getAllSows(),
        ]);

        setLitters(littersData);
        setSows(sowsData);
      } catch (error) {
        console.error("Error fetching litters data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setLitters]);

  const getTotalPiglets = (litter: Litter) => {
    return litter.piglets_born_count || 0;
  };

  const getAlivePiglets = (litter: Litter) => {
    return (
      (litter.piglets_male_born_alive || 0) +
      (litter.piglets_female_born_alive || 0)
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">ลูกหมู</h1>
          <p className="text-muted-foreground">
            ข้อมูลลูกหมูที่เกิดแล้วจากการผสมพันธุ์
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Fence className="text-blue-500" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">เกิดแล้ว</p>
                  <p className="text-2xl font-bold">
                    {filteredLitters.length}{" "}
                    <span className="text-sm">ครอก</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <PiggyBank className="text-pink-500" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">รวมทั้งหมด</p>
                  <p className="text-2xl font-bold">
                    {filteredLitters.reduce(
                      (total, litter) => total + getTotalPiglets(litter),
                      0
                    )}
                    <span className="text-sm"> ตัว</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="text-green-500" size={24} />
                <div>
                  <p className="text-sm text-gray-600">ลูกหมูที่มีชีวิต</p>
                  <p className="text-2xl font-bold">
                    {filteredLitters.reduce(
                      (total, litter) => total + getAliveLitters(litter),
                      0
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Search */}
        <div className="relative">
          <Input
            placeholder="ค้นหาด้วยด้วยชื่อแม่พันธุ์ หรือ สายพันธุ์ของพ่อพันธุ์..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={20}
          />
        </div>

        {/* Litters List */}
        <div className="space-y-4">
          {filteredLitters.length === 0 ? (
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
          ) : (
            filteredLitters.map((litter, index) => (
              <Card key={litter.id} className="transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div className="space-y-6">
                      <div className="flex gap-2">
                        <Fence />
                        <div className="flex flex-col ">
                          <h3 className="text-lg font-semibold">
                            ครอกที่ {filteredLitters.length - index}
                          </h3>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <InfoIcon icon={<PiggyBank size={22} />} label="จำนวน">
                          {getTotalPiglets(litter)} ตัว
                          <span className="ml-2">
                            <span className="bg-blue-500 font-bold text-white rounded-full px-3 py-1 text-xs">
                              ผู้ {litter.piglets_male_born_alive}
                            </span>{" "}
                            <span className="bg-pink-500 font-bold text-white rounded-full px-3 py-1 text-xs">
                              เมีย {litter.piglets_female_born_alive}
                            </span>
                          </span>
                        </InfoIcon>
                        {/* <InfoIcon
                          icon={<Gauge size={22} />}
                          label="น้ำหนักเฉลี่ย"
                        >
                          {litter.avg_weight
                            ? litter.avg_weight.toFixed(2) + " กิโลกรัม"
                            : "ไม่ระบุ"}
                        </InfoIcon> */}
                      </div>
                      <div className="flex flex-col gap-4 text-muted-foreground">
                        <Link
                          href={`/sows/${litter.sow?.id}`}
                          className="rounded-lg p-3 bg-gray-100"
                        >
                          <InfoIcon
                            icon={<PiggyBank size={22} />}
                            label="แม่พันธุ์"
                            className="!bg-white"
                          >
                            {litter.sow?.name || "ไม่ระบุ"}
                          </InfoIcon>
                        </Link>
                        {litter.boars && (
                          <Link
                            href={`/boars/${litter.boars?.id || ""}`}
                            className="rounded-lg p-3 bg-gray-100"
                          >
                            <InfoIcon
                              icon={<Dna size={22} />}
                              label="พ่อพันธุ์"
                              className="!bg-white"
                            >
                              {litter.boars.breed}
                            </InfoIcon>
                          </Link>
                        )}
                        {litter.boars?.name && (
                          <Badge variant="outline">
                            พ่อหมู: {litter.boars.breed}
                          </Badge>
                        )}
                        {/* <div className="flex items-center space-x-1">
                          <Baby size={16} />
                          <span>อายุ: {Math.floor((new Date().getTime() - new Date(litter.actual_farrow_date!).getTime()) / (1000 * 60 * 60 * 24))} วัน</span>
                        </div> */}
                      </div>
                      <div className="flex flex-col gap-6 rounded-lg p-3 bg-gray-100">
                        <div className="relative">
                          <InfoIcon
                            icon={<Cake size={22} />}
                            label="คลอดเมื่อ"
                            className="bg-white"
                          >
                            {formatDate(litter.actual_farrow_date!)}
                            <span className="text-muted-foreground">
                              {` (อายุ 
                              ${Math.floor(
                                (new Date().getTime() -
                                  new Date(
                                    litter.actual_farrow_date!
                                  ).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )} วัน)`}
                            </span>
                          </InfoIcon>
                          <div className="w-[0px] border-l-2 border-gray-300 -z-0 h-7 absolute top-10 left-5 -translate-x-1/2" />
                        </div>
                        <div className="relative">
                          <InfoIcon
                            icon={<Beef size={22} />}
                            label="เข้าคอกขุนเมื่อ"
                            className="bg-white"
                          >
                            {formatDate(litter.actual_farrow_date!)}
                          </InfoIcon>
                          <div className="w-[0px] border-l-2 border-gray-300 -z-0 h-7 absolute top-10 left-5 -translate-x-1/2" />
                        </div>
                        <InfoIcon
                          icon={<Banknote size={22} className="bg-white" />}
                          label="ขายเมื่อ"
                          className="bg-white"
                        >
                          {formatDate(litter.actual_farrow_date!)}
                        </InfoIcon>
                        {/* <InfoIcon
                          icon={<Banknote size={22} className="bg-white" />}
                          label="พร้อมขายในช่วง"
                          className="bg-white"
                        >
                          {formatDate(litter.actual_farrow_date!)}
                        </InfoIcon> */}
                      </div>
                    </div>

                    {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <InfoIcon
                        icon={<Baby size={22} className="text-blue-500" />}
                        label="เพศผู้"
                      >
                        {litter.piglets_male_born_alive || 0}
                      </InfoIcon>
                      <InfoIcon
                        icon={<Heart size={22} className="text-pink-500" />}
                        label="เพศเมีย"
                      >
                        {litter.piglets_female_born_alive || 0}
                      </InfoIcon> */}
                    {/* <InfoIcon
                        icon={<Calendar size={22} />}
                        label="ตาย"
                        className="border-red-200 bg-red-50"
                      >
                        {litter.piglets_born_dead || 0}
                      </InfoIcon> */}
                    {/* </div> */}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full flex justify-end gap-2">
                    <DialogComponent
                      title={`แก้ไขข้อมูลครอกที่ ${
                        filteredLitters.length - index
                      }`}
                      dialogTriggerButton={
                        <Button variant={"ghost"}>
                          <Pen /> แก้ไขข้อมูล
                        </Button>
                      }
                    >
                      <FarrowForm litter={litter} />
                    </DialogComponent>
                    {litter.actual_farrow_date === null && (
                      <DialogComponent
                        title="บันทึกการคลอด"
                        dialogTriggerButton={
                          <Button>
                            <Check /> บันทึกการคลอด
                          </Button>
                        }
                      >
                        <FarrowForm litter={litter} />
                      </DialogComponent>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
