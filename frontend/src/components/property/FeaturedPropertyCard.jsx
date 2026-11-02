import { Link } from "react-router-dom";
import { BedDouble, Bath, Ruler, SquareParking, MapPin, Heart } from "lucide-react";
import { formatPrice } from "../../utils/formatPrice";
import { useSaved } from "../../context/SavedContext";
import { useAuth } from "../../hooks/useAuth";

export default function FeaturedPropertyCard({ property }) {
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
    area,
    parking,
    cover_image: coverImage,
  } = property;

  const { user } = useAuth();
  const { isSaved, toggleSave } = useSaved();
  const saved = isSaved(id);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img src={coverImage} alt={title} loading="lazy" className="h-full w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold capitalize text-white shadow">
          {listingType === "shortlet" ? "Short-let" : listingType}
        </span>
        {user && (
          <button
            type="button"
            onClick={() => toggleSave(id)}
            aria-label={saved ? "Remove from saved properties" : "Save property"}
            aria-pressed={saved}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow hover:text-error"
          >
            <Heart className={`h-4 w-4 ${saved ? "fill-error text-error" : ""}`} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="truncate text-base font-bold text-slate-900">{title}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {city}, {state}
        </p>

        <div className="mt-3 flex items-center gap-3 border-y border-slate-100 py-3 text-xs text-slate-600">
          <span className="flex items-center gap-1">
            <BedDouble className="h-4 w-4" aria-hidden="true" /> {bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4" aria-hidden="true" /> {bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Ruler className="h-4 w-4" aria-hidden="true" /> {area}sqm
          </span>
          <span className="flex items-center gap-1">
            <SquareParking className="h-4 w-4" aria-hidden="true" /> {parking}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-base font-extrabold text-slate-900">
            {formatPrice(price, { billingPeriod })}
          </p>
          <Link
            to={`/listings/${id}`}
            className="shrink-0 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-700"
          >
            View Property
          </Link>
        </div>
      </div>
    </div>
  );
}
