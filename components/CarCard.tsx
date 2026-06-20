"use client";

import { CarProps } from "@/types";
import {
  calculateCarRent,
  formatDrive,
  formatTransmission,
  formatFuelType,
} from "@/utils";
import { CAR_IMAGE_PLACEHOLDER } from "@/constants";
import {
  Gauge,
  Fuel,
  Settings2,
  Car,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface CarCardProps {
  car: CarProps;
  onViewDetails: (car: CarProps) => void;
}

function CarCard({ car, onViewDetails }: CarCardProps) {
  const router = useRouter();
  const {
    city_mpg,
    year,
    cylinders,
    displacement,
    drive,
    fuel_type,
    make,
    model,
    transmission,
  } = car;

  const carRent = calculateCarRent(city_mpg, year, cylinders, displacement);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-slate-300 hover:-translate-y-1">
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={car.imageUrl || CAR_IMAGE_PLACEHOLDER}
          alt={`${make} ${model}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
            {year}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center rounded-full bg-blue-600/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white shadow-sm">
            ${carRent}/day
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-slate-900 leading-tight">
            {make} {model}
          </h3>
          <p className="mt-1 text-xs font-medium text-slate-400 uppercase tracking-wider">
            {car.class}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
            <Gauge className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase">
                City MPG
              </p>
              <p className="text-sm font-bold text-slate-700">{city_mpg}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
            <Fuel className="h-4 w-4 text-emerald-500" />
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase">
                Fuel
              </p>
              <p className="text-sm font-bold text-slate-700">
                {formatFuelType(fuel_type)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
            <Settings2 className="h-4 w-4 text-amber-500" />
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase">
                Trans
              </p>
              <p className="text-sm font-bold text-slate-700">
                {formatTransmission(transmission)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
            <Car className="h-4 w-4 text-rose-500" />
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase">
                Drive
              </p>
              <p className="text-sm font-bold text-slate-700">
                {formatDrive(drive)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-auto flex gap-2">
          <button
            onClick={() => onViewDetails(car)}
            className="flex-1 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.98]"
          >
            View Details
          </button>
          <button
            onClick={() => router.push(`/rentals/create?catalog=cars&catalogId=${car.id}`)}
            className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-500 active:scale-[0.98]"
          >
            Rent
          </button>
        </div>
      </div>
    </div>
  );
}

export default CarCard;
