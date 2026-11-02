import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";

export default function MapPopup({ property }) {
  return (
    <Link to={`/listings/${property.id}`} className="block w-40">
      <img
        src={property.cover_image}
        alt={property.title}
        loading="lazy"
        className="h-20 w-full rounded-t object-cover"
      />
      <div className="p-1.5">
        <p className="text-sm font-bold text-slate-900">
          {formatPrice(property.price, { billingPeriod: property.billing_period })}
        </p>
        <p className="truncate text-xs text-slate-600">{property.title}</p>
      </div>
    </Link>
  );
}
