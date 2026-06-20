-- AlterTable
ALTER TABLE "assets" ADD COLUMN     "color" TEXT,
ADD COLUMN     "fuel_type" TEXT,
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "make" TEXT,
ADD COLUMN     "mileage" INTEGER,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "seats" INTEGER,
ADD COLUMN     "transmission" TEXT,
ADD COLUMN     "year" INTEGER;
