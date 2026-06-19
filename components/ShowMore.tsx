"use client";

import { ChevronDown } from "lucide-react";

interface ShowMoreProps {
  pageNumber: number;
  isNext: boolean;
  onShowMore: () => void;
}

function ShowMore({ pageNumber, isNext, onShowMore }: ShowMoreProps) {
  return (
    <div className="flex w-full items-center justify-center pt-8 pb-4">
      {isNext ? (
        <button
          onClick={onShowMore}
          className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:shadow-md active:scale-[0.98]"
        >
          <span>Show More</span>
          <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
        </button>
      ) : (
        <p className="text-sm font-medium text-slate-400">
          Showing all results
        </p>
      )}
    </div>
  );
}

export default ShowMore;
