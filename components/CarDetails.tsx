"use client";

import { CarProps } from "@/types";
import {
  calculateCarRent,
  formatDrive,
  formatTransmission,
  formatFuelType,
  formatClass,
} from "@/utils";
import { CAR_IMAGE_PLACEHOLDER } from "@/constants";
import {
  X,
  Gauge,
  Fuel,
  Settings2,
  Car,
  Calendar,
  Cog,
  Cylinder,
  Route,
} from "lucide-react";
import Link from "next/link";

interface CarDetailsProps {
  car: CarProps;
  isOpen: boolean;
  onClose: () => void;
}

function CarDetails({ car, isOpen, onClose }: CarDetailsProps) {
  if (!isOpen || !car) return null;

  const {
    city_mpg,
    class: vehicleClass,
    combination_mpg,
    cylinders,
    displacement,
    drive,
    fuel_type,
    highway_mpg,
    make,
    model,
    transmission,
    year,
  } = car;

  const carRent = calculateCarRent(city_mpg, year, cylinders, displacement);

  const specs = [
    { icon: Calendar, label: "Year", value: year },
    { icon: Car, label: "Class", value: formatClass(vehicleClass) },
    { icon: Fuel, label: "Fuel Type", value: formatFuelType(fuel_type) },
    {
      icon: Settings2,
      label: "Transmission",
      value: formatTransmission(transmission),
    },
    { icon: Route, label: "Drive", value: formatDrive(drive) },
    { icon: Cylinder, label: "Cylinders", value: cylinders || "N/A" },
    {
      icon: Cog,
      label: "Displacement",
      value: displacement ? `${displacement}L` : "N/A",
    },
    { icon: Gauge, label: "City MPG", value: city_mpg },
    { icon: Gauge, label: "Highway MPG", value: highway_mpg },
    { icon: Gauge, label: "Combined MPG", value: combination_mpg },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="relative h-56 w-full overflow-hidden bg-slate-100">
          <img
            src={CAR_IMAGE_PLACEHOLDER}
            alt={`${make} ${model}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-4 left-5">
            <h2 className="text-2xl font-bold text-white">
              {make} {model}
            </h2>
            <p className="text-sm font-medium text-white/80">
              {formatClass(vehicleClass)} | {year}
            </p>
          </div>
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center rounded-full bg-blue-600 px-4 py-1.5 text-sm font-bold text-white shadow-lg">
              ${carRent}/day
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3"
              >
                <spec.icon className="h-4 w-4 flex-shrink-0 text-blue-500" />
                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                    {spec.label}
                  </p>
                  <p className="truncate text-sm font-semibold text-slate-700">
                    {spec.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link href={`/rentals/create?catalog=cars&catalogId=${car.id}`} className="w-full text-center rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-500">Rent Vehicle</Link>
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

export default CarDetails;
