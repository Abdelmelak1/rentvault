import { OptionProps } from "@/types";

export const propertyTypeOptions: OptionProps[] = [
  { title: "All Types", value: "" },
  { title: "House", value: "house" },
  { title: "Apartment", value: "apartment" },
  { title: "Condo", value: "condo" },
  { title: "Townhouse", value: "townhouse" },
  { title: "Villa", value: "villa" },
  { title: "Penthouse", value: "penthouse" },
  { title: "Commercial", value: "commercial" },
];

export const listingStatusOptions: OptionProps[] = [
  { title: "All Listings", value: "" },
  { title: "For Sale", value: "for-sale" },
  { title: "For Rent", value: "for-rent" },
];

export const bedroomOptions: OptionProps[] = [
  { title: "Any Beds", value: "" },
  { title: "Studio", value: "0" },
  { title: "1 Bed", value: "1" },
  { title: "2 Beds", value: "2" },
  { title: "3 Beds", value: "3" },
  { title: "4 Beds", value: "4" },
  { title: "5+ Beds", value: "5" },
];

export const bathroomOptions: OptionProps[] = [
  { title: "Any Baths", value: "" },
  { title: "1 Bath", value: "1" },
  { title: "2 Baths", value: "2" },
  { title: "3 Baths", value: "3" },
  { title: "4+ Baths", value: "4" },
];

export const REAL_ESTATE_IMAGE =
  "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
