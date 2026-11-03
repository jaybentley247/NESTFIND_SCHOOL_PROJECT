import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Receipt } from "lucide-react";
import { listMyPayments } from "../api/payments";
import Pagination from "../components/ui/Pagination";
import Skeleton from "../components/ui/Skeleton";
import ErrorState from "../components/ui/ErrorState";
import { formatDate } from "../utils/formatDate";
import { formatMoney } from "../utils/formatPrice";

const PAGE_SIZE = 12;

const PAYMENT_STATUS_STYLES = {
  successful: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-error",
  cancelled: "bg-slate-100 text-slate-600",
};

export default function Payments() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["payments", "mine", page],
    queryFn: () => listMyPayments({ page }),
  });

  const results = data?.results ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900">My Payments</h1>

      {isError ? (
        <div className="mt-6">
          <ErrorState message="Couldn't load your payments." onRetry={refetch} />
        </div>
      ) : isLoading ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Receipt className="h-8 w-8" aria-hidden="true" />
          </div>
          <p className="mt-4 text-lg font-semibold text-slate-900">No payments yet</p>
          <p className="mt-1 text-sm text-slate-500">Payments you make on a listing will show here.</p>
          <Link to="/listings" className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
            Browse Listings
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3">For</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-4 py-3">
                      {payment.property ? (
                        <Link to={`/listings/${payment.property.id}`} className="font-medium text-slate-900 hover:text-primary">
                          {payment.property.title}
                        </Link>
                      ) : (
                        <span className="text-slate-400">Listing removed</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{payment.purpose_display}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{formatMoney(payment.amount, payment.currency)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(payment.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${PAYMENT_STATUS_STYLES[payment.status]}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {payment.receipt_number ? (
                        <Link to={`/payments/${payment.id}/receipt`} className="font-medium text-primary hover:underline">
                          View receipt
                        </Link>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={Math.ceil((data?.count ?? 0) / PAGE_SIZE)} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
