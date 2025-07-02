"use client";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Baby, PiggyBank, Fence } from "lucide-react";
import { useState } from "react";
import LitterCard from "@/components/Litter/Card";
import { useLitterData } from "@/hooks/useLitterData";
import { useLitterFilters } from "@/hooks/useLitterFilters";
import { Litter } from "@/types/litter";

export default function LittersPage() {
  const [search, setSearch] = useState("");
  const { littersWithBreeds, isLoading, error } = useLitterData();
  const filteredLitters = useLitterFilters(littersWithBreeds, search);

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
        <SearchInput search={search} onSearchChange={setSearch} />
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
        label="รวมทั้งหมด"
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

function SearchInput({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <Input
        placeholder="ค้นหาด้วยชื่อแม่พันธุ์ หรือ สายพันธุ์ของพ่อพันธุ์..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
        size={20}
      />
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
