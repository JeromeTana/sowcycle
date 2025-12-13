export interface MedicalRecord {
  id?: number;
  created_at?: string;
  updated_at?: string;
  sow_id: number;
  symptoms?: string;
  medicine?: string;
  use_at: string;
}
