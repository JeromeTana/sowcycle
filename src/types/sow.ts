import { Breeding } from "./breeding";

export interface Sow {
  [key: string]: any;
  id: number;
  created_at?: string;
  updated_at?: string;
  name: string;
  birthdate?: string;
  is_available?: boolean;
  is_active?: boolean;
  breedings: Breeding[];
}
