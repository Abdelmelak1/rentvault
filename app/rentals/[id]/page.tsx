"use client";

import { useEffect, useState } from "react";
import { rentals as rentalApi, Rental } from "@/lib/api";
import { useRouter } from "next/navigation";
import { CalendarCheck } from "lucide-react";

export default function RentalDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [rental, setRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    rentalApi
      .get(id)
      .then((r) => { if (mounted) setRental(r); })
      .catch(() => { if (mounted) router.push('/rentals'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [id, router]);

  if (loading) return (<div className="p-8"><div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900"/></div>);
  if (!rental) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              {rental.asset?.imageUrl ? <img src={rental.asset.imageUrl} alt={rental.asset?.name} className="w-full h-64 object-cover rounded-lg" /> : <div className="h-64 w-full rounded-lg bg-slate-100 flex items-center justify-center"><CalendarCheck className="h-10 w-10 text-slate-300"/></div>}
            </div>
            <div className="md:col-span-2">
              <h1 className="text-2xl font-bold text-slate-900">{rental.asset?.name}</h1>
              <p className="mt-2 text-sm text-slate-600">{(rental as any).asset?.description}</p>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-700">
                <div><strong>Start:</strong> {new Date(rental.startDate).toLocaleDateString()}</div>
                <div><strong>End:</strong> {new Date(rental.endDate).toLocaleDateString()}</div>
                <div><strong>Duration:</strong> {Math.ceil((new Date(rental.endDate).getTime() - new Date(rental.startDate).getTime()) / 86400000)} days</div>
                <div><strong>Total:</strong> ${Number(rental.totalPrice).toFixed(2)}</div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-900">Asset Details</h3>
                <div className="mt-2 text-sm text-slate-600">
                  {(() => {
                    const a: any = rental.asset as any;
                    if (a?.make) return <div>{a.make} {a.model} • {a.year}</div>;
                    if (a?.propertyType) return <div>{a.propertyType} • {a.bedrooms} bd • {a.bathrooms} ba</div>;
                    return <div>{a?.condition}</div>;
                  })()}
                </div>
              </div>

              {rental.notes && <div className="mt-4 text-sm text-slate-500"><strong>Notes:</strong> <div className="italic">{rental.notes}</div></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
