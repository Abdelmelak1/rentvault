import { RealEstateProps, RealEstateFilterProps } from "@/types/real-estate";

export function filterRealEstate(
  properties: RealEstateProps[],
  filters: RealEstateFilterProps
): RealEstateProps[] {
  return properties.filter((property) => {
    if (filters.type && property.type !== filters.type) return false;
    if (filters.minPrice && property.price < filters.minPrice) return false;
    if (filters.maxPrice && property.price > filters.maxPrice) return false;
    if (filters.bedrooms !== undefined && filters.bedrooms !== 0) {
      if (filters.bedrooms >= 5) {
        if (property.bedrooms < 5) return false;
      } else {
        if (property.bedrooms !== filters.bedrooms) return false;
      }
    }
    if (filters.bedrooms === 0 && filters.bedrooms !== undefined) {
      if (property.bedrooms !== 0) return false;
    }
    if (filters.bathrooms !== undefined && filters.bathrooms !== 0) {
      if (filters.bathrooms >= 4) {
        if (property.bathrooms < 4) return false;
      } else {
        if (property.bathrooms !== filters.bathrooms) return false;
      }
    }
    if (filters.city && !property.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
    if (filters.listingStatus && property.listingStatus !== filters.listingStatus) return false;
    return true;
  });
}

export function formatPrice(price: number, listingStatus: string) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  return listingStatus === "for-rent" ? `${formatted}/mo` : formatted;
}

export function formatPropertyType(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
