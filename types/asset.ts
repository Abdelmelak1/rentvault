export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  created_at: string;
}

export interface Asset {
  id: string;
  owner_id: string;
  category_id: string;
  name: string;
  description: string;
  image_url: string;
  images?: string[];
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  mileage?: number;
  transmission?: string;
  fuel_type?: string;
  seats?: number;
  daily_rate: number;
  weekly_rate: number;
  monthly_rate: number;
  security_deposit: number;
  condition: string;
  status: string;
  location: string;
  created_at: string;
  updated_at: string;
  category_name?: string;
  category_slug?: string;
}

export interface Rental {
  id: string;
  asset_id: string;
  renter_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  security_deposit: number;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
  asset_name?: string;
  asset_image_url?: string;
  asset_daily_rate?: number;
}
