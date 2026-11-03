import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Clock, Home as HomeIcon } from "lucide-react";
import { getHosts } from "../api/users";
import Pagination from "../components/ui/Pagination";
import Skeleton from "../components/ui/Skeleton";
import ErrorState from "../components/ui/ErrorState";

const PAGE_SIZE = 12;

function HostCard({ host }) {
  return (
    <article className="flex flex-col items-center rounded-xl border border-slate-200 bg-surface p-6 text-center">
      {host.avatar ? (
        <img src={host.avatar} alt={host.full_name} loading="lazy" className="h-20 w-20 rounded-full object-cover" />
      ) : (
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-strong">
          {host.full_name[0]?.toUpperCase()}
        </span>
      )}

      <h2 className="mt-4 font-semibold text-slate-900">{host.full_name}</h2>
      {host.bio && <p className="mt-2 line-clamp-2 text-sm text-slate-600">{host.bio}</p>}

      <div className="mt-4 flex flex-col items-center gap-1 text-xs text-slate-500">
        <p className="flex items-center gap-1">
          <HomeIcon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          {host.total_listings} active listing{host.total_listings === 1 ? "" : "s"}
        </p>
        <p className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          {host.average_response_time ? `Average response: ${host.average_response_time}` : "No response data yet"}
        </p>
      </div>

      <Link
        to={`/hosts/${host.id}`}
        className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
      >
        View Profile
      </Link>
    </article>
  );
}

export default function Hosts() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["hosts", page],
    queryFn: () => getHosts(page),
  });

  const hosts = data?.results ?? [];
  const count = data?.count ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900">Find a Host</h1>
      <p className="mt-1 text-sm text-slate-500">Browse hosts with active listings and see what each one offers.</p>

      {isError ? (
        <div className="mt-6">
          <ErrorState message="Couldn't load hosts." onRetry={refetch} />
        </div>
      ) : isLoading ? (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full" />
          ))}
        </div>
      ) : hosts.length === 0 ? (
        <p className="mt-16 text-center text-sm text-slate-500">No hosts have active listings right now.</p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hosts.map((host) => (
              <HostCard key={host.id} host={host} />
            ))}
          </div>
          <Pagination page={page} totalPages={Math.ceil(count / PAGE_SIZE)} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
