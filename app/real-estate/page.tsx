"use client";

import { useState, useMemo, useEffect } from "react";
import CustomFilter from "@/components/CustomFilter";
import RealEstateCard from "@/components/RealEstateCard";
import RealEstateDetails from "@/components/RealEstateDetails";
import ShowMore from "@/components/ShowMore";
import { realEstateData } from "@/data/real-estate";
import { assets as assetApi } from "@/lib/api";
import { RealEstateProps, RealEstateFilterProps } from "@/types/real-estate";
import { filterRealEstate } from "@/utils/real-estate";
import {
  propertyTypeOptions,
  listingStatusOptions,
  bedroomOptions,
  bathroomOptions,
} from "@/constants/real-estate";
import {
  Building2,
  RotateCcw,
  SearchX,
  ChartBar as BarChart3,
  DollarSign,
  Chrome as Home,
} from "lucide-react";

const ITEMS_PER_PAGE = 12;

export default function RealEstatePage() {
  const [filters, setFilters] = useState<RealEstateFilterProps>({
    type: "",
    minPrice: undefined,
    maxPrice: undefined,
    bedrooms: undefined,
    bathrooms: undefined,
    city: "",
    listingStatus: "",
    limit: ITEMS_PER_PAGE,
  });

  const [selectedProperty, setSelectedProperty] =
    useState<RealEstateProps | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [remoteProperties, setRemoteProperties] = useState<RealEstateProps[]>(
    [],
  );

  useEffect(() => {
    let mounted = true;
    assetApi
      .list({ categorySlug: "real-estate", status: "available" })
      .then((as) => {
        if (!mounted) return;
        const mapped = as.map((a: any) => ({
          id: a.id,
          title: a.name || "Property",
          type: a.propertyType || a.type || "",
          price: Number(a.monthlyRate || a.price || 0),
          bedrooms: a.bedrooms || 0,
          bathrooms: a.bathrooms || 0,
          area: a.areaSqft || 0,
          city: a.city || a.location?.split(",")[0] || "",
          state: a.state || "",
          address: a.address || "",
          yearBuilt: a.yearBuilt || 0,
          garage: a.garage || 0,
          hasPool: a.hasPool || false,
          listingStatus: a.status || "for-rent",
          description: a.description || "",
          imageUrl: a.imageUrl || a.images?.[0] || undefined,
        })) as RealEstateProps[];
        setRemoteProperties(mapped);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const mergedProperties = useMemo(
    () => [...remoteProperties, ...realEstateData],
    [remoteProperties],
  );
  const filteredProperties = useMemo(
    () => filterRealEstate(mergedProperties, filters),
    [mergedProperties, filters],
  );

  const displayedProperties = useMemo(
    () => filteredProperties.slice(0, filters.limit),
    [filteredProperties, filters.limit],
  );

  const isNext = filteredProperties.length > filters.limit;

  const hasActiveFilters =
    filters.type ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.bedrooms !== undefined ||
    filters.bathrooms !== undefined ||
    filters.city ||
    filters.listingStatus;

  const handleShowMore = () => {
    setFilters((prev) => ({ ...prev, limit: prev.limit + ITEMS_PER_PAGE }));
  };

  const handleReset = () => {
    setFilters({
      type: "",
      minPrice: undefined,
      maxPrice: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      city: "",
      listingStatus: "",
      limit: ITEMS_PER_PAGE,
    });
  };

  const handleViewDetails = (property: RealEstateProps) => {
    setSelectedProperty(property);
    setIsDetailsOpen(true);
  };

  const totalProperties = mergedProperties.length;
  const forSaleCount = mergedProperties.filter(
    (p) => p.listingStatus === "for-sale",
  ).length;
  const forRentCount = mergedProperties.filter(
    (p) => p.listingStatus === "for-rent",
  ).length;
  const avgPrice = Math.round(
    mergedProperties.reduce((sum, p) => sum + p.price, 0) /
      Math.max(1, mergedProperties.length),
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-slate-900">
            Real Estate Catalogue
          </h1>
        </div>
        <p className="text-sm text-slate-500">
          Browse through our collection of {totalProperties} properties
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <Building2 className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {totalProperties}
              </p>
              <p className="text-xs text-slate-500">Total Properties</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <Home className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {forSaleCount}
              </p>
              <p className="text-xs text-slate-500">For Sale</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
              <DollarSign className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {forRentCount}
              </p>
              <p className="text-xs text-slate-500">For Rent</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
              <BarChart3 className="h-5 w-5 text-teal-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                  notation: "compact",
                }).format(avgPrice)}
              </p>
              <p className="text-xs text-slate-500">Avg Price</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <CustomFilter
            title="Property Type"
            options={propertyTypeOptions}
            value={filters.type}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                type: value,
                limit: ITEMS_PER_PAGE,
              }))
            }
          />
          <CustomFilter
            title="Listing Status"
            options={listingStatusOptions}
            value={filters.listingStatus}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                listingStatus: value,
                limit: ITEMS_PER_PAGE,
              }))
            }
          />
          <CustomFilter
            title="Bedrooms"
            options={bedroomOptions}
            value={
              filters.bedrooms !== undefined ? String(filters.bedrooms) : ""
            }
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                bedrooms: value !== "" ? parseInt(value) : undefined,
                limit: ITEMS_PER_PAGE,
              }))
            }
          />
          <CustomFilter
            title="Bathrooms"
            options={bathroomOptions}
            value={
              filters.bathrooms !== undefined ? String(filters.bathrooms) : ""
            }
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                bathrooms: value !== "" ? parseInt(value) : undefined,
                limit: ITEMS_PER_PAGE,
              }))
            }
          />
          <div className="relative">
            <input
              type="text"
              placeholder="City..."
              value={filters.city}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  city: e.target.value,
                  limit: ITEMS_PER_PAGE,
                }))
              }
              className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm text-slate-700 shadow-sm transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-slate-500">
              {filteredProperties.length} propert
              {filteredProperties.length !== 1 ? "ies" : "y"} found
            </p>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {displayedProperties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedProperties.map((property) => (
              <RealEstateCard
                key={property.id}
                property={property}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
          <ShowMore
            pageNumber={filters.limit / ITEMS_PER_PAGE}
            isNext={isNext}
            onShowMore={handleShowMore}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <SearchX className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Oops, no results
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Try adjusting your filters to find what you&apos;re looking for
          </p>
          <button
            onClick={handleReset}
            className="mt-4 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.98]"
          >
            Clear Filters
          </button>
        </div>
      )}

      <RealEstateDetails
        property={selectedProperty!}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
}
