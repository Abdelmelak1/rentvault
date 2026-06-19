"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { categories as catApi, assets as assetApi, Category, Asset } from "@/lib/api";
import Hero from "@/components/Hero";
import { Warehouse, Car, Building2, Wrench, Monitor, PartyPopper, Tent, Hammer, Shirt, ArrowRight, MapPin, DollarSign, Tag, Package, Shield, Clock, Users, TrendingUp, Zap, ChartBar as BarChart3 } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Car, Building: Building2, Wrench, Monitor, PartyPopper, Tent, Hammer, Shirt, Package,
};

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      catApi.list(),
      assetApi.list({ status: "available" }),
    ]).then(([cats, assts]) => {
      setCategories(cats);
      setAssets(assts.slice(0, 8));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-12">
      <Hero />

      {/* Perspectives */}
      <section className="mt-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { icon: Zap, color: "bg-blue-50", iconColor: "text-blue-500", title: "Instant Booking", desc: "Reserve any asset in seconds with real-time availability." },
            { icon: Shield, color: "bg-emerald-50", iconColor: "text-emerald-500", title: "Secure Deposits", desc: "Protected transactions with held security deposits." },
            { icon: TrendingUp, color: "bg-amber-50", iconColor: "text-amber-500", title: "Earn Passive Income", desc: "Monetize idle assets and generate steady revenue." },
            { icon: Clock, color: "bg-rose-50", iconColor: "text-rose-500", title: "Flexible Durations", desc: "Rent by the day, week, or month on your terms." },
            { icon: Users, color: "bg-teal-50", iconColor: "text-teal-500", title: "Trusted Community", desc: "Verified owners and renters you can rely on." },
            { icon: BarChart3, color: "bg-slate-100", iconColor: "text-slate-500", title: "Full Analytics", desc: "Track earnings, occupancy, and rental performance." },
          ].map(({ icon: Icon, color, iconColor, title, desc }) => (
            <div key={title} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color} mb-3`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">{title}</h3>
              <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Browse by Category</h2>
            <p className="text-xs text-slate-500 mt-0.5">{categories.length} categories available</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((cat) => {
            const IconComp = iconMap[cat.icon] || Package;
            const href = cat.slug === "vehicles" ? "/cars" : cat.slug === "real-estate" ? "/real-estate" : "/";
            return (
              <Link key={cat.id} href={href}
                className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 transition-colors group-hover:bg-blue-100">
                  <IconComp className="h-5 w-5 text-blue-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{cat.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{cat.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Assets */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
              <Warehouse className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Available Assets</h2>
              <p className="text-xs text-slate-500">Recently added rentals</p>
            </div>
          </div>
          <Link href="/manage" className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
          </div>
        ) : assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Package className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No assets yet</h3>
            <p className="mt-1 text-sm text-slate-500">Be the first to upload an asset</p>
            <Link href="/upload" className="mt-4 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.98]">Upload Asset</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {assets.map((asset) => (
              <div key={asset.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-slate-300 hover:-translate-y-1">
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  {asset.imageUrl ? (
                    <img src={asset.imageUrl} alt={asset.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center"><Package className="h-10 w-10 text-slate-300" /></div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                      {asset.category?.name || "Asset"}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="inline-flex items-center rounded-full bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 text-sm font-bold text-white shadow-sm">
                      ${Number(asset.dailyRate).toFixed(0)}/day
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-bold text-slate-900 leading-tight line-clamp-1">{asset.name}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    {asset.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-slate-400" />{asset.location}</span>}
                    <span className="flex items-center gap-1"><Tag className="h-3 w-3 text-slate-400" />{asset.condition}</span>
                  </div>
                  {asset.description && <p className="mt-2 text-xs text-slate-500 line-clamp-2">{asset.description}</p>}
                  <div className="mt-3 flex items-center gap-3 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <DollarSign className="h-3 w-3 text-emerald-500" />
                      <span className="font-medium">${Number(asset.weeklyRate).toFixed(0)}/wk</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <DollarSign className="h-3 w-3 text-blue-500" />
                      <span className="font-medium">${Number(asset.monthlyRate).toFixed(0)}/mo</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="mt-12 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 sm:p-12">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
            <Warehouse className="h-6 w-6 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Start earning with your assets</h2>
          <p className="mt-3 max-w-lg text-sm text-slate-300 leading-relaxed">Upload your vehicles, properties, equipment, or any rentable asset and start earning today.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/upload" className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]">Upload Asset</Link>
            <Link href="/manage" className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-[0.98]">Manage Assets</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
