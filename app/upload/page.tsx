"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { categories as catApi, assets as assetApi, Category } from "@/lib/api";
import {
  Upload,
  ImagePlus,
  DollarSign,
  MapPin,
  Tag,
  ChevronDown,
  Check,
  CircleAlert as AlertCircle,
  LogIn,
  Car,
  Building2,
  X,
  Loader,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type CategoryType = "vehicles" | "real-estate";

const conditionOptions = ["excellent", "good", "fair", "poor"];

export default function UploadAssetPage() {
  const router = useRouter();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryType, setCategoryType] = useState<CategoryType>("vehicles");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    imageUrl: "",
    dailyRate: "",
    weeklyRate: "",
    monthlyRate: "",
    securityDeposit: "",
    condition: "good",
    status: "available",
    location: "",
    // Vehicle fields
    make: "",
    model: "",
    year: "",
    color: "",
    mileage: "",
    transmission: "",
    fuelType: "",
    seats: "",
    vehicleClass: "",
    cityMpg: "",
    highwayMpg: "",
    combinationMpg: "",
    cylinders: "",
    displacement: "",
    drive: "",
    // Real estate fields
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    areaSqft: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    amenities: "",
    listingStatus: "",
    price: "",
    yearBuilt: "",
    garage: "",
    hasPool: "",
  });

  useEffect(() => {
    catApi
      .list()
      .then(setCategories)
      .catch(() => {});
  }, []);

  const resetForm = () => {
    setSelectedImages([]);
    setPreviewUrls([]);
    setError("");
    setSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setError("Please select only image files");
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Image size should be less than 10MB");
        return false;
      }
      return true;
    });

    setSelectedImages(validFiles);
    setError("");

    const urls = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(null);
    setUploadProgress(null);

    try {
      // Upload images to backend and get URLs
      let uploadedUrls: string[] = previewUrls;
      if (selectedImages.length > 0) {
        setUploadProgress("Uploading images...");
        try {
          const res: any = await assetApi.uploadImages(selectedImages);
          uploadedUrls = res.urls || [];
        } catch (err: any) {
          setError(err.message || "Image upload failed");
          setLoading(false);
          return;
        }
      }

      const category = categories.find((c) => c.slug === categoryType);

      setUploadProgress("Saving asset...");

      // Prepare the asset data based on category type
      const assetData: any = {
        name: form.name,
        description: form.description,
        categoryId: category?.id || form.categoryId,
        imageUrl: uploadedUrls[0] || previewUrls[0] || form.imageUrl,
        dailyRate: parseFloat(form.dailyRate) || 0,
        weeklyRate: parseFloat(form.weeklyRate) || 0,
        monthlyRate: parseFloat(form.monthlyRate) || 0,
        securityDeposit: parseFloat(form.securityDeposit) || 0,
        condition: form.condition,
        status: form.status,
        location: form.location,
        images: uploadedUrls,
      };

      // Add vehicle-specific fields
      if (categoryType === "vehicles") {
        Object.assign(assetData, {
          make: form.make || undefined,
          model: form.model || undefined,
          year: form.year ? parseInt(form.year) : undefined,
          color: form.color || undefined,
          mileage: form.mileage ? parseInt(form.mileage) : undefined,
          transmission: form.transmission || undefined,
          fuelType: form.fuelType || undefined,
          seats: form.seats ? parseInt(form.seats) : undefined,
          vehicleClass: form.vehicleClass || undefined,
          cityMpg: form.cityMpg ? parseInt(form.cityMpg) : undefined,
          highwayMpg: form.highwayMpg ? parseInt(form.highwayMpg) : undefined,
          combinationMpg: form.combinationMpg
            ? parseInt(form.combinationMpg)
            : undefined,
          cylinders: form.cylinders ? parseInt(form.cylinders) : undefined,
          displacement: form.displacement
            ? parseFloat(form.displacement)
            : undefined,
          drive: form.drive || undefined,
        });
      } else {
        // Add real estate-specific fields
        Object.assign(assetData, {
          propertyType: form.propertyType || undefined,
          bedrooms: form.bedrooms ? parseInt(form.bedrooms) : undefined,
          bathrooms: form.bathrooms ? parseFloat(form.bathrooms) : undefined,
          areaSqft: form.areaSqft ? parseInt(form.areaSqft) : undefined,
          address: form.address || undefined,
          city: form.city || undefined,
          state: form.state || undefined,
          zipCode: form.zipCode || undefined,
          amenities: form.amenities
            ? form.amenities.split(",").map((a) => a.trim())
            : [],
          listingStatus: form.listingStatus || undefined,
          price: form.price ? parseFloat(form.price) : undefined,
          yearBuilt: form.yearBuilt ? parseInt(form.yearBuilt) : undefined,
          garage: form.garage ? parseInt(form.garage) : undefined,
          hasPool: form.hasPool ? Boolean(form.hasPool) : undefined,
        });
      }

      await assetApi.create(assetData);

      setSuccess(
        `${categoryType === "vehicles" ? "Vehicle" : "Property"} added successfully!`,
      );

      // Reset form
      setForm({
        name: "",
        description: "",
        categoryId: "",
        imageUrl: "",
        dailyRate: "",
        weeklyRate: "",
        monthlyRate: "",
        securityDeposit: "",
        condition: "good",
        status: "available",
        location: "",
        make: "",
        model: "",
        year: "",
        color: "",
        mileage: "",
        transmission: "",
        fuelType: "",
        seats: "",
        vehicleClass: "",
        cityMpg: "",
        highwayMpg: "",
        combinationMpg: "",
        cylinders: "",
        displacement: "",
        drive: "",
        propertyType: "",
        bedrooms: "",
        bathrooms: "",
        areaSqft: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        amenities: "",
        listingStatus: "",
        price: "",
        yearBuilt: "",
        garage: "",
        hasPool: "",
      });
      resetForm();

      // Navigate after successful upload
      setTimeout(() => {
        router.push(categoryType === "vehicles" ? "/cars" : "/real-estate");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to upload asset");
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  const updateField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-4">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <LogIn className="h-8 w-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Sign in to upload assets
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          You need an account to list your assets for rent.
        </p>
        <Link
          href="/login"
          className="mt-5 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-all"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Upload className="h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-bold text-slate-900">Upload Asset</h1>
          </div>
          <p className="text-sm text-slate-500">
            Add a new asset to your rental inventory
          </p>
        </div>

        {/* Category Selector */}
        <div className="mb-8 flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setCategoryType("vehicles")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
              categoryType === "vehicles"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Car className="h-4 w-4" />
            Vehicle
          </button>
          <button
            type="button"
            onClick={() => setCategoryType("real-estate")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
              categoryType === "real-estate"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 className="h-4 w-4" />
            Real Estate
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 transition-all hover:border-slate-400">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              {previewUrls.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="h-32 w-full rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          removeImage(index);
                        }}
                        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white/50">
                    <div className="text-center">
                      <Upload className="h-6 w-6 text-slate-400 mx-auto" />
                      <span className="mt-1 text-xs text-slate-500">
                        Add more
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <ImagePlus className="h-7 w-7 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    Click to upload images
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    PNG, JPG up to 10MB each
                  </p>
                </div>
              )}
            </label>
          </div>

          {/* Basic Info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-base font-semibold text-slate-900">
              Basic Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder={
                    categoryType === "vehicles"
                      ? "e.g., Toyota Camry 2024"
                      : "e.g., Modern Downtown Apartment"
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Describe your asset..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    placeholder="City, State"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Condition
                </label>
                <select
                  value={form.condition}
                  onChange={(e) => updateField("condition", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {conditionOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Category-specific fields */}
          {categoryType === "vehicles" ? (
            <VehicleFields form={form} updateField={updateField} />
          ) : (
            <RealEstateFields form={form} updateField={updateField} />
          )}

          {/* Pricing */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-base font-semibold text-slate-900">
              Pricing
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Daily Rate ($) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={form.dailyRate}
                    onChange={(e) => updateField("dailyRate", e.target.value)}
                    placeholder="100"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Weekly Rate ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.weeklyRate}
                    onChange={(e) => updateField("weeklyRate", e.target.value)}
                    placeholder="600"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Monthly Rate ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.monthlyRate}
                    onChange={(e) => updateField("monthlyRate", e.target.value)}
                    placeholder="2000"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-4 text-sm text-emerald-700">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              {success}
            </div>
          )}

          {uploadProgress && (
            <div className="flex items-center gap-3 rounded-xl bg-blue-50 border border-blue-200 px-5 py-4 text-sm text-blue-700">
              <Loader className="h-5 w-5 flex-shrink-0 animate-spin" />
              {uploadProgress}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                Upload {categoryType === "vehicles" ? "Vehicle" : "Property"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// Vehicle Fields Component
function VehicleFields({
  form,
  updateField,
}: {
  form: any;
  updateField: (field: string, value: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="mb-4 text-base font-semibold text-slate-900">
        Vehicle Details
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Make
          </label>
          <input
            type="text"
            value={form.make}
            onChange={(e) => updateField("make", e.target.value)}
            placeholder="e.g., Toyota"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Model
          </label>
          <input
            type="text"
            value={form.model}
            onChange={(e) => updateField("model", e.target.value)}
            placeholder="e.g., Camry"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Year
          </label>
          <input
            type="number"
            value={form.year}
            onChange={(e) => updateField("year", e.target.value)}
            min="1900"
            max={new Date().getFullYear() + 1}
            placeholder="2024"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Color
          </label>
          <input
            type="text"
            value={form.color}
            onChange={(e) => updateField("color", e.target.value)}
            placeholder="e.g., Silver"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Mileage (miles)
          </label>
          <input
            type="number"
            value={form.mileage}
            onChange={(e) => updateField("mileage", e.target.value)}
            min="0"
            placeholder="25000"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Transmission
          </label>
          <select
            value={form.transmission}
            onChange={(e) => updateField("transmission", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Select...</option>
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
            <option value="cvt">CVT</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Fuel Type
          </label>
          <select
            value={form.fuelType}
            onChange={(e) => updateField("fuelType", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Select...</option>
            <option value="gasoline">Gasoline</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Seats
          </label>
          <input
            type="number"
            value={form.seats}
            onChange={(e) => updateField("seats", e.target.value)}
            min="1"
            max="12"
            placeholder="5"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Vehicle Class
          </label>
          <input
            type="text"
            value={form.vehicleClass}
            onChange={(e) => updateField("vehicleClass", e.target.value)}
            placeholder="e.g., compact car"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Drive
          </label>
          <input
            type="text"
            value={form.drive}
            onChange={(e) => updateField("drive", e.target.value)}
            placeholder="e.g., fwd"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            City MPG
          </label>
          <input
            type="number"
            value={form.cityMpg}
            onChange={(e) => updateField("cityMpg", e.target.value)}
            placeholder="e.g., 29"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Highway MPG
          </label>
          <input
            type="number"
            value={form.highwayMpg}
            onChange={(e) => updateField("highwayMpg", e.target.value)}
            placeholder="e.g., 35"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Cylinders
          </label>
          <input
            type="number"
            value={form.cylinders}
            onChange={(e) => updateField("cylinders", e.target.value)}
            placeholder="e.g., 4"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Displacement (L)
          </label>
          <input
            type="number"
            step="0.1"
            value={form.displacement}
            onChange={(e) => updateField("displacement", e.target.value)}
            placeholder="e.g., 2.5"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
          />
        </div>
      </div>
    </div>
  );
}

// Real Estate Fields Component
function RealEstateFields({
  form,
  updateField,
}: {
  form: any;
  updateField: (field: string, value: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="mb-4 text-base font-semibold text-slate-900">
        Property Details
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Property Type
            </label>
            <select
              value={form.propertyType}
              onChange={(e) => updateField("propertyType", e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Select...</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="studio">Studio</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Area (sqft)
            </label>
            <input
              type="number"
              value={form.areaSqft}
              onChange={(e) => updateField("areaSqft", e.target.value)}
              min="0"
              placeholder="1500"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Bedrooms
            </label>
            <input
              type="number"
              value={form.bedrooms}
              onChange={(e) => updateField("bedrooms", e.target.value)}
              min="0"
              max="20"
              placeholder="3"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Bathrooms
            </label>
            <input
              type="number"
              value={form.bathrooms}
              onChange={(e) => updateField("bathrooms", e.target.value)}
              min="0"
              max="20"
              step="0.5"
              placeholder="2"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Address
          </label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
            placeholder="123 Main St"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              City
            </label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder="New York"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              State
            </label>
            <input
              type="text"
              value={form.state}
              onChange={(e) => updateField("state", e.target.value)}
              placeholder="NY"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              ZIP Code
            </label>
            <input
              type="text"
              value={form.zipCode}
              onChange={(e) => updateField("zipCode", e.target.value)}
              placeholder="10001"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Amenities (comma-separated)
          </label>
          <input
            type="text"
            value={form.amenities}
            onChange={(e) => updateField("amenities", e.target.value)}
            placeholder="Pool, Gym, Parking, WiFi"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Listing Status
            </label>
            <select
              value={form.listingStatus}
              onChange={(e) => updateField("listingStatus", e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
            >
              <option value="">Select...</option>
              <option value="for-rent">For Rent</option>
              <option value="for-sale">For Sale</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Price (optional)
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              placeholder="e.g., 2500"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Year Built
            </label>
            <input
              type="number"
              value={form.yearBuilt}
              onChange={(e) => updateField("yearBuilt", e.target.value)}
              placeholder="e.g., 2005"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Garage (spaces)
            </label>
            <input
              type="number"
              value={form.garage}
              onChange={(e) => updateField("garage", e.target.value)}
              placeholder="e.g., 1"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              id="hasPool"
              type="checkbox"
              checked={Boolean(form.hasPool)}
              onChange={(e) =>
                updateField("hasPool", e.target.checked ? "true" : "")
              }
              className="h-4 w-4"
            />
            <label
              htmlFor="hasPool"
              className="text-sm font-medium text-slate-700"
            >
              Has Pool
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
