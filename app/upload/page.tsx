"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { categories as catApi, assets as assetApi, Category } from "@/lib/api";
import { Upload, ImagePlus, DollarSign, MapPin, Tag, ChevronDown, Check, CircleAlert as AlertCircle, LogIn } from "lucide-react";
import Link from "next/link";

const conditionOptions = ["excellent", "good", "fair", "poor"];
const statusOptions = ["available", "maintenance", "retired"];

export default function UploadAssetPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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
  });

  useEffect(() => {
    catApi.list().then(setCategories).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await assetApi.create({
        name: form.name,
        description: form.description,
        categoryId: form.categoryId || undefined,
        imageUrl: form.imageUrl,
        dailyRate: parseFloat(form.dailyRate) || 0,
        weeklyRate: parseFloat(form.weeklyRate) || 0,
        monthlyRate: parseFloat(form.monthlyRate) || 0,
        securityDeposit: parseFloat(form.securityDeposit) || 0,
        condition: form.condition,
        status: form.status,
        location: form.location,
      });
      setSuccess(true);
      setForm({
        name: "", description: "", categoryId: "", imageUrl: "",
        dailyRate: "", weeklyRate: "", monthlyRate: "", securityDeposit: "",
        condition: "good", status: "available", location: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to upload asset");
    } finally {
      setLoading(false);
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
        <h2 className="text-xl font-bold text-slate-900">Sign in to upload assets</h2>
        <p className="mt-2 text-sm text-slate-500">You need an account to list your assets for rent.</p>
        <Link href="/login" className="mt-5 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-all">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Upload className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-slate-900">Upload Asset</h1>
        </div>
        <p className="text-sm text-slate-500">Add a new asset to your rental inventory</p>
      </div>

      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-4">
          <Check className="h-5 w-5 text-emerald-500" />
          <p className="text-sm font-medium text-emerald-700">Asset uploaded successfully!</p>
        </div>
      )}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-5 py-4">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Asset Name *</label>
              <input type="text" required value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="e.g. 2024 Tesla Model 3"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Describe your asset, features, condition, etc."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select value={form.categoryId} onChange={(e) => updateField("categoryId", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-700 shadow-sm transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option value="">Select category</option>
                  {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="text" value={form.location} onChange={(e) => updateField("location", e.target.value)} placeholder="e.g. San Francisco, CA"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 shadow-sm transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Image</h2>
          <div className="relative">
            <ImagePlus className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="url" value={form.imageUrl} onChange={(e) => updateField("imageUrl", e.target.value)} placeholder="https://example.com/image.jpg"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 shadow-sm transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          {form.imageUrl && (
            <div className="mt-3 h-40 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <img src={form.imageUrl} alt="Preview" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Pricing</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[["dailyRate", "Daily Rate"], ["weeklyRate", "Weekly Rate"], ["monthlyRate", "Monthly Rate"], ["securityDeposit", "Security Deposit"]].map(([field, label]) => (
              <div key={field}>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">{label} ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="number" step="0.01" min="0" value={form[field as keyof typeof form]} onChange={(e) => updateField(field, e.target.value)} placeholder="0.00"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 shadow-sm transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Condition & Status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Condition & Status</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Condition</label>
              <div className="flex flex-wrap gap-2">
                {conditionOptions.map((opt) => (
                  <button key={opt} type="button" onClick={() => updateField("condition", opt)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${form.condition === opt ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((opt) => (
                  <button key={opt} type="button" onClick={() => updateField("status", opt)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${form.status === opt ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
            <Upload className="h-4 w-4" />
            {loading ? "Uploading..." : "Upload Asset"}
          </button>
        </div>
      </form>
    </div>
  );
}
