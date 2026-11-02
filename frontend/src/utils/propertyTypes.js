// Mirrors the backend's Property.TYPE_CHOICES / LISTING_CHOICES
// (backend/properties/models.py) so the filter panel and listing form
// never drift out of sync with what the API actually accepts.
export const TYPES = ["apartment", "house", "studio", "villa", "penthouse", "duplex", "land"];
export const LISTING_TYPES = ["rent", "sale", "shortlet"];

export function typeLabel(type) {
  return type[0].toUpperCase() + type.slice(1);
}

export function listingTypeLabel(listingType) {
  return listingType === "shortlet" ? "Short-let" : typeLabel(listingType);
}
