export interface RealEstateProps {
  id: string;
  title: string;
  type: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  city: string;
  state: string;
  address: string;
  yearBuilt: number;
  garage: number;
  hasPool: boolean;
  listingStatus: string;
  description: string;
  imageUrl?: string;
}

export interface RealEstateFilterProps {
  type: string;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  bedrooms: number | undefined;
  bathrooms: number | undefined;
  city: string;
  listingStatus: string;
  limit: number;
}
