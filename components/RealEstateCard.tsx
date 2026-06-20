"use client";

import { RealEstateProps } from "@/types/real-estate";
import { formatPrice, formatPropertyType } from "@/utils/real-estate";
import { REAL_ESTATE_IMAGE } from "@/constants/real-estate";
import { Bed, Bath, Maximize, MapPin, Chrome as Home } from "lucide-react";
import { useRouter } from "next/navigation";

interface RealEstateCardProps {
  property: RealEstateProps;
  onViewDetails: (property: RealEstateProps) => void;
}

function RealEstateCard({ property, onViewDetails }: RealEstateCardProps) {
  const router = useRouter();
  const {
    price,
    bedrooms,
    bathrooms,
    area,
    city,
    state,
    listingStatus,
    title,
  } = property;
  const rawType =
    (property as any).type || (property as any).propertyType || "";
  const type = rawType;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-slate-300 hover:-translate-y-1">
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={property.imageUrl || REAL_ESTATE_IMAGE}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
            {formatPropertyType(type)}
          </span>
          <span
            className={`inline-flex items-center rounded-full backdrop-blur-sm px-3 py-1 text-xs font-bold shadow-sm ${
              listingStatus === "for-sale"
                ? "bg-emerald-500/90 text-white"
                : "bg-blue-500/90 text-white"
            }`}
          >
            {listingStatus === "for-sale" ? "For Sale" : "For Rent"}
          </span>
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="inline-flex items-center rounded-full bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 text-sm font-bold text-white shadow-sm">
            {formatPrice(price, listingStatus)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-slate-900 leading-tight line-clamp-1">
            {title}
          </h3>
          <div className="mt-1.5 flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span className="line-clamp-1">
              {city}, {state}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 border-t border-slate-100 pt-3">
          {bedrooms > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Bed className="h-4 w-4 text-blue-500" />
              <span className="font-medium">
                {bedrooms} Bed{bedrooms !== 1 ? "s" : ""}
              </span>
            </div>
          )}
          {bedrooms === 0 && (
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Home className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Studio</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <Bath className="h-4 w-4 text-emerald-500" />
            <span className="font-medium">
              {bathrooms} Bath{bathrooms !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <Maximize className="h-4 w-4 text-amber-500" />
            <span className="font-medium">
              {area.toLocaleString()} ft&sup2;
            </span>
          </div>
        </div>

        <div className="mt-auto flex gap-2">
          <button
            onClick={() => onViewDetails(property)}
            className="flex-1 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.98]"
          >
            View Details
          </button>
          <button
            onClick={() =>
              router.push(
                `/rentals/create?catalog=real-estate&catalogId=${property.id}`,
              )
            }
            className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-500 active:scale-[0.98]"
          >
            Rent
          </button>
        </div>
      </div>
    </div>
  );
}

export default RealEstateCard;
