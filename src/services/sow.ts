import { Sow } from "@/types/sow";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const getAllSows = async () => {
  try {
    const { data, error } = (await supabase
      .from("sows")
      .select()
      .order("created_at", { ascending: false })) as {
      data: Sow[];
      error: any;
    };

    if (error) {
      console.log(error);
      return;
    }
    return data;
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error fetching sows: ${err.message}`);
      throw err;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getSowById = async (id: number) => {
  try {
    const { data, error } = (await supabase
      .from("sows")
      .select()
      .eq("id", id)
      .single()) as { data: Sow; error: any };

    if (error) throw new Error(`Failed to fetch sow: ${error.message}`);

    return data;
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error fetching sow: ${err.message}`);
      throw err;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const createSow = async (sow: Sow) => {
  try {
    const { data, error } = await supabase
      .from("sows")
      .insert([sow])
      .select()
      .single();

    if (error) throw new Error(`Failed to create sow: ${error.message}`);

    return data;
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error creating sow: ${err.message}`);
      throw err;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateSow = async (sow: Sow) => {
  try {
    const { data, error } = await supabase
      .from("sows")
      .update([sow])
      .eq("id", sow.id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update sow: ${error.message}`);

    return data;
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error updating sow: ${err.message}`);
      throw err;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteSow = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("sows")
      .delete()
      .eq("id", id)
      .select();

    if (error) throw new Error(`Failed to delete sow: ${error.message}`);

    return data;
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error deleting sow: ${err.message}`);
      throw err;
    }
    throw new Error("An unexpected error occurred");
  }
};
