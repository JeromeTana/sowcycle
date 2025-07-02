"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useSowDetailData } from "@/hooks/useSowDetailData";
import { useSowDetailCalculations } from "@/hooks/useSowDetailCalculations";

import SowHeader from "@/components/Sow/SowHeader";
import SowDetailsCard from "@/components/Sow/SowDetailsCard";
import SowHistorySection from "@/components/Sow/SowHistorySection";
import { LoadingPageSkeleton } from "@/components/Sow/LoadingSkeleton";

interface SowPageProps {
  params: Promise<{ id: string }>;
}

export default function SowPage({ params }: SowPageProps) {
  const [id, setId] = useState<number | null>(null);

  const {
    sow,
    breedings,
    litters,
    medicalRecords,
    sowBreeds,
    isLoading,
    error,
  } = useSowDetailData(id);

  const { averagePigletsBornCount, averageWeightChart } =
    useSowDetailCalculations(breedings, litters);

  useEffect(() => {
    const getParamsId = async () => {
      const { id } = await params;
      setId(parseInt(id));
    };
    getParamsId();
  }, [params]);

  useEffect(() => {
    if (error) {
      redirect("/404");
    }
  }, [error]);

  if (isLoading) {
    return <LoadingPageSkeleton />;
  }

  if (!sow) {
    return null;
  }

  return (
    <div className="space-y-8">
      <SowHeader sow={sow} />

      <SowDetailsCard
        sow={sow}
        sowBreeds={sowBreeds}
        breedings={breedings}
        litters={litters}
        averagePigletsBornCount={averagePigletsBornCount}
        averageWeightChart={averageWeightChart}
      />

      <SowHistorySection
        sow={sow}
        breedings={breedings}
        medicalRecords={medicalRecords}
      />
    </div>
  );
}
