"use client";

import BoarForm from "@/components/Boar/Form";
import { Button } from "@/components/ui/button";
import { getBoarById } from "@/services/boar";
import { useEffect, useState } from "react";

import DialogComponent from "@/components/DialogComponent";
import { Dna, Pen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useBoarStore } from "@/stores/useBoarStore";
import { redirect } from "next/navigation";

export default function BoarsPage({ params }: any) {
  const [id, setId] = useState<number | null>();
  const { boar, setBoar } = useBoarStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getParamsId = async () => {
      const { id } = await params;
      setId(id);
    };
    getParamsId();
    return () => {};
  }, [params]);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        let boar = await getBoarById(id);

        if (boar) {
          setBoar(boar);
          setIsLoading(false);
        }
      } catch (error) {
        if (error) redirect("/404");
      }
    };
    fetchData();
  }, [id]);

  if (isLoading)
    return (
      <div>
        <div className="flex justify-between">
          <Skeleton className=" w-40 h-8" />
          <Skeleton className=" w-32 h-8" />
        </div>
        <Skeleton className="w-full h-32 mt-4 rounded-xl" />
        <div className="flex justify-between mt-8">
          <Skeleton className=" w-40 h-8" />
          <Skeleton className=" w-32 h-8" />
        </div>
        <Skeleton className="w-full h-80 mt-4 rounded-xl" />
        <Skeleton className="w-full h-80 mt-2 rounded-xl" />
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="flex justify-between mb-4">
        <div className="relative">
          <h1 className="text-2xl font-bold inline-flex items-center gap-3">
            <Dna size={32} className="inline" />
            {boar.breed}
          </h1>
        </div>
        <div className="flex">
          <DialogComponent
            title="แก้ไขสายพันธุ์"
            dialogTriggerButton={
              <Button variant={"ghost"}>
                <Pen /> แก้ไขสายพันธุ์
              </Button>
            }
          >
            <BoarForm editingBoar={boar} />
          </DialogComponent>
        </div>
      </div>
    </div>
  );
}
