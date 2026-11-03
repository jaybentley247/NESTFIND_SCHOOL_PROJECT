import { Link } from "react-router-dom";
import { useProperties } from "../../hooks/useProperties";

export default function PropertyTypeCard({ type, label, icon: Icon }) {
  const { count, isLoading } = useProperties({ type, status: "active", page_size: 1 });

  return (
    <Link
      to={`/listings?type=${type}`}
      className="group flex flex-col items-center rounded-xl border border-slate-200 bg-surface px-4 py-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white transition-colors group-hover:bg-primary-700">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <p className="mt-4 text-sm font-semibold text-slate-900">{label}</p>
      <p className="mt-1 text-xs text-slate-500">{isLoading ? "…" : `${count} ${count === 1 ? "Property" : "Properties"}`}</p>
    </Link>
  );
}
