"use client";

import { Breeding } from "@/types/breeding";
import { Sow } from "@/types/sow";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function SowCard({ sow }: { sow: Sow }) {
  const supabase = createClient();
  const [breedings, setBreedings] = useState<Breeding[]>([]);

  const getBreedingsBySowId = async (id: number) => {
    let { data, error } = (await supabase
      .from("breedings")
      .select()
      .eq("sow_id", id)
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
    getBreedingsBySowId(sow.id);
    return () => {};
  }, []);
  return (
    <Link
      href={`/sows/${sow.id}`}
      className="w-full max-w-sm rounded overflow-hidden shadow-lg border"
    >
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{sow.name}</div>
        <div>
          {breedings && breedings.length > 0 ? (
            <div>
              <div className="font-bold text-xl mb-2">Breedings</div>
              <div>
                {breedings.map((breeding, index) => (
                  <div key={index}>Breed at: {breeding.breed_date}</div>
                ))}
              </div>
            </div>
          ) : (
            <div>No breedings</div>
          )}
        </div>
      </div>
    </Link>
  );
}
