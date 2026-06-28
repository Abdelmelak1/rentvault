"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  rentals as rentalApi,
  assets as assetApi,
  categories as catApi,
  Rental,
  Asset,
} from "@/lib/api";
import { carsData } from "@/data/cars";
import { realEstateData } from "@/data/real-estate";
import { calculateCarRent } from "@/utils";
import { CAR_IMAGE_PLACEHOLDER } from "@/constants";
import { REAL_ESTATE_IMAGE } from "@/constants/real-estate";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function CreateRentalPage() {
  const router = useRouter();
  const params = useSearchParams();
  const assetIdFromQs = params?.get("assetId") || null;
  const catalog = params?.get("catalog") || null;
  const catalogId = params?.get("catalogId") || null;
  const { isAuthenticated, loading: authLoading, user } = useAuth();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(
    assetIdFromQs,
  );
  const [snapshot, setSnapshot] = useState<any | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;
    // If an assetId is provided via query, fetch that asset and preselect it
    if (assetIdFromQs) {
      assetApi
        .get(assetIdFromQs)
        .then((a) => {
          setAssets([a]);
          setSelectedAssetId(a.id);
        })
        .catch(() => setAssets([]));
      return;
    }

    // If catalog params provided (catalog listing), prepare a snapshot (don't create DB asset)
    if (catalog && catalogId) {
      // find catalog item
      let created = null as any;
      if (catalog === "cars") {
        const car = carsData.find((c) => c.id === catalogId);
        if (car) {
          // prepare snapshot for rental (no DB asset creation)
          const daily = calculateCarRent(
            car.city_mpg,
            car.year,
            car.cylinders,
            car.displacement,
          );
          setSnapshot({
            snapshotTitle: `${car.make} ${car.model} ${car.year}`,
            snapshotImageUrl: CAR_IMAGE_PLACEHOLDER,
            snapshotDailyRate: daily,
            snapshotSecurityDeposit: 0,
            snapshotOwnerName: "Catalog",
            snapshotOwnerEmail: "",
          });
          setAssets([]);
          setSelectedAssetId(null);
          return;
        }
      }
      if (catalog === "real-estate") {
        const prop = realEstateData.find((p) => p.id === catalogId);
        if (prop) {
          // prepare snapshot for rental (no DB asset creation)
          setSnapshot({
            snapshotTitle: prop.title,
            snapshotImageUrl: REAL_ESTATE_IMAGE,
            snapshotDailyRate: prop.price || 0,
            snapshotSecurityDeposit: 0,
            snapshotOwnerName: "Catalog",
            snapshotOwnerEmail: "",
          });
          setAssets([]);
          setSelectedAssetId(null);
          return;
        }
      }
    }
    // fetch all available assets so other users can request rentals
    assetApi
      .list({ status: "available" })
      .then((list) => {
        // hide assets owned by current user
        if (user?.id) {
          setAssets(list.filter((a) => a.ownerId !== user.id));
        } else {
          setAssets(list);
        }
      })
      .catch(() => setAssets([]));
  }, [isAuthenticated, user?.id]);

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-lg font-semibold">Sign in to create a rental</h2>
        <p className="mt-2 text-sm text-slate-500">
          You need an account to request rentals.
        </p>
        <div className="mt-4">
          <Link href="/login" className="text-blue-600">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!startDate || !endDate)
      return setError("Select dates");
    if (!selectedAssetId && !snapshot) return setError("Select asset or snapshot and dates");
    setLoading(true);
    try {
      if (selectedAssetId) {
        await rentalApi.create({ assetId: selectedAssetId, startDate, endDate, notes });
      } else if (snapshot) {
        await rentalApi.create({
          startDate,
          endDate,
          notes,
          snapshotTitle: snapshot.snapshotTitle,
          snapshotImageUrl: snapshot.snapshotImageUrl,
          snapshotOwnerName: snapshot.snapshotOwnerName,
          snapshotOwnerEmail: snapshot.snapshotOwnerEmail,
          snapshotOwnerPhone: snapshot.snapshotOwnerPhone,
          snapshotDailyRate: snapshot.snapshotDailyRate,
          snapshotSecurityDeposit: snapshot.snapshotSecurityDeposit,
        });
      }
      router.push("/rentals");
    } catch (err: any) {
      setError(err.message || "Failed to create rental");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Create Rental</h1>
        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {selectedAssetId && assets.length > 0 ? (
            <div className="rounded-lg border p-3 bg-white">
              <div className="flex items-center gap-3">
                {assets[0].imageUrl ? (
                  <img
                    src={assets[0].imageUrl}
                    alt={assets[0].name}
                    className="h-16 w-20 rounded-md object-cover"
                  />
                ) : (
                  <div className="h-16 w-20 rounded-md bg-slate-100" />
                )}
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900">
                    {assets[0].name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {assets[0].category?.name || ""}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAssetId(null)}
                  className="text-sm text-blue-600"
                >
                  Change
                </button>
              </div>
            </div>
          ) : snapshot ? (
            <div className="rounded-lg border p-3 bg-white">
              <div className="flex items-center gap-3">
                {snapshot.snapshotImageUrl ? (
                  <img src={snapshot.snapshotImageUrl} alt={snapshot.snapshotTitle} className="h-16 w-20 rounded-md object-cover" />
                ) : (
                  <div className="h-16 w-20 rounded-md bg-slate-100" />
                )}
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900">{snapshot.snapshotTitle}</div>
                  <div className="text-xs text-slate-500">Catalog item</div>
                </div>
                <button type="button" onClick={() => { setSnapshot(null); setSelectedAssetId(null); }} className="text-sm text-blue-600">Change</button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {assets.length === 0 ? (
                <div className="text-sm text-slate-500">No available assets to request.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {assets.map((a) => (
                    <div key={a.id} className="rounded-lg border p-3 bg-white flex items-center gap-3">
                      {a.imageUrl ? (
                        <img src={a.imageUrl} alt={a.name} className="h-20 w-28 rounded-md object-cover" />
                      ) : (
                        <div className="h-20 w-28 rounded-md bg-slate-100" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-sm">{a.name}</div>
                        <div className="text-xs text-slate-500">{a.category?.name || a.category?.slug}</div>
                        <div className="text-sm font-bold mt-1">${Number(a.dailyRate || 0).toFixed(0)}/day</div>
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => { setSelectedAssetId(a.id); setSnapshot(null); }}
                          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white"
                        >
                          Request
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-slate-900 text-white px-4 py-2"
            >
              {loading ? "Requesting..." : "Request Rental"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
