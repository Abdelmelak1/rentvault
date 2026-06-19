"use client";

import { useState, useRef, useEffect } from "react";
import { OptionProps } from "@/types";
import { ChevronDown } from "lucide-react";

interface CustomFilterProps {
  title: string;
  options: OptionProps[];
  value: string;
  onChange: (value: string) => void;
}

function CustomFilter({ title, options, value, onChange }: CustomFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
      >
        <span className="truncate">
          {selectedOption && selectedOption.value
            ? selectedOption.title
            : title}
        </span>
        <ChevronDown
          className={`ml-2 h-4 w-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg animate-in fade-in-0 slide-in-from-top-2 duration-150">
          <div className="max-h-64 overflow-y-auto p-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  value === option.value
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {option.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomFilter;
