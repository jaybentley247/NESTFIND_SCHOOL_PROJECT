import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { listProperties, getProperty, getSimilarProperties } from "../api/properties";

const PAGE_SIZE = 12; // matches backend's core.pagination.StandardResultsPagination

// Filters map straight onto DRF query params (PRD section 3.1's example
// query: city, type, listing_type, min_price, max_price, bedrooms,
// amenities, ordering, page). keepPreviousData avoids a loading flash
// between pages/filter changes — the grid keeps showing the old results
// until the new page resolves.
export function useProperties(filters) {
  const query = useQuery({
    queryKey: ["properties", filters],
    queryFn: () => listProperties(filters),
    placeholderData: keepPreviousData,
  });

  const page = Number(filters.page) || 1;
  const totalPages = query.data ? Math.max(1, Math.ceil(query.data.count / PAGE_SIZE)) : 1;

  return {
    results: query.data?.results ?? [],
    count: query.data?.count ?? 0,
    page,
    totalPages,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useProperty(id) {
  return useQuery({
    queryKey: ["property", id],
    queryFn: () => getProperty(id),
    enabled: Boolean(id),
  });
}

export function useSimilarProperties(id) {
  return useQuery({
    queryKey: ["similar-properties", id],
    queryFn: () => getSimilarProperties(id),
    enabled: Boolean(id),
  });
}
