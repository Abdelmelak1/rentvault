"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { rentals as rentalApi, Rental } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  CalendarCheck,
  Clock,
  CircleCheck as CheckCircle2,
  Circle as XCircle,
  CircleAlert as AlertCircle,
  Search,
  LogIn,
  MapPin,
  Tag,
} from "lucide-react";
import Link from "next/link";

export default function MyRentalsPage() {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [ownerRequests, setOwnerRequests] = useState<Rental[]>([]);
  const [acceptedOwned, setAcceptedOwned] = useState<Rental[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "requests" | "accepted">("all");

  const fetchRentals = useCallback(async () => {
    setLoading(true);
    try {
      const data = await rentalApi.list();
      setRentals(data);
      if (user?.id) {
        try {
          const reqs = await rentalApi.requests();
          setOwnerRequests(reqs || []);
        } catch {
          setOwnerRequests([]);
        }
        try {
          const owned = await rentalApi.owner("active");
          setAcceptedOwned(owned || []);
        } catch {
          setAcceptedOwned([]);
        }
      }
      // initialize previous statuses map
      prevStatuses.current = {};
      data.forEach((r) => (prevStatuses.current[r.id] = r.status));
    } catch {
      setRentals([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const { toast } = useToast();
  const prevStatuses = useRef<Record<string, string>>({});

  const approveRequest = async (id: string) => {
    try {
      await rentalApi.updateStatus(id, "active");
      toast({ title: "Request approved", description: "Rental approved and marked active." });
      fetchRentals();
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to approve" });
    }
  };

  const rejectRequest = async (id: string) => {
    try {
      await rentalApi.updateStatus(id, "cancelled");
      toast({ title: "Request rejected", description: "Rental request was cancelled." });
      fetchRentals();
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to reject" });
    }
  };

  // Poll for changes every 15 seconds to notify renter of status updates
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!isAuthenticated) return;
      try {
        const latest = await rentalApi.list();
        // detect status changes
        latest.forEach((r) => {
          const prev = prevStatuses.current[r.id];
          if (prev && prev !== r.status) {
            // show toast for important transitions
            if (r.status === "active") {
              toast({ title: "Rental approved", description: `${r.asset?.name} has been approved by the owner.` });
            } else if (r.status === "cancelled") {
              toast({ title: "Rental cancelled", description: `${r.asset?.name} request was rejected or cancelled.` });
            } else if (r.status === "completed") {
              toast({ title: "Rental completed", description: `${r.asset?.name} rental marked completed.` });
            }
          }
          prevStatuses.current[r.id] = r.status;
        });
        setRentals(latest);
        if (user?.id) {
          try {
            const reqs = await rentalApi.requests();
            setOwnerRequests(reqs || []);
          } catch {
            setOwnerRequests([]);
          }
          try {
            const owned = await rentalApi.owner("active");
            setAcceptedOwned(owned || []);
          } catch {
            setAcceptedOwned([]);
          }
        }
      } catch (e) {
        // ignore polling errors
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [isAuthenticated, toast, user?.id]);

  useEffect(() => {
    if (isAuthenticated) fetchRentals();
    else setLoading(false);
  }, [isAuthenticated, fetchRentals]);

  const filtered = rentals.filter((r) => {
    const matchSearch = (r.asset?.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus = !statusFilter || r.status === statusFilter;
    // tab filtering: requests -> pending, accepted -> active
    const matchTab =
      tab === "all"
        ? true
        : tab === "requests"
        ? r.status === "pending"
        : r.status === "active";
    return matchSearch && matchStatus && matchTab;
  });

  // When 'accepted' tab is active, include accepted rentals for assets you own as well
  const combinedAccepted =
    tab === "accepted"
      ? [
          // active rentals where you are the renter
          ...rentals.filter((r) => r.status === "active"),
          // active rentals where you are the owner
          ...acceptedOwned,
        ]
      : [];
  const acceptedFiltered = combinedAccepted.filter((r) => {
    const matchSearch = (r.asset?.name || r.snapshotTitle || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus = !statusFilter || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusIcon = (s: string) => {
    switch (s) {
      case "active":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "active":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  const daysBetween = (s: string, e: string) =>
    Math.ceil((new Date(e).getTime() - new Date(s).getTime()) / 86400000);

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-4">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <LogIn className="h-8 w-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Sign in to view rentals
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Your rental history is only visible when signed in.
        </p>
        <Link
          href="/login"
          className="mt-5 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-all"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <CalendarCheck className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-slate-900">My Rentals</h1>
        </div>
        <p className="text-sm text-slate-500">
          Track and manage your rental history
        </p>
        <div className="mt-4 flex items-center gap-2">
          {[
            ["all", "All", rentals.length],
            ["requests", "Requests", rentals.filter((r) => r.status === "pending").length],
            [
              "accepted",
              "Accepted",
              rentals.filter((r) => r.status === "active").length + acceptedOwned.length,
            ],
            ["asOwner", "As Owner", ownerRequests.length],
          ].map(([key, label, count]) => (
            <button
              key={String(key)}
              onClick={() => setTab(key as any)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${tab === key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {String(label)} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-4">
        {[
          ["Total", rentals.length, "text-slate-900"],
          [
            "Active",
            rentals.filter((r) => r.status === "active").length,
            "text-blue-600",
          ],
          [
            "Pending",
            rentals.filter((r) => r.status === "pending").length,
            "text-amber-600",
          ],
          [
            "Completed",
            rentals.filter((r) => r.status === "completed").length,
            "text-emerald-600",
          ],
        ].map(([label, count, color]) => (
          <div
            key={String(label)}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className={`text-2xl font-bold ${color}`}>{String(count)}</p>
            <p className="text-xs text-slate-500">{String(label)}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search rentals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 shadow-sm transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["", "active", "pending", "completed", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${statusFilter === s ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
        </div>
      ) : tab === "asOwner" ? (
        // Owner view: incoming requests and accepted rentals for assets you own
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Incoming Requests</h2>
            {ownerRequests.length === 0 ? (
              <div className="text-sm text-slate-500">No incoming requests</div>
            ) : (
              <div className="space-y-3">
                {ownerRequests.map((r) => (
                  <div key={r.id} className="rounded-lg border p-3 bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{r.asset?.name || r.snapshotTitle}</div>
                        <div className="text-xs text-slate-500">{r.renter?.fullName || "Unknown renter"}</div>
                      </div>
                      <div className="text-sm text-slate-600">{r.status}</div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">{formatDate(r.startDate)} — {formatDate(r.endDate)}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => approveRequest(r.id)}
                        className="rounded-lg bg-emerald-600 px-3 py-1 text-sm font-medium text-white"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => rejectRequest(r.id)}
                        className="rounded-lg bg-red-500 px-3 py-1 text-sm font-medium text-white"
                      >
                        Reject
                      </button>
                      <a href={`/rentals/${r.id}`} className="text-sm text-blue-600">Details</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Accepted Rentals (Your Assets)</h2>
            {acceptedOwned.length === 0 ? (
              <div className="text-sm text-slate-500">No accepted rentals</div>
            ) : (
              <div className="space-y-3">
                {acceptedOwned.map((r) => (
                  <div key={r.id} className="rounded-lg border p-3 bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{r.asset?.name}</div>
                        <div className="text-xs text-slate-500">{r.renter?.fullName}</div>
                      </div>
                      <div className="text-sm text-slate-600">{r.status}</div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">{formatDate(r.startDate)} — {formatDate(r.endDate)}</div>
                    <div className="mt-2">
                      <a href={`/rentals/${r.id}`} className="text-sm text-blue-600">View</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <CalendarCheck className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            No rentals found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {rentals.length === 0
              ? "Your rental history will appear here"
              : "Try adjusting your search or filter"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {(tab === "accepted" ? acceptedFiltered : filtered).map((rental) => (
            <div
              key={rental.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-slate-300 hover:-translate-y-1"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                {rental.asset?.imageUrl ? (
                  <img
                    src={rental.asset.imageUrl}
                    alt={rental.asset?.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <CalendarCheck className="h-10 w-10 text-slate-300" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                    {rental.asset?.name || "Asset"}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="inline-flex items-center rounded-full bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 text-sm font-bold text-white shadow-sm">
                    ${Number(rental.asset?.dailyRate || 0).toFixed(0)}/day
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-base font-bold text-slate-900 leading-tight line-clamp-1">
                  {rental.asset?.name}
                </h3>
                <div className="mt-2 text-sm text-slate-600">
                  {(() => {
                    const a: any = rental.asset as any;
                    if (a?.make)
                      return (
                        <div className="text-sm font-medium">
                          {a.make} {a.model} • {a.year}
                        </div>
                      );
                    if (a?.propertyType)
                      return (
                        <div className="text-sm font-medium">
                          {a.propertyType} • {a.bedrooms}bd • {a.bathrooms}ba
                        </div>
                      );
                    return null;
                  })()}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  {rental.asset?.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {rental.asset.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Tag className="h-3 w-3 text-slate-400" />
                    {(rental.asset as any)?.condition || "Good"}
                  </span>
                </div>
                {rental.asset?.description && (
                  <p className="mt-2 text-xs text-slate-500 line-clamp-2">
                    {rental.asset.description}
                  </p>
                )}

                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500 sm:grid-cols-4 border-t border-slate-100 pt-3">
                  <div>
                    <span className="font-medium text-slate-600">Start:</span>{" "}
                    {formatDate(rental.startDate)}
                  </div>
                  <div>
                    <span className="font-medium text-slate-600">End:</span>{" "}
                    {formatDate(rental.endDate)}
                  </div>
                  <div>
                    <span className="font-medium text-slate-600">
                      Duration:
                    </span>{" "}
                    {daysBetween(rental.startDate, rental.endDate)} days
                  </div>
                  <div>
                    <span className="font-medium text-slate-600">Total:</span> $
                    {Number(rental.totalPrice).toFixed(2)}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <a
                    href={`/rentals/${rental.id}`}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
