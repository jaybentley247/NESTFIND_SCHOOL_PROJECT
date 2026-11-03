import { useState } from "react";
import { LayoutGrid, Map as MapIcon } from "lucide-react";
import FilterPanel from "../components/search/FilterPanel";
import SortDropdown from "../components/search/SortDropdown";
import Pagination from "../components/ui/Pagination";
import PropertyCard from "../components/property/PropertyCard";
import PropertyCardSkeleton from "../components/property/PropertyCardSkeleton";
import ErrorState from "../components/ui/ErrorState";
import MapView from "../components/map/MapView";
import { useFilters } from "../hooks/useFilters";
import { useProperties } from "../hooks/useProperties";

export default function Listings() {
  const { filters, setFilter, clearFilters } = useFilters();
  const { results, count, page, totalPages, isLoading, isError, refetch } = useProperties(filters);
  const [view, setView] = useState("grid");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <FilterPanel filters={filters} setFilter={setFilter} clearFilters={clearFilters} />

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{count}</span> listing{count === 1 ? "" : "s"} found
            </p>

            <div className="flex items-center gap-3">
              <SortDropdown value={filters.ordering} onChange={(v) => setFilter("ordering", v)} />

              <div className="flex overflow-hidden rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  aria-pressed={view === "grid"}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium ${
                    view === "grid" ? "bg-primary text-white" : "bg-surface text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" /> Grid
                </button>
                <button
                  type="button"
                  onClick={() => setView("map")}
                  aria-pressed={view === "map"}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium ${
                    view === "map" ? "bg-primary text-white" : "bg-surface text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <MapIcon className="h-4 w-4" /> Map
                </button>
              </div>
            </div>
          </div>

          {isError ? (
            <div className="mt-6">
              <ErrorState message="Couldn't load listings." onRetry={refetch} />
            </div>
          ) : isLoading ? (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="mt-16 flex flex-col items-center text-center">
              <p className="text-lg font-semibold text-slate-900">No listings match your filters</p>
              <p className="mt-1 text-sm text-slate-500">Try widening your price range or clearing a filter.</p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
              >
                Clear filters
              </button>
            </div>
          ) : view === "grid" ? (
            <>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onPageChange={(p) => setFilter("page", p)} />
            </>
          ) : (
            <div className="mt-6 h-[600px]">
              <MapView properties={results} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
