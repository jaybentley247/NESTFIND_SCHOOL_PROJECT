export function formatPrice(amount, { billingPeriod } = {}) {
  const formatted = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

  return billingPeriod ? `${formatted}/${billingPeriod === "yearly" ? "yr" : "mo"}` : formatted;
}
