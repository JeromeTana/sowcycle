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

export const createBreeding = async (breeding: Breeding) => {
  try {
    const { data, error } = await supabase
      .from("breedings")
      .insert([breeding])
      .select()
      .single();

    if (error) throw new Error(`Failed to create breeding: ${error.message}`);

    return data;
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error creating breeding: ${err.message}`);
      throw err;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateBreeding = async (breeding: Breeding) => {
  try {
    const { data, error } = await supabase
      .from("breedings")
      .update(breeding)
      .eq("id", breeding.id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update breeding: ${error.message}`);

    return data;
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error updating breeding: ${err.message}`);
      throw err;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteBreeding = async (id: number) => {
  try {
    const { error } = await supabase.from("breedings").delete().eq("id", id);

    if (error) throw new Error(`Failed to delete breeding: ${error.message}`);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error deleting breeding: ${err.message}`);
      throw err;
    }
    throw new Error("An unexpected error occurred");
  }
};
