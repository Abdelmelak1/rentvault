"use client";

import { useState, useMemo } from "react";
import SearchBar from "@/components/SearchBar";
import CustomFilter from "@/components/CustomFilter";
import CarCard from "@/components/CarCard";
import CarDetails from "@/components/CarDetails";
import ShowMore from "@/components/ShowMore";
import { carsData } from "@/data/cars";
import { CarProps, FilterProps } from "@/types";
import { filterCars, generatePaginationArray } from "@/utils";
import {
  fuelOptions,
  yearOptions,
  classOptions,
  driveOptions,
  transmissionOptions,
} from "@/constants";
import { SlidersHorizontal, RotateCcw, SearchX, ChartBar as BarChart3, Car } from "lucide-react";

const ITEMS_PER_PAGE = 12;

export default function CarsPage() {
  const [filters, setFilters] = useState<FilterProps>({
    manufacturer: "",
    year: undefined,
    fuel: "",
    model: "",
    limit: ITEMS_PER_PAGE,
    vehicleClass: "",
    drive: "",
    transmission: "",
  });

  const [selectedCar, setSelectedCar] = useState<CarProps | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredCars = useMemo(() => filterCars(carsData, filters), [filters]);
  const displayedCars = useMemo(
    () => generatePaginationArray(filteredCars, filters.limit),
    [filteredCars, filters.limit]
  );

  const isNext = filteredCars.length > filters.limit;

  const hasActiveFilters =
    filters.manufacturer ||
    filters.year ||
    filters.fuel ||
    filters.model ||
    filters.vehicleClass ||
    filters.drive ||
    filters.transmission;

  const handleShowMore = () => {
    setFilters((prev) => ({ ...prev, limit: prev.limit + ITEMS_PER_PAGE }));
  };

  const handleReset = () => {
    setFilters({
      manufacturer: "",
      year: undefined,
      fuel: "",
      model: "",
      limit: ITEMS_PER_PAGE,
      vehicleClass: "",
      drive: "",
      transmission: "",
    });
  };

  const handleViewDetails = (car: CarProps) => {
    setSelectedCar(car);
    setIsDetailsOpen(true);
  };

  const totalCars = carsData.length;
  const avgMpg = Math.round(
    carsData.reduce((sum, c) => sum + c.combination_mpg, 0) / totalCars
  );
  const electricCount = carsData.filter((c) => c.fuel_type === "electricity").length;
  const hybridCount = carsData.filter((c) => c.fuel_type === "hybrid").length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Car className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-slate-900">Car Catalogue</h1>
        </div>
        <p className="text-sm text-slate-500">
          Browse through our collection of {totalCars} vehicles
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <Car className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{totalCars}</p>
              <p className="text-xs text-slate-500">Total Vehicles</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <BarChart3 className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{avgMpg}</p>
              <p className="text-xs text-slate-500">Avg Combined MPG</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
              <BarChart3 className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{electricCount}</p>
              <p className="text-xs text-slate-500">Electric Vehicles</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
              <BarChart3 className="h-5 w-5 text-teal-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{hybridCount}</p>
              <p className="text-xs text-slate-500">Hybrid Vehicles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-8">
        <SearchBar
          manufacturer={filters.manufacturer}
          model={filters.model}
          onManufacturerChange={(value) =>
            setFilters((prev) => ({ ...prev, manufacturer: value, limit: ITEMS_PER_PAGE }))
          }
          onModelChange={(value) =>
            setFilters((prev) => ({ ...prev, model: value, limit: ITEMS_PER_PAGE }))
          }
          onSearch={() => setFilters((prev) => ({ ...prev, limit: ITEMS_PER_PAGE }))}
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <CustomFilter
            title="Fuel Type"
            options={fuelOptions}
            value={filters.fuel}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, fuel: value, limit: ITEMS_PER_PAGE }))
            }
          />
          <CustomFilter
            title="Year"
            options={yearOptions}
            value={filters.year ? String(filters.year) : ""}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                year: value ? parseInt(value) : undefined,
                limit: ITEMS_PER_PAGE,
              }))
            }
          />
          <CustomFilter
            title="Vehicle Class"
            options={classOptions}
            value={filters.vehicleClass}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, vehicleClass: value, limit: ITEMS_PER_PAGE }))
            }
          />
          <CustomFilter
            title="Drive Type"
            options={driveOptions}
            value={filters.drive}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, drive: value, limit: ITEMS_PER_PAGE }))
            }
          />
          <CustomFilter
            title="Transmission"
            options={transmissionOptions}
            value={filters.transmission}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, transmission: value, limit: ITEMS_PER_PAGE }))
            }
          />
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-slate-500">
              {filteredCars.length} vehicle{filteredCars.length !== 1 ? "s" : ""} found
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
      {displayedCars.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedCars.map((car) => (
              <CarCard key={car.id} car={car} onViewDetails={handleViewDetails} />
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
          <h3 className="text-lg font-semibold text-slate-900">Oops, no results</h3>
          <p className="mt-1 text-sm text-slate-500">
            Try adjusting your search or filter to find what you&apos;re looking for
          </p>
          <button
            onClick={handleReset}
            className="mt-4 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.98]"
          >
            Clear Filters
          </button>
        </div>
      )}

      <CarDetails
        car={selectedCar!}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
}
