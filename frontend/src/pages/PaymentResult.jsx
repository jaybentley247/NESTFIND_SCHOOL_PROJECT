import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { verifyPayment } from "../api/payments";
import Skeleton from "../components/ui/Skeleton";
import ErrorState from "../components/ui/ErrorState";
import { formatMoney } from "../utils/formatPrice";

const STATES = {
  successful: {
    icon: CheckCircle2,
    color: "text-green-600 bg-green-100",
    title: "Payment successful",
    body: "Your payment has been confirmed and a receipt has been issued. You can view it any time under My Payments.",
  },
  failed: {
    icon: XCircle,
    color: "text-error bg-red-100",
    title: "Payment failed",
    body: "The payment didn't go through, so nothing has been confirmed. You can try again from the listing.",
  },
  cancelled: {
    icon: XCircle,
    color: "text-slate-600 bg-slate-100",
    title: "Payment cancelled",
    body: "You left checkout before paying. You can try again from the listing.",
  },
  pending: {
    icon: Clock,
    color: "text-amber-600 bg-amber-100",
    title: "Payment pending",
    body: "We haven't been able to confirm this payment yet. If you were charged, it will update shortly.",
  },
};

// Flutterwave redirects here with ?status=&tx_ref=&transaction_id=. Those
// values are only passed to the backend, which checks the real status with
// Flutterwave; what's shown comes from that check, not the URL.
export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const txRef = searchParams.get("tx_ref");
  const transactionId = searchParams.get("transaction_id") || "";
  const redirectStatus = searchParams.get("status") || "";

  const { data: payment, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["payment-verify", txRef, transactionId],
    queryFn: () => verifyPayment({ tx_ref: txRef, transaction_id: transactionId, status: redirectStatus }),
    enabled: Boolean(txRef),
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (!txRef) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <ErrorState message="This payment link is missing its reference." />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <ErrorState message="Couldn't check this payment." onRetry={refetch} />
      </div>
    );
  }

  const state = STATES[payment.status] ?? STATES.pending;
  const Icon = state.icon;

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <div className="rounded-xl border border-slate-200 bg-surface p-8 text-center">
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${state.color}`}>
          <Icon className="h-8 w-8" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-slate-900">{state.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{state.body}</p>
        {payment.verification_error && <p className="mt-2 text-sm text-amber-700">{payment.verification_error}</p>}

        <dl className="mt-6 space-y-2 rounded-lg bg-slate-50 p-4 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Amount</dt>
            <dd className="font-semibold text-slate-900">{formatMoney(payment.amount, payment.currency)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">For</dt>
            <dd className="text-right text-slate-900">
              {payment.purpose_display}
              {payment.property ? ` — ${payment.property.title}` : ""}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Reference</dt>
            <dd className="break-all text-right font-mono text-xs text-slate-700">{payment.tx_ref}</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {payment.status === "pending" && (
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
            >
              {isFetching ? "Checking…" : "Check again"}
            </button>
          )}
          {payment.status === "successful" && (
            <Link
              to={`/payments/${payment.id}/receipt`}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              View receipt
            </Link>
          )}
          <Link to="/payments" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            My payments
          </Link>
          {payment.property && (
            <Link
              to={`/listings/${payment.property.id}`}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to listing
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
