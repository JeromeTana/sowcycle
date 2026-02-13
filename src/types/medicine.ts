export interface Medicine {
  [key: string]: any;
  id: string;
  created_at?: string;
  updated_at?: string;
  title: string;
  description: string;
  stock_count: number;
}
