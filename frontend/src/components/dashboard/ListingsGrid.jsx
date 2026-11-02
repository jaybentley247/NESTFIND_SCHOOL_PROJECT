import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Eye, MessageSquare, MapPin, Power } from "lucide-react";
import { updateProperty } from "../../api/properties";
import { useToast } from "../../context/ToastContext";
import { formatPrice } from "../../utils/formatPrice";
import { typeLabel } from "../../utils/propertyTypes";

const STATUS_STYLES = {
  active: "bg-green-100 text-green-700",
  draft: "bg-amber-100 text-amber-700",
  inactive: "bg-slate-100 text-slate-600",
};

// PRD page 8: "Listings Table — Cover, Title, Type, Price, Status, Views,
// Enquiries, Actions (Edit / Toggle / Delete)." Rendered as a card grid
// per the user's explicit preference, but covers the same columns/actions.
export default function ListingsGrid({ listings, enquiriesByProperty, onDeleteRequest }) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: ({ id, status }) => updateProperty(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      showToast("Listing status updated.");
    },
    onError: () => showToast("Couldn't update listing status.", { type: "error" }),
  });

  function handleToggle(property) {
    const nextStatus = property.status === "active" ? "inactive" : "active";
    toggleMutation.mutate({ id: property.id, status: nextStatus });
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((property) => (
        <div key={property.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="relative aspect-[4/3]">
            <img src={property.cover_image} alt="" loading="lazy" className="h-full w-full object-cover" />
            <span
              className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                STATUS_STYLES[property.status] || STATUS_STYLES.inactive
              }`}
            >
              {property.status}
            </span>
          </div>

          <div className="p-4">
            <Link to={`/listings/${property.id}`} className="line-clamp-1 font-semibold text-slate-900 hover:text-primary">
              {property.title}
            </Link>
            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {property.city}, {property.state}
            </p>

            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-slate-600">{typeLabel(property.type)}</span>
              <span className="font-bold text-slate-900">
                {formatPrice(property.price, { billingPeriod: property.billing_period })}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" /> {property.views} views
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" /> {enquiriesByProperty[property.id] ?? 0} enquiries
              </span>
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                to={`/dashboard/listings/${property.id}/edit`}
                aria-label={`Edit ${property.title}`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              {property.status !== "draft" && (
                <button
                  type="button"
                  onClick={() => handleToggle(property)}
                  disabled={toggleMutation.isPending}
                  aria-label={property.status === "active" ? `Deactivate ${property.title}` : `Activate ${property.title}`}
                  title={property.status === "active" ? "Deactivate" : "Activate"}
                  className="flex items-center justify-center rounded-lg border border-slate-200 px-2.5 text-slate-500 hover:bg-slate-50 disabled:opacity-60"
                >
                  <Power className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => onDeleteRequest(property)}
                aria-label={`Delete ${property.title}`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-100 py-2 text-xs font-semibold text-error hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
