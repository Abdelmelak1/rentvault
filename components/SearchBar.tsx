"use client";

import { useState, useRef, useEffect } from "react";
import { manufacturers } from "@/constants";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  manufacturer: string;
  model: string;
  onManufacturerChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onSearch: () => void;
}

function SearchBar({
  manufacturer,
  model,
  onManufacturerChange,
  onModelChange,
  onSearch,
}: SearchBarProps) {
  const [manuInput, setManuInput] = useState(manufacturer);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredManufacturers, setFilteredManufacturers] =
    useState(manufacturers);
  const manuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        manuRef.current &&
        !manuRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleManufacturerInput = (value: string) => {
    setManuInput(value);
    onManufacturerChange(value);
    setShowSuggestions(true);
    setFilteredManufacturers(
      manufacturers.filter((m) =>
        m.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const selectManufacturer = (m: string) => {
    setManuInput(m);
    onManufacturerChange(m);
    setShowSuggestions(false);
  };

  const clearManufacturer = () => {
    setManuInput("");
    onManufacturerChange("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div ref={manuRef} className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Manufacturer..."
              value={manuInput}
              onChange={(e) => handleManufacturerInput(e.target.value)}
              onFocus={() => {
                setShowSuggestions(true);
                setFilteredManufacturers(
                  manufacturers.filter((m) =>
                    m.toLowerCase().includes(manuInput.toLowerCase())
                  )
                );
              }}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-700 shadow-sm transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {manuInput && (
              <button
                type="button"
                onClick={clearManufacturer}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {showSuggestions && filteredManufacturers.length > 0 && (
            <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg animate-in fade-in-0 slide-in-from-top-2 duration-150">
              <div className="max-h-56 overflow-y-auto p-1">
                {filteredManufacturers.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => selectManufacturer(m)}
                    className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Model..."
            value={model}
            onChange={(e) => onModelChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm text-slate-700 shadow-sm transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md active:scale-[0.98]"
        >
          <Search className="h-4 w-4" />
          <span>Search</span>
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
