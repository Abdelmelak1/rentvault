"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Warehouse } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      localStorage.setItem("rv_token", token);
      router.replace("/");
    } else {
      router.replace("/login");
    }
  }, [params, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900">
          <Warehouse className="h-7 w-7 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
          <span className="text-sm font-medium text-slate-600">Signing you in...</span>
        </div>
      </div>
    </div>
  );
}
