import { CarProps, FilterProps } from "@/types";

export function calculateCarRent(
  city_mpg: number,
  year: number,
  cylinders: number,
  displacement: number
) {
  const basePricePerDay = 50;
  const mileageFactor = 0.1;
  const ageFactor = 0.05;
  const cylinderFactor = 1.5;
  const displacementFactor = 5;

  const mileageRate = city_mpg * mileageFactor;
  const ageRate = (new Date().getFullYear() - year) * ageFactor;
  const cylinderRate = cylinders * cylinderFactor;
  const displacementRate = displacement * displacementFactor;

  const rentalRatePerDay =
    basePricePerDay - mileageRate + ageRate + cylinderRate + displacementRate;

  return Math.round(Math.max(rentalRatePerDay, 25));
}

export function filterCars(cars: CarProps[], filters: FilterProps): CarProps[] {
  const filtered = cars.filter((car) => {
    if (
      filters.manufacturer &&
      car.make.toLowerCase() !== filters.manufacturer.toLowerCase()
    ) {
      return false;
    }

    if (filters.year && car.year !== filters.year) {
      return false;
    }

    if (filters.fuel && car.fuel_type !== filters.fuel) {
      return false;
    }

    if (
      filters.model &&
      !car.model.toLowerCase().includes(filters.model.toLowerCase())
    ) {
      return false;
    }

    if (filters.vehicleClass && car.class !== filters.vehicleClass) {
      return false;
    }

    if (filters.drive && car.drive !== filters.drive) {
      return false;
    }

    if (filters.transmission && car.transmission !== filters.transmission) {
      return false;
    }

    return true;
  });

  return filtered;
}

export function generatePaginationArray(cars: CarProps[], limit: number) {
  return cars.slice(0, limit);
}

export function formatDrive(drive: string) {
  const map: Record<string, string> = {
    fwd: "FWD",
    rwd: "RWD",
    awd: "AWD",
    "4wd": "4WD",
  };
  return map[drive] || drive.toUpperCase();
}

export function formatTransmission(transmission: string) {
  return transmission === "a" ? "Automatic" : "Manual";
}

export function formatFuelType(fuel: string) {
  const map: Record<string, string> = {
    gas: "Gasoline",
    diesel: "Diesel",
    electricity: "Electric",
    hybrid: "Hybrid",
  };
  return map[fuel] || fuel;
}

export function formatClass(vehicleClass: string) {
  return vehicleClass
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
