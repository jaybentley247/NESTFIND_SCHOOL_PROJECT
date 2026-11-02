import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ListChecks, Compass, MessageCircle, Building2, Home as HomeIcon, Warehouse, Layers, Trees } from "lucide-react";
import FeaturedCarousel from "../components/property/FeaturedCarousel";
import PropertyTypeCard from "../components/property/PropertyTypeCard";
import ErrorState from "../components/ui/ErrorState";
import PropertyCardSkeleton from "../components/property/PropertyCardSkeleton";
import { useProperties } from "../hooks/useProperties";
import { TYPES, typeLabel } from "../utils/propertyTypes";

const steps = [
  { icon: ListChecks, title: "List", body: "Hosts create a listing with photos, price, and location in minutes." },
  { icon: Compass, title: "Discover", body: "Buyers and tenants search and filter listings that match their needs." },
  { icon: MessageCircle, title: "Connect", body: "Send an enquiry directly to the host and arrange a viewing." },
];

const propertyTypes = [
  { type: "apartment", label: "Apartments", icon: Building2 },
  { type: "house", label: "Houses", icon: HomeIcon },
  { type: "studio", label: "Studios", icon: Warehouse },
  { type: "duplex", label: "Duplexes", icon: Layers },
  { type: "land", label: "Land", icon: Trees },
];

// Decorative — not backed by a dedicated endpoint (PRD section 6 doesn't
// list one for city summaries), so this stays a static shortcut into the
// real, filterable Listings page rather than faking aggregate counts.
// Photos are real landmarks for each city, sourced from Wikimedia Commons
// (freely licensed) rather than random placeholder images.
const popularCities = [
  {
    city: "Lagos",
    landmark: "Lekki-Ikoyi Link Bridge",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Lekki_ikoyi_link_bridge.jpg/960px-Lekki_ikoyi_link_bridge.jpg",
  },
  {
    city: "Abuja",
    landmark: "Aso Rock",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Aso_Rock_%2C_Abuja.jpg/960px-Aso_Rock_%2C_Abuja.jpg",
  },
  {
    city: "Port Harcourt",
    landmark: "Port Harcourt Tower",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/The_Port_Harcourt_Tower.jpg/960px-The_Port_Harcourt_Tower.jpg",
  },
  {
    city: "Ibadan",
    landmark: "Cocoa House",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Cocoa_House_in_ibadan_city.jpg/960px-Cocoa_House_in_ibadan_city.jpg",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [listingType, setListingType] = useState("");

  const { results: featured, isLoading, isError, refetch } = useProperties({ featured: "true" });

  function handleSearch(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("city", location);
    if (type) params.set("type", type);
    if (listingType) params.set("listing_type", listingType);
    navigate(`/listings${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900">
        {/* Deliberately eager, not lazy — this is the largest above-the-fold
            element (LCP), so lazy-loading it would delay first paint. Every
            other image in the app uses loading="lazy" per the PRD checklist;
            this is the one justified exception. */}
        <img
          src="https://www.image2url.com/r2/default/images/1784844337400-68c79401-2374-4a6a-8d8e-5af94fe9f469.png"
          alt="Modern home exterior"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/10" />

        <div className="relative mx-auto max-w-7xl px-4 pb-32 pt-24 text-center sm:px-6 lg:px-8">
          <p
            className="bg-[length:200%_auto] bg-gradient-to-r from-[#FF0000] via-[#FF5555] to-[#FF0000] bg-clip-text text-2xl font-extrabold uppercase tracking-[0.2em] text-transparent animate-flow sm:text-3xl"
          >
            Welcome to NestFind
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Find your next home, faster.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-200">
            Search apartments, houses, and short-lets across Nigeria — list, discover, connect.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/listings")}
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Browse Listings
            </button>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              List Your Property
            </button>
          </div>
        </div>

        {/* Search card, overlapping the hero's bottom edge */}
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <form
            onSubmit={handleSearch}
            className="-mt-16 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/5 sm:flex-row sm:items-center"
          >
            <input
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="City, e.g. Lagos"
              className="flex-1 rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              aria-label="Search by city"
            />
            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              aria-label="Property type"
            >
              <option value="">Any type</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {typeLabel(t)}
                </option>
              ))}
            </select>
            <select
              value={listingType}
              onChange={(event) => setListingType(event.target.value)}
              className="rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              aria-label="Rent or sale"
            >
              <option value="">Rent or Sale</option>
              <option value="rent">For Rent</option>
              <option value="sale">For Sale</option>
              <option value="shortlet">Short-let</option>
            </select>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Property Types */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-20 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">Property Types</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Explore by Property Type</h2>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {propertyTypes.map((item) => (
            <PropertyTypeCard key={item.type} {...item} />
          ))}
        </div>
      </section>

      {/* Featured listings */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">Properties</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Featured Listings</h2>

          <div className="mt-10 text-left">
            {isError ? (
              <ErrorState message="Couldn't load featured listings." onRetry={refetch} />
            ) : isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <FeaturedCarousel properties={featured} />
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-slate-900">How It Works</h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {steps.map(({ icon: Icon, title, body }) => (
              <div key={title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular cities */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900">Popular Cities</h2>
        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {popularCities.map(({ city, landmark, image }) => (
            <button
              key={city}
              type="button"
              onClick={() => navigate(`/listings?city=${encodeURIComponent(city)}`)}
              className="group relative overflow-hidden rounded-xl"
            >
              <img
                src={image}
                alt={landmark}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 text-left text-white">
                <p className="font-semibold">{city}</p>
                <p className="text-xs text-white/80">{landmark}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
