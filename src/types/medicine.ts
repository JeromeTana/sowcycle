export interface Medicine {
  [key: string]: any;
  id: number;
  created_at?: string;
  updated_at?: string;
  title: string;
  description: string;
  stock_count: number;
}
