import { Boar } from "../types/boar";
import { supabase } from "./supabase";
import { getCurrentUser } from "./auth";

export const getAllBoars = async () => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not found");

  const { data, error } = (await supabase
    .from("boars")
    .select()
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })) as {
    data: Boar[];
    error: any;
  };

  if (error) throw new Error(`Failed to fetch boars: ${error.message}`);

  return data;
};

export const getBoarById = async (id: number) => {
  const { data, error } = (await supabase
    .from("boars")
    .select()
    .eq("id", id)
    .single()) as { data: Boar; error: any };

  if (error) throw new Error(`Failed to fetch boar: ${error.message}`);

  return data;
};

export const createBoar = async (boar: Boar) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not found");

  const { data, error } = await supabase
    .from("boars")
    .insert([{ ...boar, user_id: user.id }])
    .select()
    .single();

  if (error) throw new Error(`Failed to create boar: ${error.message}`);

  return data;
};

export const updateBoar = async (boar: Boar) => {
  const { data, error } = await supabase
    .from("boars")
    .update([boar])
    .eq("id", boar.id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update boar: ${error.message}`);

  return data;
};

export const deleteBoar = async (id: number) => {
  const { data, error } = await supabase
    .from("boars")
    .delete()
    .eq("id", id)
    .select();

  if (error) throw new Error(`Failed to delete boar: ${error.message}`);

  return data;
};
