import { Litter } from "@/types/litter";
import { createClient } from "@/utils/supabase/client";
import { getCurrentUser } from "./auth";

const supabase = createClient();

export const getAllLitters = async () => {
  const user = await getCurrentUser();
  // get from sows that owned by current user
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
    .order("expected_farrow_date", { ascending: true })) as {
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
    .order("breed_date", { ascending: false })) as {
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
