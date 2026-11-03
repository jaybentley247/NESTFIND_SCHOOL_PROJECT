import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, Home as HomeIcon } from "lucide-react";
import { getUser } from "../api/users";
import { useProperties } from "../hooks/useProperties";
import PropertyCard from "../components/property/PropertyCard";
import PropertyCardSkeleton from "../components/property/PropertyCardSkeleton";
import Skeleton from "../components/ui/Skeleton";
import ErrorState from "../components/ui/ErrorState";
import NotFound from "./NotFound";
import { formatDate } from "../utils/formatDate";

// PRD page 10: profile photo, name, bio, member since date, total
// listings, average response time (GET /api/users/{id}/), plus a grid of
// their active listings (GET /api/properties/?host={id}&status=active).
export default function HostProfile() {
  const { id } = useParams();

  const { data: host, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
  });

  const { results: listings, count, isLoading: listingsLoading } = useProperties({
    host: id,
    status: "active",
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError) {
    if (error?.response?.status === 404) return <NotFound />;
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <ErrorState message="Couldn't load this host's profile." onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-surface p-6 text-center sm:flex-row sm:text-left">
        {host.avatar ? (
          <img src={host.avatar} alt={host.full_name} loading="lazy" className="h-20 w-20 rounded-full object-cover" />
        ) : (
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-strong">
            {host.full_name[0]?.toUpperCase()}
          </span>
        )}

        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900">{host.full_name}</h1>
          <p className="mt-1 flex items-center justify-center gap-1 text-xs text-slate-500 sm:justify-start">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            Member since {formatDate(host.created_at)}
          </p>
          {host.bio && <p className="mt-2 text-sm text-slate-600">{host.bio}</p>}
        </div>

        <div className="flex gap-6 border-t border-slate-100 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
          <div className="text-center">
            <p className="flex items-center justify-center gap-1 text-lg font-bold text-slate-900">
              <HomeIcon className="h-4 w-4 text-primary" aria-hidden="true" />
              {host.total_listings}
            </p>
            <p className="text-xs text-slate-500">Listings</p>
          </div>
          <div className="text-center">
            <p className="flex items-center justify-center gap-1 text-lg font-bold text-slate-900">
              <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
            </p>
            <p className="text-xs text-slate-500">{host.average_response_time ?? "No data yet"}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-900">Active Listings ({count})</h2>
        {listingsLoading ? (
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">This host has no active listings right now.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
