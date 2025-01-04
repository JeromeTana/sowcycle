import { Breeding } from "@/types/breeding";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const getBreedingsBySowId = async (sowId: number) => {
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

  return data;
};
