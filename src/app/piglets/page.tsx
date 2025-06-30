"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InfoIcon from "@/components/InfoIcon";
import { getAllBreedings } from "@/services/breeding";
import { getAllSows } from "@/services/sow";
import { Breeding } from "@/types/breeding";
import { Sow } from "@/types/sow";
import {
  Search,
  Baby,
  Calendar,
  Users,
  Heart,
  PiggyBank,
  Dna,
  Gauge,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface PigletData extends Breeding {
  sow?: Sow;
}

export default function PigletsPage() {
  const [breedingsWithPiglets, setBreedingsWithPiglets] = useState<
    PigletData[]
  >([]);
  const [sows, setSows] = useState<Sow[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const filteredPiglets = useMemo(() => {
    let filtered = breedingsWithPiglets;

    if (search) {
      filtered = breedingsWithPiglets.filter((breeding) => {
        const sowName = breeding.sow?.name?.toLowerCase() || "";
        const boarName = breeding.boars?.name?.toLowerCase() || "";
        const searchLower = search.toLowerCase();

        return sowName.includes(searchLower) || boarName.includes(searchLower);
      });
    }

    // Sort by actual_farrow_date (oldest first)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.actual_farrow_date!).getTime();
      const dateB = new Date(b.actual_farrow_date!).getTime();
      return dateB - dateA;
    });
  }, [breedingsWithPiglets, search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [breedingsData, sowsData] = await Promise.all([
          getAllBreedings(),
          getAllSows(),
        ]);

        // Filter breedings that have actual_farrow_date (piglets have been born)
        const breedingsWithActualFarrow = breedingsData.filter(
          (breeding) => breeding.actual_farrow_date
        );

        // Combine breeding data with sow information
        const breedingsWithSowData = breedingsWithActualFarrow.map(
          (breeding) => {
            const sow = sowsData.find((sow) => sow.id === breeding.sow_id);
            return { ...breeding, sow };
          }
        );

        setBreedingsWithPiglets(breedingsWithSowData);
        setSows(sowsData);
      } catch (error) {
        console.error("Error fetching piglets data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTotalPiglets = (breeding: Breeding) => {
    return breeding.piglets_born_count || 0;
  };

  const getAlivePiglets = (breeding: Breeding) => {
    return (
      (breeding.piglets_male_born_alive || 0) +
      (breeding.piglets_female_born_alive || 0)
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
          <p className="text-gray-600">
            ข้อมูลลูกหมูที่เกิดแล้วจากการผสมพันธุ์
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Baby className="text-pink-500" size={24} />
                <div>
                  <p className="text-sm text-gray-600">ครอกที่เกิดแล้ว</p>
                  <p className="text-2xl font-bold">{filteredPiglets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="text-blue-500" size={24} />
                <div>
                  <p className="text-sm text-gray-600">ลูกหมูทั้งหมด</p>
                  <p className="text-2xl font-bold">
                    {filteredPiglets.reduce(
                      (total, breeding) => total + getTotalPiglets(breeding),
                      0
                    )}
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
                    {filteredPiglets.reduce(
                      (total, breeding) => total + getAlivePiglets(breeding),
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
            placeholder="ค้นหาด้วยด้วยชื่อแม่พันธุ์ หรือ พ่อพันธุ์..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>

        {/* Piglets List */}
        <div className="space-y-4">
          {filteredPiglets.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Baby className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  ยังไม่มีข้อมูลลูกหมู
                </h3>
                <p className="text-gray-600">
                  ยังไม่มีการผสมพันธุ์ที่คลอดลูกแล้ว
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPiglets.map((breeding, index) => (
              <Card key={breeding.id} className="transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div className="space-y-2">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-semibold">
                          ครอกที่ {filteredPiglets.length - index}
                        </h3>
                      </div>
                      <div className="flex flex-col gap-4 text-sm text-gray-600">
                        <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-gray-100">
                          <InfoIcon
                            icon={<PiggyBank size={22} />}
                            label="แม่พันธุ์"
                            className="text-sm !bg-white"
                          >
                            {breeding.sow?.name || "ไม่ระบุ"}
                          </InfoIcon>
                          <InfoIcon
                            icon={<Dna size={22} />}
                            label="พ่อพันธุ์"
                            className="text-sm !bg-white"
                          >
                            {breeding.boars?.name || "ไม่ระบุ"}
                          </InfoIcon>
                        </div>
                        {breeding.boars?.name && (
                          <Badge variant="outline">
                            พ่อหมู: {breeding.boars.name}
                          </Badge>
                        )}
                        <InfoIcon
                          icon={<Calendar size={22} />}
                          label="คลอดเมื่อ"
                          className="text-sm"
                        >
                          {formatDate(breeding.actual_farrow_date!)}
                        </InfoIcon>
                        {/* <div className="flex items-center space-x-1">
                          <Baby size={16} />
                          <span>อายุ: {Math.floor((new Date().getTime() - new Date(breeding.actual_farrow_date!).getTime()) / (1000 * 60 * 60 * 24))} วัน</span>
                        </div> */}
                      </div>
                    </div>
                    <InfoIcon icon={<Users size={22} />} label="จำนวน">
                      {getTotalPiglets(breeding)}
                    </InfoIcon>
                    <InfoIcon icon={<Gauge size={22} />} label="น้ำหนักเฉลี่ย">
                      0
                    </InfoIcon>
                    {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <InfoIcon
                        icon={<Baby size={22} className="text-blue-500" />}
                        label="เพศผู้"
                      >
                        {breeding.piglets_male_born_alive || 0}
                      </InfoIcon>
                      <InfoIcon
                        icon={<Heart size={22} className="text-pink-500" />}
                        label="เพศเมีย"
                      >
                        {breeding.piglets_female_born_alive || 0}
                      </InfoIcon> */}
                    {/* <InfoIcon
                        icon={<Calendar size={22} />}
                        label="ตาย"
                        className="border-red-200 bg-red-50"
                      >
                        {breeding.piglets_born_dead || 0}
                      </InfoIcon> */}
                    {/* </div> */}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
