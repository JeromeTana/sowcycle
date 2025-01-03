"use client";

import { Breeding } from "@/types/breeding";
import { createClient } from "@/utils/supabase/client";
import { useMemo, useState } from "react";

export default function BreedingForm({ sow_id }: { sow_id: number }) {
  const supabase = createClient();
  let [breeding, setBreeding] = useState<Breeding>({} as Breeding);

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
      sow_id: sow_id,
      expected_farrow_date: expectedFarrowDate?.toString()!,
    };

    try {
      await supabase.from("breedings").upsert([breeding]);
      window.location.reload();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="text-black">
      <input
        type="date"
        name="breed_date"
        placeholder="Breed Date"
        onChange={onChange}
        className="border"
      />
      <p className="text-white">{expectedFarrowDate}</p>
      <button className="bg-white" onClick={handleCreate}>
        Create
      </button>
    </div>
  );
}
