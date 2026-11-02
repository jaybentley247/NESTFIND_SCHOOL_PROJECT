import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { BedDouble, Bath, Ruler, SquareParking, Layers, MapPin, Eye, Heart } from "lucide-react";
import ImageCarousel from "../components/property/ImageCarousel";
import AmenitiesList from "../components/property/AmenitiesList";
import HostCard from "../components/property/HostCard";
import EnquiryModal from "../components/property/EnquiryModal";
import PropertyCard from "../components/property/PropertyCard";
import Skeleton from "../components/ui/Skeleton";
import ErrorState from "../components/ui/ErrorState";
import MapView from "../components/map/MapView";
import NotFound from "./NotFound";
import { useProperty, useSimilarProperties, useProperties } from "../hooks/useProperties";
import { incrementView } from "../api/properties";
import { useSaved } from "../context/SavedContext";
import { useAuth } from "../hooks/useAuth";
import { formatPrice } from "../utils/formatPrice";
import { formatDate } from "../utils/formatDate";

const DESCRIPTION_LIMIT = 220;

export default function PropertyDetail() {
  const { id } = useParams();
  const { data: property, isLoading, isError, error, refetch } = useProperty(id);
  const { data: similar = [] } = useSimilarProperties(property?.id);
  const { count: hostListingCount } = useProperties(
    property ? { host: property.host.id, status: "active", page_size: 1 } : {},
  );

  const { user } = useAuth();
  const { isSaved, toggleSave } = useSaved();

  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const viewTrackedRef = useRef(null);

  useEffect(() => {
    if (!property || viewTrackedRef.current === property.id) return;
    viewTrackedRef.current = property.id;
    incrementView(property.id).catch(() => {});
  }, [property]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="aspect-[16/10] w-full rounded-xl" />
        <div className="mt-8 space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    if (error?.response?.status === 404) return <NotFound />;
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <ErrorState message="Couldn't load this property." onRetry={refetch} />
      </div>
    );
  }

  const isLongDescription = property.description.length > DESCRIPTION_LIMIT;
  const shownDescription =
    expanded || !isLongDescription ? property.description : `${property.description.slice(0, DESCRIPTION_LIMIT)}…`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ImageCarousel images={property.images.map((img) => img.image)} alt={property.title} />

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          {/* Property Header */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold capitalize text-primary-700">
                For {property.listing_type === "shortlet" ? "Short-let" : property.listing_type}
              </span>
              <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{property.title}</h1>
              <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {property.city}, {property.state}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-slate-900">
                {formatPrice(property.price, { billingPeriod: property.billing_period })}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Posted {formatDate(property.created_at)} · <Eye className="inline h-3.5 w-3.5" /> {property.views} views
              </p>
              {user && (
                <button
                  type="button"
                  onClick={() => toggleSave(property.id)}
                  aria-pressed={isSaved(property.id)}
                  className={`mt-2 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    isSaved(property.id)
                      ? "border-error/30 bg-red-50 text-error"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <Heart className={`h-3.5 w-3.5 ${isSaved(property.id) ? "fill-error" : ""}`} aria-hidden="true" />
                  {isSaved(property.id) ? "Saved" : "Save"}
                </button>
              )}
            </div>
          </div>

          {/* Key Details Bar */}
          <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-5">
            <KeyDetail icon={BedDouble} label="Bedrooms" value={property.bedrooms} />
            <KeyDetail icon={Bath} label="Bathrooms" value={property.bathrooms} />
            <KeyDetail icon={Ruler} label="Area" value={`${property.area} sqm`} />
            <KeyDetail icon={SquareParking} label="Parking" value={property.parking} />
            <KeyDetail icon={Layers} label="Floor" value={property.floor ?? "—"} />
          </div>

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-slate-900">Description</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">{shownDescription}</p>
            {isLongDescription && (
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="mt-1 text-sm font-medium text-primary hover:underline"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          {/* Amenities */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-slate-900">Amenities</h2>
            <div className="mt-3">
              <AmenitiesList amenities={property.amenities} />
            </div>
          </div>

          {/* Location Map */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-slate-900">Location</h2>
            <div className="mt-3 h-80">
              <MapView properties={[property]} />
            </div>
          </div>
        </div>

        {/* Host / Agent Card */}
        <div>
          <HostCard host={property.host} listingCount={hostListingCount} onContact={() => setEnquiryOpen(true)} />
        </div>
      </div>

      {/* Similar Properties */}
      {similar.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-slate-900">Similar Properties</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      )}

      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} property={property} />
    </div>
  );
}

function KeyDetail({ icon: Icon, label, value }) {
  return (
    <div className="text-center">
      <Icon className="mx-auto h-5 w-5 text-primary" aria-hidden="true" />
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
