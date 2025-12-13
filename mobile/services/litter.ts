import { Litter } from "../types/litter";
import { supabase } from "./supabase";
import { getCurrentUser } from "./auth";

export const getAllLitters = async () => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not found");

  const { data, error } = (await supabase
    .from("litters")
    .select(
      `
      *,
      boars(*),
      sows!inner(*)
    `
    )
    .eq("sows.user_id", user.id)
    .order("birth_date", { ascending: true })) as {
    data: Litter[];
    error: any;
  };

  if (error) throw new Error(`Failed to fetch litters: ${error.message}`);

  return data;
};

export const getLittersBySowId = async (sowId: number) => {
  const { data, error } = (await supabase
    .from("litters")
    .select()
    .eq("sow_id", sowId)
    .order("birth_date", { ascending: false })) as {
    data: Litter[];
    error: any;
  };

  if (error) throw new Error(`Failed to fetch litters: ${error.message}`);

  return data;
};

export const createLitter = async (litter: Litter) => {
  const { data, error } = await supabase
    .from("litters")
    .insert([litter])
    .select(`*, boars(*)`)
    .single();

  if (error) throw new Error(`Failed to create litter: ${error.message}`);

  return data;
};

export const updateLitter = async (litter: Litter) => {
  const { data, error } = await supabase
    .from("litters")
    .update(litter)
    .eq("id", litter.id)
    .select(`*, boars(*)`)
    .single();

  if (error) throw new Error(`Failed to update litter: ${error.message}`);

  return data;
};

export const deleteLitter = async (id: number) => {
  const { data, error } = await supabase
    .from("litters")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Failed to delete litter: ${error.message}`);

  return data;
};
