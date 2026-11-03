import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import StepIndicator from "../components/forms/StepIndicator";
import ImageUploader from "../components/forms/ImageUploader";
import LocationPicker from "../components/map/LocationPicker";
import Skeleton from "../components/ui/Skeleton";
import { AMENITIES } from "../utils/amenities";
import { TYPES, LISTING_TYPES, typeLabel, listingTypeLabel } from "../utils/propertyTypes";
import { useProperty } from "../hooks/useProperties";
import { createProperty, updateProperty, addPropertyImage, deletePropertyImage } from "../api/properties";
import { useToast } from "../context/ToastContext";
import { applyServerErrors } from "../utils/apiErrors";

const STEPS = ["Basic Info", "Details", "Location", "Amenities", "Photos", "Review"];

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

const initialState = {
  title: "",
  type: "apartment",
  listing_type: "rent",
  price: "",
  billing_period: "",
  bedrooms: 1,
  bathrooms: 1,
  area: "",
  parking: 0,
  floor: "",
  description: "",
  city: "",
  state: "",
  latitude: null,
  longitude: null,
  amenities: [],
  images: [],
  existingImages: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "TOGGLE_AMENITY": {
      const has = state.amenities.includes(action.key);
      return {
        ...state,
        amenities: has ? state.amenities.filter((a) => a !== action.key) : [...state.amenities, action.key],
      };
    }
    case "SET_LOCATION":
      // Leaflet's click event gives full float precision; the backend's
      // DecimalField(max_digits=9, decimal_places=6) rejects anything with
      // more than 6 decimal places, so round at the source.
      return {
        ...state,
        latitude: Number(action.latitude.toFixed(6)),
        longitude: Number(action.longitude.toFixed(6)),
      };
    case "ADD_IMAGES":
      return {
        ...state,
        images: [
          ...state.images,
          ...action.files.map((file) => ({
            key: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
            file,
            previewUrl: URL.createObjectURL(file),
          })),
        ],
      };
    case "REMOVE_IMAGE":
      return { ...state, images: state.images.filter((img) => img.key !== action.key) };
    case "REMOVE_EXISTING_IMAGE":
      return { ...state, existingImages: state.existingImages.filter((img) => img.id !== action.id) };
    case "HYDRATE":
      return { ...state, ...action.data };
    default:
      return state;
  }
}

function validateStep(step, state) {
  const errors = {};
  if (step === 1 && !state.title.trim()) errors.title = "Title is required";
  if (step === 2) {
    if (!state.price || Number(state.price) <= 0) errors.price = "Enter a valid price";
    if (state.area === "" || Number(state.area) <= 0) errors.area = "Enter a valid area";
  }
  if (step === 3) {
    if (!state.city.trim()) errors.city = "City is required";
    if (!state.state.trim()) errors.state = "State is required";
    if (state.latitude == null || state.longitude == null) errors.location = "Click the map to set the location";
  }
  return errors;
}

