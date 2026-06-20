export interface CarProps {
  id: string;
  city_mpg: number;
  class: string;
  combination_mpg: number;
  cylinders: number;
  displacement: number;
  drive: string;
  fuel_type: string;
  highway_mpg: number;
  make: string;
  model: string;
  transmission: string;
  year: number;
  imageUrl?: string;
}

export interface FilterProps {
  manufacturer: string;
  year: number | undefined;
  fuel: string;
  model: string;
  limit: number;
  vehicleClass: string;
  drive: string;
  transmission: string;
}

export interface OptionProps {
  title: string;
  value: string;
}
