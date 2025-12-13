import { Breeding } from "../types/breeding";
import { supabase } from "./supabase";
import { getCurrentUser } from "./auth";

export const getAllBreedings = async () => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not found");

  const { data, error } = (await supabase
    .from("breedings")
    .select(
      `
      *,
      boars(*),
      sows!inner(*)
    `
    )
    .eq("sows.user_id", user.id)
    .order("expected_farrow_date", { ascending: true })) as {
    data: Breeding[];
    error: any;
  };

  if (error) throw new Error(`Failed to fetch breedings: ${error.message}`);

  return data;
};

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
