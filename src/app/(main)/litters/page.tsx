"use client";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { getAllLitters } from "@/services/litter";
import { getAllSows } from "@/services/sow";
import { Litter } from "@/types/litter";
import { Sow } from "@/types/sow";
import { Search, Baby, PiggyBank, Fence } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLitterStore } from "@/stores/useLitterStore";
import LitterCard from "@/components/Litter/Card";
import { useBoarStore } from "@/stores/useBoarStore";
import { getAllBoars } from "@/services/boar";

export default function LittersPage() {
  const { litters, setLitters } = useLitterStore();
  const [sows, setSows] = useState<Sow[]>([]);
  const { boars: breeds, setBoars: setBreeds } = useBoarStore();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Derive litters with litters from store
  const littersWithSow = useMemo(() => {
    // Combine litter data with sow and sow's breed information
    return litters.map((litter) => {
      const sow = sows.find((sow) => sow.id === litter.sow_id);
      return { ...litter, sow };
    });
  }, [litters, sows]);

  const litterWithSowWithBreeds = useMemo(() => {
    // Combine litter data with sow and it's breed names
    return littersWithSow.map((litter) => {
      const sowBreedNames = litter.sow?.breed_ids
        ? litter.sow.breed_ids.map((breedId) => {
            const breed = breeds.find((b) => b.id === breedId);
            return breed ? breed.breed : "";
          })
        : [];
      return { ...litter, sow: { ...litter.sow, breeds: sowBreedNames } };
    });
  }, [littersWithSow, breeds]);

  const filteredLitters = useMemo(() => {
    let filtered = litterWithSowWithBreeds;

    if (search) {
      filtered = litterWithSowWithBreeds.filter((litter) => {
        const sowName = litter.sow?.name?.toLowerCase() || "";
        const boarBreed = litter.boars?.breed?.toLowerCase() || "";
        const searchLower = search.toLowerCase();

        return sowName.includes(searchLower) || boarBreed.includes(searchLower);
      });
    }

    // Sort by birth_date (oldest first)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.birth_date!).getTime();
      const dateB = new Date(b.birth_date!).getTime();
      return dateB - dateA;
    });
  }, [littersWithSow, search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [littersData, sowsData] = await Promise.all([
          getAllLitters(),
          getAllSows(),
        ]);

        if (!breeds.length) {
          const data = await getAllBoars();
          setBreeds(data);
        }

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
                    {litters.length} <span className="text-sm">ครอก</span>
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
                    {litters
                      .filter((litter) => !litter.sold_at)
                      .reduce(
                        (total, litter) =>
                          total + (litter.piglets_born_count || 0),
                        0
                      )}
                    <span className="text-sm"> ตัว</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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
              <LitterCard
                key={litter.id}
                litter={litter as any}
                index={filteredLitters.length - index}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
