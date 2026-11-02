export function formatDate(isoString) {
  if (!isoString) return "";
  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(isoString));
}
