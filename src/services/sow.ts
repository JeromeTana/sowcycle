import { Sow } from "@/types/sow";
import { createClient } from "@/utils/supabase/client";
import { getCurrentUser } from "./auth";

const supabase = createClient();

export const getAllSows = async () => {
  const user = await getCurrentUser();
  try {
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
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error fetching sows: ${err.message}`);
      throw err;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getAllSowsWithLatestBreeding = async () => {
  const user = await getCurrentUser();
  try {
    const { data, error } = (await supabase
      .from("sows")
      .select(
        `*,
        breedings(*)
        `
      )
      .eq("user_id", user.id)
      .order("breed_date", { ascending: false, referencedTable: "breedings" })
      .order("created_at", { ascending: false })
      .limit(1, {
        foreignTable: "breedings",
      })) as {
      data: Sow[];
      error: any;
    };

    if (error) throw new Error(`Failed to fetch sows: ${error.message}`);

    return data;
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error fetching sows with latest breeding: ${err.message}`);
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

export const getSowByIdWithAllInfo = async (id: number) => {
  const user = await getCurrentUser();
  try {
    const { data, error } = (await supabase
      .from("sows")
      .select(
        `*,
        breedings(*, boars(*)),
        medical_records(*)
        `
      )
      .eq("id", id)
      .eq("user_id", user.id)
      .order("breed_date", { ascending: false, referencedTable: "breedings" })
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
  const user = await getCurrentUser();
  try {
    const { data, error } = await supabase
      .from("sows")
      .insert([{ ...sow, user_id: user.id }])
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

export const patchSow = async (sow: Partial<Sow>) => {
  try {
    const { data, error } = await supabase
      .from("sows")
      .update(sow)
      .eq("id", sow.id)
      .select(
        `
      *,
      breedings(*)`
      )
      .order("breed_date", { ascending: false, referencedTable: "breedings" })
      .limit(1, {
        foreignTable: "breedings",
      })
      .single();

    if (error) throw new Error(`Failed to patch sow: ${error.message}`);

    return data;
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error patching sow: ${err.message}`);
      throw err;
    }
    throw new Error("An unexpected error occurred");
  }
};
