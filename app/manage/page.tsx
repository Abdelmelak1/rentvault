"use client";

import { useState, useEffect, useCallback } from "react";
import { assets as assetApi, Asset } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { FolderOpen, Search, Trash2, CreditCard as Edit3, Check, MapPin, DollarSign, Tag, MoveHorizontal as MoreHorizontal, LogIn, CircleAlert as AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ManageAssetsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Asset>>({});
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await assetApi.mine();
      setAssets(data);
    } catch { setAssets([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchAssets();
    else setLoading(false);
  }, [isAuthenticated, fetchAssets]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this asset?")) return;
    try {
      await assetApi.remove(id);
      setAssets((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) { setError(err.message); }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      const updated = await assetApi.update(editingId, {
        name: editForm.name,
        description: editForm.description,
        dailyRate: editForm.dailyRate ? Number(editForm.dailyRate) : undefined,
        weeklyRate: editForm.weeklyRate ? Number(editForm.weeklyRate) : undefined,
        monthlyRate: editForm.monthlyRate ? Number(editForm.monthlyRate) : undefined,
        condition: editForm.condition,
        status: editForm.status,
        location: editForm.location,
      });
      setAssets((prev) => prev.map((a) => (a.id === editingId ? updated : a)));
      setEditingId(null);
      setEditForm({});
    } catch (err: any) { setError(err.message); }
  };

  const startEdit = (asset: Asset) => {
    setEditingId(asset.id);
    setEditForm({ name: asset.name, description: asset.description, dailyRate: asset.dailyRate, weeklyRate: asset.weeklyRate, monthlyRate: asset.monthlyRate, condition: asset.condition, status: asset.status, location: asset.location });
  };

  const filtered = assets.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusColor = (s: string) => {
    switch (s) {
      case "available": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "rented": return "bg-blue-50 text-blue-700 border-blue-200";
      case "maintenance": return "bg-amber-50 text-amber-700 border-amber-200";
      case "retired": return "bg-slate-100 text-slate-500 border-slate-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-4">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <LogIn className="h-8 w-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sign in to manage assets</h2>
        <p className="mt-2 text-sm text-slate-500">Your asset inventory is only visible when signed in.</p>
        <Link href="/login" className="mt-5 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-all">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FolderOpen className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-slate-900">My Assets</h1>
        </div>
        <p className="text-sm text-slate-500">Manage and monitor your rental inventory</p>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-5 py-4">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-4">
        {[["Total", assets.length, "text-slate-900"], ["Available", assets.filter(a => a.status === "available").length, "text-emerald-600"], ["Rented", assets.filter(a => a.status === "rented").length, "text-blue-600"], ["Maintenance", assets.filter(a => a.status === "maintenance").length, "text-amber-600"]].map(([label, count, color]) => (
          <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className={`text-2xl font-bold ${color}`}>{String(count)}</p>
            <p className="text-xs text-slate-500">{String(label)}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search assets..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 shadow-sm transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["", "available", "rented", "maintenance", "retired"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${statusFilter === s ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <FolderOpen className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No assets found</h3>
          <p className="mt-1 text-sm text-slate-500">{assets.length === 0 ? "Upload your first asset to get started" : "Try adjusting your search or filter"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((asset) => (
            <div key={asset.id} className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
              {editingId === asset.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[["name", "Name", "text"], ["location", "Location", "text"], ["dailyRate", "Daily Rate", "number"]].map(([f, l, t]) => (
                      <div key={f}>
                        <label className="mb-1 block text-xs font-medium text-slate-500">{l}</label>
                        <input type={t} value={String(editForm[f as keyof typeof editForm] || "")} onChange={(e) => setEditForm(p => ({ ...p, [f]: e.target.value }))}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                      </div>
                    ))}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500">Status</label>
                      <select value={editForm.status || ""} onChange={(e) => setEditForm(p => ({ ...p, status: e.target.value }))}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                        {["available", "rented", "maintenance", "retired"].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-slate-500">Description</label>
                      <textarea rows={2} value={editForm.description || ""} onChange={(e) => setEditForm(p => ({ ...p, description: e.target.value }))}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => { setEditingId(null); setEditForm({}); }} className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                    <button onClick={handleUpdate} className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800">
                      <Check className="h-3.5 w-3.5" /> Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    {asset.imageUrl ? <img src={asset.imageUrl} alt={asset.name} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center"><MoreHorizontal className="h-5 w-5 text-slate-400" /></div>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-semibold text-slate-900">{asset.name}</h3>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusColor(asset.status)}`}>{asset.status}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      {asset.category && <span className="flex items-center gap-1"><Tag className="h-3 w-3" />{asset.category.name}</span>}
                      {asset.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{asset.location}</span>}
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{Number(asset.dailyRate).toFixed(2)}/day</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => startEdit(asset)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"><Edit3 className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(asset.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