export default function AddEditListing() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [state, dispatch] = useReducer(reducer, initialState);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { data: existingProperty, isLoading: loadingExisting } = useProperty(isEdit ? id : undefined);

  useEffect(() => {
    if (!existingProperty) return;
    dispatch({
      type: "HYDRATE",
      data: {
        title: existingProperty.title,
        type: existingProperty.type,
        listing_type: existingProperty.listing_type,
        price: String(existingProperty.price),
        billing_period: existingProperty.billing_period || "",
        bedrooms: existingProperty.bedrooms,
        bathrooms: existingProperty.bathrooms,
        area: existingProperty.area,
        parking: existingProperty.parking,
        floor: existingProperty.floor ?? "",
        description: existingProperty.description,
        city: existingProperty.city,
        state: existingProperty.state,
        latitude: Number(existingProperty.latitude),
        longitude: Number(existingProperty.longitude),
        amenities: existingProperty.amenities,
        existingImages: existingProperty.images.map((img) => ({ id: img.id, url: img.image })),
      },
    });
  }, [existingProperty]);

  function setField(field, value) {
    dispatch({ type: "SET_FIELD", field, value });
  }

  function goNext() {
    const stepErrors = validateStep(step, state);
    if (Object.keys(stepErrors).length) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length));
  }

  function goBack() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleRemoveExistingImage(img) {
    try {
      await deletePropertyImage(id, img.id);
      dispatch({ type: "REMOVE_EXISTING_IMAGE", id: img.id });
      showToast("Photo removed.");
    } catch {
      showToast("Couldn't remove photo.", { type: "error" });
    }
  }

  async function handlePublish() {
    setSubmitting(true);
    try {
      const payload = {
        title: state.title,
        description: state.description,
        type: state.type,
        listing_type: state.listing_type,
        price: state.price,
        billing_period: state.billing_period,
        bedrooms: Number(state.bedrooms),
        bathrooms: Number(state.bathrooms),
        area: Number(state.area),
        parking: Number(state.parking) || 0,
        floor: state.floor === "" ? null : Number(state.floor),
        city: state.city,
        state: state.state,
        latitude: state.latitude,
        longitude: state.longitude,
        amenities: state.amenities,
        status: "active",
      };

      const property = isEdit ? await updateProperty(id, payload) : await createProperty(payload);

      for (const img of state.images) {
        // eslint-disable-next-line no-await-in-loop
        await addPropertyImage(property.id, img.file);
      }

      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      if (isEdit) queryClient.invalidateQueries({ queryKey: ["property", id] });

      showToast(isEdit ? "Listing updated." : "Listing published!");
      navigate("/dashboard");
    } catch (error) {
      applyServerErrors(error, { showToast });
    } finally {
      setSubmitting(false);
    }
  }

  if (isEdit && loadingExisting) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="mt-6 h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">{isEdit ? "Edit Listing" : "Add New Listing"}</h1>

      <div className="mt-6 overflow-x-auto pb-1">
        <StepIndicator steps={STEPS} currentStep={step} />
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-surface p-6">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="text-sm font-medium text-slate-700">Title</label>
              <input
                id="title"
                type="text"
                value={state.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="e.g. 3-Bed Apartment, Lekki Phase 1"
                className={inputClass}
              />
              {errors.title && <p className="mt-1 text-xs text-error">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="type" className="text-sm font-medium text-slate-700">Property Type</label>
              <select id="type" value={state.type} onChange={(e) => setField("type", e.target.value)} className={inputClass}>
                {TYPES.map((t) => (
                  <option key={t} value={t}>{typeLabel(t)}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="listing_type" className="text-sm font-medium text-slate-700">Listing Type</label>
              <select
                id="listing_type"
                value={state.listing_type}
                onChange={(e) => setField("listing_type", e.target.value)}
                className={inputClass}
              >
                {LISTING_TYPES.map((t) => (
                  <option key={t} value={t}>{listingTypeLabel(t)}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="text-sm font-medium text-slate-700">Price (₦)</label>
                <input id="price" type="number" min="0" value={state.price} onChange={(e) => setField("price", e.target.value)} className={inputClass} />
                {errors.price && <p className="mt-1 text-xs text-error">{errors.price}</p>}
              </div>
              <div>
                <label htmlFor="billing_period" className="text-sm font-medium text-slate-700">Billing Period</label>
                <select id="billing_period" value={state.billing_period} onChange={(e) => setField("billing_period", e.target.value)} className={inputClass}>
                  <option value="">One-off (sale)</option>
                  <option value="yearly">Yearly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <label htmlFor="bedrooms" className="text-sm font-medium text-slate-700">Bedrooms</label>
                <input id="bedrooms" type="number" min="0" value={state.bedrooms} onChange={(e) => setField("bedrooms", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="bathrooms" className="text-sm font-medium text-slate-700">Bathrooms</label>
                <input id="bathrooms" type="number" min="0" value={state.bathrooms} onChange={(e) => setField("bathrooms", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="parking" className="text-sm font-medium text-slate-700">Parking</label>
                <input id="parking" type="number" min="0" value={state.parking} onChange={(e) => setField("parking", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="floor" className="text-sm font-medium text-slate-700">Floor</label>
                <input id="floor" type="number" min="0" value={state.floor} onChange={(e) => setField("floor", e.target.value)} className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="area" className="text-sm font-medium text-slate-700">Area (sqm)</label>
              <input id="area" type="number" min="0" value={state.area} onChange={(e) => setField("area", e.target.value)} className={inputClass} />
              {errors.area && <p className="mt-1 text-xs text-error">{errors.area}</p>}
            </div>

            <div>
              <label htmlFor="description" className="text-sm font-medium text-slate-700">Description</label>
              <textarea id="description" rows={4} value={state.description} onChange={(e) => setField("description", e.target.value)} className={inputClass} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="text-sm font-medium text-slate-700">City</label>
                <input id="city" type="text" value={state.city} onChange={(e) => setField("city", e.target.value)} placeholder="e.g. Lagos" className={inputClass} />
                {errors.city && <p className="mt-1 text-xs text-error">{errors.city}</p>}
              </div>
              <div>
                <label htmlFor="stateRegion" className="text-sm font-medium text-slate-700">State</label>
                <input id="stateRegion" type="text" value={state.state} onChange={(e) => setField("state", e.target.value)} placeholder="e.g. Lagos" className={inputClass} />
                {errors.state && <p className="mt-1 text-xs text-error">{errors.state}</p>}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700">Location — click the map to set coordinates</p>
              <div className="mt-2 h-72">
                <LocationPicker
                  latitude={state.latitude}
                  longitude={state.longitude}
                  onChange={(lat, lng) => dispatch({ type: "SET_LOCATION", latitude: lat, longitude: lng })}
                />
              </div>
              {errors.location && <p className="mt-1 text-xs text-error">{errors.location}</p>}
              {state.latitude != null && (
                <p className="mt-1 text-xs text-slate-500">
                  {state.latitude.toFixed(6)}, {state.longitude.toFixed(6)}
                </p>
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map(({ key, label }) => {
              const active = state.amenities.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => dispatch({ type: "TOGGLE_AMENITY", key })}
                  aria-pressed={active}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    active ? "border-primary bg-primary-50 text-primary-strong" : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {step === 5 && (
          <div>
            {state.existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-slate-700">Current photos</p>
                <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {state.existingImages.map((img) => (
                    <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200">
                      <img src={img.url} alt="" loading="lazy" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(img)}
                        className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <ImageUploader
              images={state.images}
              onAdd={(files) => dispatch({ type: "ADD_IMAGES", files })}
              onRemove={(img) => dispatch({ type: "REMOVE_IMAGE", key: img.key })}
            />
          </div>
        )}

        {step === 6 && (
          <div className="space-y-3 text-sm">
            <h2 className="text-base font-bold text-slate-900">Review</h2>
            <ReviewRow label="Title" value={state.title} />
            <ReviewRow label="Type" value={`${typeLabel(state.type)} — For ${listingTypeLabel(state.listing_type)}`} />
            <ReviewRow label="Price" value={`₦${Number(state.price || 0).toLocaleString()}${state.billing_period ? `/${state.billing_period === "yearly" ? "yr" : "mo"}` : ""}`} />
            <ReviewRow label="Details" value={`${state.bedrooms} bed · ${state.bathrooms} bath · ${state.area}sqm · ${state.parking} parking`} />
            <ReviewRow label="Location" value={`${state.city}, ${state.state}`} />
            <ReviewRow label="Amenities" value={state.amenities.length ? state.amenities.join(", ") : "None selected"} />
            <ReviewRow label="Photos" value={`${state.existingImages.length + state.images.length} photo(s)`} />
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 1}
          className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        >
          Back
        </button>

        {step < STEPS.length ? (
          <button
            type="button"
            onClick={goNext}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePublish}
            disabled={submitting}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
          >
            {submitting ? "Publishing…" : isEdit ? "Save Changes" : "Publish Listing"}
          </button>
        )}
      </div>
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-slate-100 py-2">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-900">{value}</span>
    </div>
  );
}
