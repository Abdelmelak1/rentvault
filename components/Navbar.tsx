"use client";

import { Car, Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900">
            <Car className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            CarShowcase
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#discover"
            className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            Discover
          </a>
          <a
            href="#"
            className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            About
          </a>
          <button className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.98]">
            Sign In
          </button>
        </nav>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <a
              href="#discover"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
              onClick={() => setMobileOpen(false)}
            >
              Discover
            </a>
            <a
              href="#"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
              onClick={() => setMobileOpen(false)}
            >
              About
            </a>
            <button className="mt-2 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800">
              Sign In
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
