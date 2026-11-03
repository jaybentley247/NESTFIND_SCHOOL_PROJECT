import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, Lock } from "lucide-react";
import { getPaymentQuote, initiatePayment } from "../../api/payments";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../context/ToastContext";
import { formatMoney } from "../../utils/formatPrice";

const LABELS = {
  rent: { title: "Rent", action: "Pay rent" },
  booking_fee: { title: "Booking", action: "Book & pay" },
  deposit: { title: "Deposit", action: "Pay deposit" },
};

// Flutterwave hosted checkout: the backend works out the amount and returns
// a checkout link, and the browser is sent there to pay.
export default function PayNowButton({ property }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const { data: quote } = useQuery({
    queryKey: ["payment-quote", property.id],
    queryFn: () => getPaymentQuote(property.id),
    retry: false,
  });

  // Hosts can't pay, and listings without an online payment show nothing.
  if (!quote || !LABELS[quote.purpose] || user?.role === "host") return null;
  const label = LABELS[quote.purpose];

  async function handlePay() {
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const { link } = await initiatePayment({ purpose: quote.purpose, property_id: property.id });
      window.location.assign(link);
    } catch (error) {
      showToast(error.response?.data?.detail || "Couldn't start the payment. Please try again.", { type: "error" });
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-surface p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label.title}</p>
      <p className="mt-1 text-2xl font-extrabold text-slate-900">{formatMoney(quote.amount, quote.currency)}</p>
      <button
        type="button"
        onClick={handlePay}
        disabled={submitting}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
      >
        <CreditCard className="h-4 w-4" aria-hidden="true" />
        {submitting ? "Opening secure checkout…" : user ? label.action : "Log in to pay"}
      </button>
      <p className="mt-2 flex items-center justify-center gap-1 text-xs text-slate-500">
        <Lock className="h-3 w-3" aria-hidden="true" /> Secure payment by Flutterwave
      </p>
    </div>
  );
}
