"use client";

import { Warehouse, Upload, FolderOpen } from "lucide-react";
import Link from "next/link";

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 mt-6 mb-8">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-emerald-500 blur-3xl" />
      </div>

      <div className="relative px-6 py-14 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/20 ring-1 ring-blue-500/30">
            <Warehouse className="h-7 w-7 text-blue-400" />
          </div>

          <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Rent Anything,
            <span className="mt-1 block bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Earn Everything
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base text-slate-300 leading-relaxed">
            The all-in-one asset rental platform. Upload your vehicles,
            properties, equipment, and more. Browse, rent, and manage
            everything in one place.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/upload"
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <Upload className="h-4 w-4" />
              Upload Asset
            </Link>
            <Link
              href="/manage"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-[0.98]"
            >
              <FolderOpen className="h-4 w-4" />
              Manage Assets
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
