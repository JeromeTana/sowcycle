"use client";

import BreedingCard from "@/components/Breeding/Card";
import SowForm from "@/components/Sow/Form";
import { Button } from "@/components/ui/button";
import { getBreedingsBySowId } from "@/services/breeding";
import { deleteSow, getSowById, getAllSows } from "@/services/sow";
import { useSowStore } from "@/stores/useSowStore";
import { Breeding } from "@/types/breeding";
import { Sow } from "@/types/sow";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { NewBreedingForm } from "@/components/Breeding/Form";
import DialogComponent from "@/components/DialogComponent";
import { Pen, Plus, Trash } from "lucide-react";

export default function SowsPage({ params }: any) {
  const router = useRouter();
  const { setSows, removeSow } = useSowStore();

  const [id, setId] = useState<number | null>();
  const [sow, setSow] = useState<Sow>({} as Sow);
  const [breedings, setBreedings] = useState<Breeding[]>([]);

  const onDelete = async (id: number) => {
    try {
      await deleteSow(id);
    } catch (err) {
      console.error(`Error deleting sow: ${err}`);
    }

    removeSow(id);
    router.push("/sows");
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
          <DialogComponent
            title="แก้ไขแม่พันธุ์"
            dialogTriggerButton={
              <Button>
                <Pen /> แก้ไข
              </Button>
            }
          >
            <SowForm editingSow={sow} />
          </DialogComponent>
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
            <DialogComponent
              title="เพิ่มประวัติผสม"
              dialogTriggerButton={
                <Button>
                  <Plus /> เพิ่มประวัติผสม
                </Button>
              }
            >
              <NewBreedingForm id={sow.id.toString()} />
            </DialogComponent>
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
