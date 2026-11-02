// Turns a filters object into a DRF-compatible query string, dropping
// empty/undefined values so the URL only carries filters actually in use.
export function buildQueryString(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      if (value.length) params.set(key, value.join(","));
      return;
    }
    params.set(key, value);
  });

  return params.toString();
}
