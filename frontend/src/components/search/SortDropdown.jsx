const OPTIONS = [
  { value: "-created_at", label: "Newest first" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
  { value: "-views", label: "Most Viewed" },
];

export default function SortDropdown({ value, onChange }) {
  return (
    <select
      value={value || "-created_at"}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Sort listings"
      className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
