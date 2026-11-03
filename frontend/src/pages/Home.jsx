import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ListChecks, Compass, MessageCircle, Building2, Home as HomeIcon, Warehouse, Layers, Trees } from "lucide-react";
import FeaturedCarousel from "../components/property/FeaturedCarousel";
import PropertyTypeCard from "../components/property/PropertyTypeCard";
import ErrorState from "../components/ui/ErrorState";
import PropertyCardSkeleton from "../components/property/PropertyCardSkeleton";
import { useProperties } from "../hooks/useProperties";
import { TYPES, typeLabel } from "../utils/propertyTypes";
import { NIGERIA_CITIES } from "../utils/nigeriaLocations";

const steps = [
  {
    icon: ListChecks,
    title: "List",
    body: "Hosts create a listing with photos, price, and location in minutes.",
    image: "/how-it-works/list.jpg",
    alt: "Hands holding a smartphone to photograph a furnished living room",
  },
  {
    icon: Compass,
    title: "Discover",
    body: "Buyers and tenants search and filter listings that match their needs.",
    image: "/how-it-works/discover.jpg",
    alt: "Smiling couple on a sofa searching for a home on a laptop",
  },
  {
    icon: MessageCircle,
    title: "Connect",
    body: "Send an enquiry directly to the host and arrange a viewing.",
    image: "/how-it-works/connect.jpg",
    alt: "Host opening the front door to welcome a visitor to a property viewing",
  },
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

// Covers short-lets at the low end through to sale prices at the high end.
const maxPriceOptions = [
  100000, 500000, 1000000, 2000000, 5000000, 10000000, 25000000, 50000000, 100000000, 200000000, 500000000,
];

const searchSelectClass =
  "mt-1 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

function SearchField({ label, children }) {
  return (
    <label className="block text-left">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [type, setType] = useState("");
  const [listingType, setListingType] = useState("");

  const { results: featured, isLoading, isError, refetch } = useProperties({ featured: "true" });

  function handleSearch(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("city", location);
    if (maxPrice) params.set("max_price", maxPrice);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (type) params.set("type", type);
    if (listingType) params.set("listing_type", listingType);
    navigate(`/listings${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-900">
        {/* Background video: muted + playsInline so browsers allow autoplay,
            including on phones. The poster is the previous hero photo, shown
            straight away while the video loads, or instead of it if it can't
            play. Decorative, so hidden from screen readers. */}
        <video
          src="https://videotourl.com/videos/1793716553783-dbe1dabd-0d2c-42f1-8c2d-95c023c3dd74.mp4"
          poster="https://www.image2url.com/r2/default/images/1784844337400-68c79401-2374-4a6a-8d8e-5af94fe9f469.png"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/40 to-ink-900/10" />

        <div className="relative mx-auto max-w-7xl px-4 pb-32 pt-24 text-center sm:px-6 lg:px-8">
          <p
            className="bg-[length:200%_auto] bg-gradient-to-r from-[#FF0000] via-[#FF5555] to-[#FF0000] bg-clip-text text-2xl font-extrabold uppercase tracking-[0.2em] text-transparent animate-flow sm:text-3xl"
          >
            Welcome to NestFind
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Find your next home, faster.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-200">
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
            className="-mt-16 grid grid-cols-1 items-end gap-3 rounded-2xl bg-surface p-4 shadow-2xl ring-1 ring-black/5 sm:grid-cols-3 lg:grid-cols-6"
          >
            <SearchField label="City">
              <select value={location} onChange={(event) => setLocation(event.target.value)} className={searchSelectClass}>
                <option value="">All cities</option>
                {NIGERIA_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </SearchField>
            <SearchField label="Max Price">
              <select value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} className={searchSelectClass}>
                <option value="">Any price</option>
                {maxPriceOptions.map((price) => (
                  <option key={price} value={price}>
                    ₦{price.toLocaleString()}
                  </option>
                ))}
              </select>
            </SearchField>
            <SearchField label="Bedrooms">
              <select value={bedrooms} onChange={(event) => setBedrooms(event.target.value)} className={searchSelectClass}>
                <option value="">Any beds</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}+ {n === 1 ? "bedroom" : "bedrooms"}
                  </option>
                ))}
              </select>
            </SearchField>
            <SearchField label="Property Type">
              <select value={type} onChange={(event) => setType(event.target.value)} className={searchSelectClass}>
                <option value="">Any type</option>
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {typeLabel(t)}
                  </option>
                ))}
              </select>
            </SearchField>
            <SearchField label="Rent or Sale">
              <select value={listingType} onChange={(event) => setListingType(event.target.value)} className={searchSelectClass}>
                <option value="">Any</option>
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
                <option value="shortlet">Short-let</option>
              </select>
            </SearchField>
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
            {steps.map(({ icon: Icon, title, body, image, alt }) => (
              <div key={title} className="text-center">
                <img src={image} alt={alt} loading="lazy" className="aspect-[4/3] w-full rounded-xl object-cover" />
                <div className="relative mx-auto -mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-strong ring-4 ring-surface">
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
