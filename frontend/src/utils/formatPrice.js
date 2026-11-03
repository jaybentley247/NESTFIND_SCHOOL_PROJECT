export function formatPrice(amount, { billingPeriod } = {}) {
  const formatted = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

  return billingPeriod ? `${formatted}/${billingPeriod === "yearly" ? "yr" : "mo"}` : formatted;
}

// Exact payment amounts: keeps kobo when there is any (e.g. a 10% deposit)
// and supports currencies other than Naira.
export function formatMoney(amount, currency = "NGN") {
  const digits = Number(amount) % 1 === 0 ? 0 : 2;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
