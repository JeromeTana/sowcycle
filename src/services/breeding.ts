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

  if (error) throw new Error(`Failed to fetch breedings: ${error.message}`);

  return data;
};

export const createBreeding = async (breeding: Breeding) => {
  const { data, error } = await supabase
    .from("breedings")
    .insert([breeding])
    .select(`*, boars(*)`)
    .single();

  if (error) throw new Error(`Failed to create breeding: ${error.message}`);

  return data;
};

export const updateBreeding = async (breeding: Breeding) => {
  const { data, error } = await supabase
    .from("breedings")
    .update(breeding)
    .eq("id", breeding.id)
    .select(`*, boars(*)`)
    .single();

  if (error) throw new Error(`Failed to update breeding: ${error.message}`);

  return data;
};

export const deleteBreeding = async (id: number) => {
  const { data, error } = await supabase
    .from("breedings")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Failed to delete breeding: ${error.message}`);

  return data;
};
