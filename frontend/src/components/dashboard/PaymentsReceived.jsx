import { useQuery } from "@tanstack/react-query";
import { listReceivedPayments } from "../../api/payments";
import Skeleton from "../ui/Skeleton";
import ErrorState from "../ui/ErrorState";
import { formatDate } from "../../utils/formatDate";
import { formatMoney } from "../../utils/formatPrice";

// Successful payments tenants have made on this host's listings.
export default function PaymentsReceived() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["payments", "received"],
    queryFn: () => listReceivedPayments(),
  });

  if (isError) return <ErrorState message="Couldn't load payments." onRetry={refetch} />;
  if (isLoading) return <Skeleton className="h-32 w-full" />;

  const results = data?.results ?? [];
  if (results.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-500">
        No payments received yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Paid by</th>
            <th className="px-4 py-3">Property</th>
            <th className="px-4 py-3">For</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {results.map((payment) => (
            <tr key={payment.id}>
              <td className="px-4 py-3 font-medium text-slate-900">{payment.payer_name}</td>
              <td className="px-4 py-3 text-slate-600">{payment.property?.title ?? "Listing removed"}</td>
              <td className="px-4 py-3 text-slate-600">{payment.purpose_display}</td>
              <td className="px-4 py-3 font-semibold text-slate-900">{formatMoney(payment.amount, payment.currency)}</td>
              <td className="px-4 py-3 text-slate-600">{formatDate(payment.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
