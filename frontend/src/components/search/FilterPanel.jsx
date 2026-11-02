import { TYPES, LISTING_TYPES, typeLabel, listingTypeLabel } from "../../utils/propertyTypes";
import { AMENITIES } from "../../utils/amenities";
import { NIGERIA_CITIES } from "../../utils/nigeriaLocations";
import DebouncedInput from "../ui/DebouncedInput";

function Field({ label, children }) {
  return (
    <div className="border-b border-slate-100 py-4 first:pt-0 last:border-0">
      <label className="text-sm font-semibold text-slate-800">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

const selectClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

export default function FilterPanel({ filters, setFilter, clearFilters }) {
  const activeAmenities = filters.amenities ? filters.amenities.split(",") : [];

  function toggleAmenity(amenity) {
    const next = activeAmenities.includes(amenity)
      ? activeAmenities.filter((a) => a !== amenity)
      : [...activeAmenities, amenity];
    setFilter("amenities", next.join(","));
  }

  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">Filters</h2>
        <button
          type="button"
          onClick={clearFilters}
          className="text-xs font-medium text-primary hover:underline"
        >
          Clear all
        </button>
      </div>

      <Field label="City">
        <select value={filters.city || ""} onChange={(e) => setFilter("city", e.target.value)} className={selectClass}>
          <option value="">Any city</option>
          {NIGERIA_CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Property Type">
        <select value={filters.type || ""} onChange={(e) => setFilter("type", e.target.value)} className={selectClass}>
          <option value="">Any type</option>
          {TYPES.map((t) => (
            <option key={t} value={t} className="capitalize">
              {typeLabel(t)}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Listing Type">
        <select
          value={filters.listing_type || ""}
          onChange={(e) => setFilter("listing_type", e.target.value)}
          className={selectClass}
        >
          <option value="">Any</option>
          {LISTING_TYPES.map((t) => (
            <option key={t} value={t}>
              {listingTypeLabel(t)}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Price Range (₦)">
        <div className="flex items-center gap-2">
          <DebouncedInput
            type="number"
            min="0"
            value={filters.min_price || ""}
            onChange={(value) => setFilter("min_price", value)}
            placeholder="Min"
            className={selectClass}
          />
          <span className="text-slate-400">–</span>
          <DebouncedInput
            type="number"
            min="0"
            value={filters.max_price || ""}
            onChange={(value) => setFilter("max_price", value)}
            placeholder="Max"
            className={selectClass}
          />
        </div>
      </Field>

      <Field label="Bedrooms (min)">
        <select value={filters.bedrooms || ""} onChange={(e) => setFilter("bedrooms", e.target.value)} className={selectClass}>
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </select>
      </Field>

      <Field label="Bathrooms (min)">
        <select
          value={filters.bathrooms || ""}
          onChange={(e) => setFilter("bathrooms", e.target.value)}
          className={selectClass}
        >
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </select>
      </Field>

      <Field label="Amenities">
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map(({ key, label }) => {
            const active = activeAmenities.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleAmenity(key)}
                aria-pressed={active}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  active
                    ? "border-primary bg-primary-50 text-primary-700"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </Field>
    </aside>
  );
}
