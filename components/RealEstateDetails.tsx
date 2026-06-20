"use client";

import { RealEstateProps } from "@/types/real-estate";
import { formatPrice, formatPropertyType } from "@/utils/real-estate";
import { REAL_ESTATE_IMAGE } from "@/constants/real-estate";
import {
  X,
  Bed,
  Bath,
  Maximize,
  MapPin,
  Calendar,
  Car,
  Waves,
  Tag,
} from "lucide-react";
import Link from "next/link";

interface RealEstateDetailsProps {
  property: RealEstateProps;
  isOpen: boolean;
  onClose: () => void;
}

function RealEstateDetails({
  property,
  isOpen,
  onClose,
}: RealEstateDetailsProps) {
  if (!isOpen || !property) return null;

  const {
    title,
    type,
    price,
    bedrooms,
    bathrooms,
    area,
    city,
    state,
    address,
    yearBuilt,
    garage,
    hasPool,
    listingStatus,
    description,
  } = property;

  const details = [
    { icon: Tag, label: "Type", value: formatPropertyType(type) },
    {
      icon: Bed,
      label: "Bedrooms",
      value: bedrooms === 0 ? "Studio" : `${bedrooms}`,
    },
    { icon: Bath, label: "Bathrooms", value: `${bathrooms}` },
    { icon: Maximize, label: "Area", value: `${area.toLocaleString()} ft²` },
    { icon: Calendar, label: "Year Built", value: `${yearBuilt}` },
    {
      icon: Car,
      label: "Garage",
      value: garage > 0 ? `${garage} Car${garage > 1 ? "s" : ""}` : "None",
    },
    { icon: Waves, label: "Pool", value: hasPool ? "Yes" : "No" },
    { icon: MapPin, label: "Location", value: `${city}, ${state}` },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="relative h-56 w-full overflow-hidden bg-slate-100">
          <img
            src={REAL_ESTATE_IMAGE}
            alt={title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-4 left-5">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <div className="mt-1 flex items-center gap-1 text-sm text-white/80">
              <MapPin className="h-3.5 w-3.5" />
              <span>{address}</span>
            </div>
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold shadow-lg ${
                listingStatus === "for-sale"
                  ? "bg-emerald-500 text-white"
                  : "bg-blue-500 text-white"
              }`}
            >
              {listingStatus === "for-sale" ? "For Sale" : "For Rent"}
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1.5 text-sm font-bold text-white shadow-lg">
              {formatPrice(price, listingStatus)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 left-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            {description}
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {details.map((detail) => (
              <div
                key={detail.label}
                className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3"
              >
                <detail.icon className="h-4 w-4 flex-shrink-0 text-blue-500" />
                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                    {detail.label}
                  </p>
                  <p className="truncate text-sm font-semibold text-slate-700">
                    {detail.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link
              href={`/rentals/create?catalog=real-estate&catalogId=${property.id}`}
              className="w-full text-center rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-500"
            >
              Rent Property
            </Link>
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.98]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RealEstateDetails;
