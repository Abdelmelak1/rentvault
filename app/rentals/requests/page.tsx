"use client";

import { useEffect, useState } from "react";
import { rentals as rentalApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { format } from "date-fns";

export default function IncomingRequestsPage() {
  const { isAuthenticated, authLoading } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await rentalApi.requests();
      setRequests(res || []);
    } catch (err: any) {
      setError(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, status: "active" | "cancelled") => {
    setActionLoading(id);
    try {
      await rentalApi.updateStatus(id, status);
      await fetchRequests();
    } catch (err: any) {
      setError(err.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (authLoading) return <div className="py-20 text-center">Loading...</div>;
  if (!isAuthenticated)
    return (
      <div className="py-20 text-center">Please sign in to view requests.</div>
    );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Incoming Rental Requests</h1>
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="py-12 text-center">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="py-12 text-center text-slate-600">No incoming requests</div>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => (
              <div key={r.id} className="flex items-center gap-4 rounded-xl border p-4">
                <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {r.asset?.imageUrl ? (
                    // using img tag to avoid next/image optimization on server path variations
                    // keeps code simple for local dev
                    <img src={r.asset.imageUrl} alt={r.asset.name} className="h-20 w-28 object-cover" />
                  ) : (
                    <div className="h-20 w-28 flex items-center justify-center text-sm text-slate-400">No Image</div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{r.asset?.name}</h3>
                      <p className="text-sm text-slate-500">Requested by {r.renter?.fullName || r.renterId}</p>
                    </div>
                    <div className="text-sm text-slate-600">
                      <div>{format(new Date(r.startDate), "MMM d, yyyy")} — {format(new Date(r.endDate), "MMM d, yyyy")}</div>
                      <div className="font-semibold mt-1">{`Total: $${r.totalPrice}`}</div>
                    </div>
                  </div>

                  {r.notes && <p className="mt-2 text-sm text-slate-600">Notes: {r.notes}</p>}

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleAction(r.id, "active")}
                      disabled={actionLoading === r.id}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {actionLoading === r.id ? "Processing..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleAction(r.id, "cancelled")}
                      disabled={actionLoading === r.id}
                      className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {actionLoading === r.id ? "Processing..." : "Reject"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
