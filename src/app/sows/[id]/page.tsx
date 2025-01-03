"use client";

import BreedingForm from "@/components/Breeding/Form";
import SowDeleteButton from "@/components/Sow/DeleteButton";
import { Breeding } from "@/types/breeding";
import { Sow } from "@/types/sow";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SowsPage({ params }: any) {
  const supabase = createClient();
  const router = useRouter();
  const [id, setId] = useState<number | null>();
  const [sow, setSow] = useState<Sow>({} as Sow);
  const [breedings, setBreedings] = useState<Breeding[]>([]);

  const getSowById = async (id: number) => {
    const { data, error } = (await supabase
      .from("sows")
      .select()
      .eq("id", id)
      .single()) as { data: Sow; error: any };

    if (error) {
      console.log(error);
      return;
    }

    setSow(data);
  };

  const getBreedingsBySowId = async (sowId: number) => {
    const { data, error } = (await supabase
      .from("breedings")
      .select()
      .eq("sow_id", sowId)
      .order("breed_date", { ascending: false })) as {
      data: Breeding[];
      error: any;
    };

    if (error) {
      console.log(error);
      return;
    }

    setBreedings(data);
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
    getSowById(id);
    getBreedingsBySowId(id);
  }, [id]);

  if (!id || !sow.id) return <div>Loading...</div>;

  return (
    <div>
      <Link href={`/sows/${id}/edit`}>Edit</Link>
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
                <div key={index}>
                  Breed at: {breeding.breed_date}
                  <br />
                  Expected farowwing at:
                  {breeding.expected_farrow_date}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>No breedings</div>
        )}
      </div>
      <SowDeleteButton id={id} />
    </div>
  );
}
