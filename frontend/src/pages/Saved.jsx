import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HeartOff } from "lucide-react";
import { listSaved, unsaveProperty } from "../api/saved";
import PropertyCard from "../components/property/PropertyCard";
import PropertyCardSkeleton from "../components/property/PropertyCardSkeleton";
import ErrorState from "../components/ui/ErrorState";
import Pagination from "../components/ui/Pagination";
import { useToast } from "../context/ToastContext";

const PAGE_SIZE = 12;

// PRD page 6: grid of saved properties from GET /api/saved/, scoped to the
// authenticated user via the JWT; DELETE /api/saved/{id}/ to unsave.
export default function Saved() {
  const [page, setPage] = useState(1);
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["saved", "page", page],
    queryFn: () => listSaved({ page }),
  });

  const unsaveMutation = useMutation({
    mutationFn: unsaveProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved"] });
      showToast("Removed from saved properties.");
    },
    onError: () => showToast("Couldn't remove this saved property.", { type: "error" }),
  });

  const results = data?.results ?? [];
  const totalPages = data ? Math.max(1, Math.ceil(data.count / PAGE_SIZE)) : 1;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900">Saved Properties</h1>

      {isError ? (
        <div className="mt-6">
          <ErrorState message="Couldn't load your saved properties." onRetry={refetch} />
        </div>
      ) : isLoading ? (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <HeartOff className="h-8 w-8" aria-hidden="true" />
          </div>
          <p className="mt-4 text-lg font-semibold text-slate-900">No saved properties yet</p>
          <p className="mt-1 text-sm text-slate-500">Tap the heart on any listing to save it here for later.</p>
          <Link
            to="/listings"
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Browse Listings
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((entry) => (
              <div key={entry.id} className="relative">
                <PropertyCard property={entry.property_detail} />
                <button
                  type="button"
                  onClick={() => unsaveMutation.mutate(entry.id)}
                  className="mt-2 w-full rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
