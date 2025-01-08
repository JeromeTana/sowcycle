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

  if (error)
    throw new Error(`Failed to fetch medical records: ${error.message}`);

  return data;
};

export const createMedicalRecord = async (medicalRecord: MedicalRecord) => {
  const { data, error } = await supabase
    .from("medical_records")
    .insert([medicalRecord])
    .select()
    .single();

  if (error)
    throw new Error(`Failed to create medical_record: ${error.message}`);

  return data;
};

export const updateMedicalRecord = async (medicalRecord: MedicalRecord) => {
  const { data, error } = await supabase
    .from("medical_records")
    .update(medicalRecord)
    .eq("id", medicalRecord.id)
    .select()
    .single();

  if (error)
    throw new Error(`Failed to update medical_record: ${error.message}`);

  return data;
};

export const deleteMedicalRecord = async (id: number) => {
  const { data, error } = await supabase
    .from("medical_records")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error)
    throw new Error(`Failed to delete medical_record: ${error.message}`);

  return data;
};
