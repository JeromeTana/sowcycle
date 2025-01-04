"use client";

import BreedingCard from "@/components/Breeding/Card";
import SowForm from "@/components/Sow/Form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createBreeding, getBreedingsBySowId } from "@/services/breeding";
import { deleteSow, getSowById, getAllSows } from "@/services/sow";
import { useSowStore } from "@/stores/useSowStore";
import { Breeding } from "@/types/breeding";
import { Sow } from "@/types/sow";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { PopoverContent } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Cross, Pen, Plus, Trash, X } from "lucide-react";

import { NewBreedingForm } from "@/components/Breeding/Form";

export default function SowsPage({ params }: any) {
  const router = useRouter();
  const { sows, setSows, editingSow, setEditingSow, removeSow } = useSowStore();

  const [id, setId] = useState<number | null>();
  const [sow, setSow] = useState<Sow>({} as Sow);
  const [breedings, setBreedings] = useState<Breeding[]>([]);
  let [breeding, setBreeding] = useState<Breeding>({} as Breeding);

  const [breedDate, setBreedDate] = useState<Date>();

  const onDelete = async (id: number) => {
    try {
      await deleteSow(id);
    } catch (err) {
      console.error(`Error deleting sow: ${err}`);
    }

    removeSow(id);
    router.push("/sows");
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBreeding({ ...breeding, [e.target.name]: e.target.value });
  };

  const expectedFarrowDate = useMemo(() => {
    if (breeding.breed_date) {
      const breedDate = new Date(breeding.breed_date);
      const expectedFarrowDate = new Date(breedDate);
      expectedFarrowDate.setDate(expectedFarrowDate.getDate() + 114);
      return expectedFarrowDate.toISOString().split("T")[0];
    }
  }, [breeding.breed_date]);

  const handleCreate = async () => {
    breeding = {
      ...breeding,
      sow_id: id!,
      expected_farrow_date: expectedFarrowDate?.toString()!,
    };

    try {
      let res = await createBreeding(breeding);
      setBreedings([res, ...breedings]);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const getParamsId = async () => {
      const { id } = await params;
      setId(id);
      return id;
    };
    const fetchData = async () => {
      const sows = await getAllSows();
      if (!sows) return;
      setSows(sows);
    };

    getParamsId();
    fetchData();
    return () => {};
  }, [params]);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      let sow = await getSowById(id);
      if (!sow) return;
      setSow(sow);

      let breeding = await getBreedingsBySowId(id);
      if (!breeding) return;
      setBreedings(breeding);
    };
    fetchData();
  }, [id]);

  if (!id || !sow.id) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between">
        <p className="w-full">{sow.name}</p>
        <div className="flex">
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingSow(sow)}>
                <Pen /> แก้ไข
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>แก้ไขแม่พันธุ์</DialogTitle>
              </DialogHeader>
              <SowForm />
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            onClick={() => onDelete(id)}
            className="text-red-500 hover:text-red-500"
          >
            <Trash />
          </Button>
        </div>
      </div>
      <p>
        เกิดเมื่อ:{" "}
        {sow.birthdate
          ? new Date(sow.birthdate).toLocaleDateString()
          : "ไม่มีข้อมูล"}
      </p>
      <p>สถานะ: {sow.is_available ? "พร้อมผสม" : "ตั้งครรภ์"} </p>

      {!sow.is_available && <BreedingCard breeding={breedings[0]} />}
      <div>
        <div>
          <div className="flex justify-between">
            <div className="font-bold mb-2">
              ประวัติผสม {`(${breedings.length} ครั้ง)`}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus /> เพิ่มประวัติผสม
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    <p className="font-bold">เพิ่มประวัติผสม</p>
                  </DialogTitle>
                </DialogHeader>
                <NewBreedingForm id={sow.id.toString()} />
              </DialogContent>
            </Dialog>
          </div>
          {breedings.length > 0 ? (
            <div className="flex flex-col gap-2">
              {breedings.map((breeding, index) => (
                <BreedingCard key={index} breeding={breeding} />
              ))}
            </div>
          ) : (
            <div>No breedings</div>
          )}
        </div>
      </div>
    </div>
  );
}
