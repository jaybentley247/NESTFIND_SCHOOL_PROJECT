import { Link } from "react-router-dom";
import { BedDouble, Bath, MapPin, Heart } from "lucide-react";
import { formatPrice } from "../../utils/formatPrice";
import { useSaved } from "../../context/SavedContext";
import { useAuth } from "../../hooks/useAuth";

export default function PropertyCard({ property }) {
  const {
    id,
    title,
    city,
    state,
    price,
    billing_period: billingPeriod,
    listing_type: listingType,
    bedrooms,
    bathrooms,
    cover_image: coverImage,
  } = property;

  const { user } = useAuth();
  const { isSaved, toggleSave } = useSaved();
  const saved = isSaved(id);

  function handleSaveClick(event) {
    event.preventDefault();
    event.stopPropagation();
    toggleSave(id);
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {user && (
        <button
          type="button"
          onClick={handleSaveClick}
          aria-label={saved ? "Remove from saved properties" : "Save property"}
          aria-pressed={saved}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow hover:text-error"
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-error text-error" : ""}`} aria-hidden="true" />
        </button>
      )}

      <Link to={`/listings/${id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={coverImage}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold capitalize text-slate-800 shadow">
            For {listingType}
          </span>
        </div>

        <div className="p-4">
          <p className="text-lg font-bold text-slate-900">
            {formatPrice(price, { billingPeriod })}
          </p>
          <h3 className="mt-1 truncate text-sm font-medium text-slate-800">{title}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {city}, {state}
          </p>

          <div className="mt-3 flex items-center gap-4 border-t border-slate-100 pt-3 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <BedDouble className="h-4 w-4" aria-hidden="true" /> {bedrooms} bed
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" aria-hidden="true" /> {bathrooms} bath
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
