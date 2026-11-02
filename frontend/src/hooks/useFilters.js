import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

// Keeps filter state in the URL (PRD section 8: "Search filters — URL
// query params, forwarded to DRF as query params") so listing links stay
// shareable. setFilter updates one key and resets pagination to page 1
// whenever a filter (not the page itself) changes.
export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);

  const setFilter = useCallback(
    (key, value) => {
      const next = new URLSearchParams(searchParams);
      if (value === "" || value === undefined || value === null) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      if (key !== "page") next.delete("page");
      setSearchParams(next);
    },
    [searchParams, setSearchParams],
  );

  const clearFilters = useCallback(() => setSearchParams({}), [setSearchParams]);

  return { filters, setFilter, clearFilters };
}
