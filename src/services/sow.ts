import { Sow } from "@/types/sow";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const getSowById = async (id: number) => {
  try {
    const { data, error } = (await supabase
      .from("sows")
      .select()
      .eq("id", id)
      .single()) as { data: Sow; error: any };

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const createSow = async (sow: Sow) => {
  try {
    const { data, error } = await supabase
      .from("sows")
      .insert([sow])
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error(error);
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

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteSow = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("sows")
      .delete()
      .eq("id", id)
      .select();

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error(error);
  }
};
