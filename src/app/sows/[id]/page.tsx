"use client";

import BreedingForm from "@/components/Breeding/Form";
import SowForm from "@/components/Sow/Form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getBreedingsBySowId } from "@/services/breeding";
import { deleteSow, getSowById } from "@/services/sow";
import { useSowStore } from "@/stores/useSowStore";
import { Breeding } from "@/types/breeding";
import { Sow } from "@/types/sow";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SowsPage({ params }: any) {
  const router = useRouter();
  const [id, setId] = useState<number | null>();
  const { editingSow, setEditingSow, removeSow } = useSowStore();
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
    getParamsId();
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

  if (editingSow) return <SowForm />;

  return (
    <div>
      <Button onClick={() => setEditingSow(sow)}>Edit</Button>
      <div className="w-full max-w-sm rounded overflow-hidden shadow-lg border">
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{sow.name}</div>
        </div>
      </div>
      <div>
        <BreedingForm sow_id={id} />
        {breedings.length > 0 ? (
          <div>
            <div className="font-bold text-xl mb-2">Breedings</div>
            <div className="flex flex-col gap-4">
              {breedings.map((breeding, index) => (
                <Card key={index}>
                  <CardHeader>Breed at: {breeding.breed_date}</CardHeader>
                  <CardContent>
                    Expected farowwing at:
                    {breeding.expected_farrow_date}
                    <br />
                    Actual farowwing at:
                    {breeding.actual_farrow_date}
                    <br />
                    Piglet alive: {breeding.piglets_born_alive}
                    <br /> Piglet dead: {breeding.piglets_born_dead}
                    <br /> Piglet count: {breeding.piglets_born_count}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div>No breedings</div>
        )}
      </div>
      <button onClick={() => onDelete(id)}>Delete</button>
    </div>
  );
}
