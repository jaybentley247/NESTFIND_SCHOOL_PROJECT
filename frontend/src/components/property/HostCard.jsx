import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { formatDate } from "../../utils/formatDate";

export default function HostCard({ host, listingCount, onContact }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-surface p-5">
      <div className="flex items-center gap-3">
        {host.avatar ? (
          <img src={host.avatar} alt={host.full_name} loading="lazy" className="h-14 w-14 rounded-full object-cover" />
        ) : (
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-strong">
            {host.full_name?.[0]?.toUpperCase()}
          </span>
        )}
        <div>
          <Link to={`/hosts/${host.id}`} className="font-semibold text-slate-900 hover:text-primary">
            {host.full_name}
          </Link>
          <p className="text-xs text-slate-500">Member since {formatDate(host.created_at)}</p>
          <p className="text-xs text-slate-500">{listingCount} active listing{listingCount === 1 ? "" : "s"}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onContact}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        Contact Agent
      </button>
    </div>
  );
}
