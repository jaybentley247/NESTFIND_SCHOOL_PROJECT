import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { formatDate } from "../../utils/formatDate";

export default function HostCard({ host, listingCount, onContact }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <img
          src={host.avatar}
          alt={host.name}
          loading="lazy"
          className="h-14 w-14 rounded-full object-cover"
        />
        <div>
          <Link to={`/hosts/${host.id}`} className="font-semibold text-slate-900 hover:text-primary">
            {host.name}
          </Link>
          <p className="text-xs text-slate-500">Member since {formatDate(host.member_since)}</p>
          <p className="text-xs text-slate-500">{listingCount} active listing{listingCount === 1 ? "" : "s"}</p>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">{host.response_time}</p>

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
