import { MedicalRecord } from "@/types/medicalRecord";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const getMedicalRecordsBySowId = async (sowId: number) => {
  const { data, error } = (await supabase
    .from("medical_records")
    .select()
    .eq("sow_id", sowId)
    .order("created_date", { ascending: false })) as {
    data: MedicalRecord[];
    error: any;
  };

  if (error) {
    console.log(error);
    return;
  }

  return data;
};

export const createMedicalRecord = async (medicalRecord: MedicalRecord) => {
  try {
    const { data, error } = await supabase
      .from("medical_records")
      .insert([medicalRecord])
      .select()
      .single();

    if (error) throw new Error(`Failed to create medical_record: ${error.message}`);

    return data;
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error creating medical_record: ${err.message}`);
      throw err;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateMedicalRecord = async (medicalRecord: MedicalRecord) => {
  try {
    const { data, error } = await supabase
      .from("medical_records")
      .update(medicalRecord)
      .eq("id", medicalRecord.id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update medical_record: ${error.message}`);

    return data;
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error updating medical_record: ${err.message}`);
      throw err;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteMedicalRecord = async (id: number) => {
  try {
    const { error } = await supabase.from("medical_records").delete().eq("id", id);

    if (error) throw new Error(`Failed to delete medical_record: ${error.message}`);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error deleting medical_record: ${err.message}`);
      throw err;
    }
    throw new Error("An unexpected error occurred");
  }
};
