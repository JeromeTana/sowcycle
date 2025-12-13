import { Sow } from "../types/sow";
import { supabase } from "./supabase";
import { getCurrentUser } from "./auth";

export const getAllSows = async () => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not found");

  const { data, error } = (await supabase
    .from("sows")
    .select()
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })) as {
    data: Sow[];
    error: any;
  };

  if (error) throw new Error(`Failed to fetch sows: ${error.message}`);

  return data;
};

export const getSowById = async (id: number) => {
  const { data, error } = (await supabase
    .from("sows")
    .select()
    .eq("id", id)
    .single()) as { data: Sow; error: any };

  if (error) throw new Error(`Failed to fetch sow: ${error.message}`);

  return data;
};

export const createSow = async (sow: Sow) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not found");

  const { data, error } = await supabase
    .from("sows")
    .insert([{ ...sow, user_id: user.id }])
    .select()
    .single();

  if (error) throw new Error(`Failed to create sow: ${error.message}`);

  return data;
};

export const updateSow = async (sow: Sow) => {
  const { data, error } = await supabase
    .from("sows")
    .update([sow])
    .eq("id", sow.id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update sow: ${error.message}`);

  return data;
};

export const deleteSow = async (id: number) => {
  const { data, error } = await supabase
    .from("sows")
    .delete()
    .eq("id", id)
    .select();

  if (error) throw new Error(`Failed to delete sow: ${error.message}`);

  return data;
};
