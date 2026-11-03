import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Printer } from "lucide-react";
import { getReceipt } from "../api/payments";
import Skeleton from "../components/ui/Skeleton";
import ErrorState from "../components/ui/ErrorState";
import NotFound from "./NotFound";
import { formatMoney } from "../utils/formatPrice";

function formatDateTime(isoString) {
  return new Intl.DateTimeFormat("en-NG", { dateStyle: "long", timeStyle: "short" }).format(new Date(isoString));
}

function methodLabel(method) {
  if (!method) return "Online payment";
  return method.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function Row({ label, children }) {
  return (
    <div className="flex justify-between gap-6 py-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-slate-900">{children}</dd>
    </div>
  );
}

// A receipt for one of the user's successful payments. "Print / Save as PDF"
// uses the browser's print dialog; print styles hide the navbar and buttons.
export default function Receipt() {
  const { id } = useParams();
  const { data: receipt, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["receipt", id],
    queryFn: () => getReceipt(id),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <Skeleton className="h-[32rem] w-full" />
      </div>
    );
  }

  if (isError) {
    if (error?.response?.status === 404) return <NotFound />;
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <ErrorState message="Couldn't load this receipt." onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 print:max-w-none print:p-0">
      <div className="mb-4 flex items-center justify-between gap-3 print:hidden">
        <Link to="/payments" className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-primary">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> My payments
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          <Printer className="h-4 w-4" aria-hidden="true" /> Print / Save as PDF
        </button>
      </div>

      <article className="rounded-xl border border-slate-200 bg-surface p-8 print:rounded-none print:border-0 print:p-0">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6">
          <img src="/Arowwai-red.png" alt="NestFind" className="h-14 w-auto" />
          <div className="text-right">
            <h1 className="text-xl font-bold text-slate-900">Payment Receipt</h1>
            <p className="mt-1 font-mono text-sm text-slate-600">{receipt.receipt_number}</p>
            <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-700">
              Paid
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 border-b border-slate-200 py-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Billed to</p>
            <p className="mt-1 font-medium text-slate-900">{receipt.payer.name}</p>
            <p className="text-sm text-slate-600">{receipt.payer.email}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Date paid</p>
            <p className="mt-1 font-medium text-slate-900">{formatDateTime(receipt.paid_at)}</p>
          </div>
        </div>

        <dl className="divide-y divide-slate-100 border-b border-slate-200 py-4 text-sm">
          <Row label="Payment for">{receipt.purpose_display}</Row>
          {receipt.property ? (
            <>
              <Row label="Property">{receipt.property.title}</Row>
              <Row label="Location">
                {receipt.property.city}, {receipt.property.state}
              </Row>
              <Row label="Host">{receipt.property.host_name}</Row>
            </>
          ) : (
            <Row label="Property">Listing no longer available</Row>
          )}
          <Row label="Payment method">{methodLabel(receipt.payment_method)}</Row>
          <Row label="Flutterwave transaction ID">
            <span className="font-mono">{receipt.flw_transaction_id}</span>
          </Row>
          <Row label="Payment reference">
            <span className="break-all font-mono text-xs">{receipt.tx_ref}</span>
          </Row>
        </dl>

        <div className="flex items-center justify-between py-6">
          <p className="text-base font-semibold text-slate-900">Amount paid</p>
          <p className="text-2xl font-extrabold text-slate-900">{formatMoney(receipt.amount, receipt.currency)}</p>
        </div>

        <p className="text-xs text-slate-500">
          Issued by NestFind for a payment processed securely by Flutterwave. Keep this receipt for your records.
        </p>
      </article>
    </div>
  );
}
