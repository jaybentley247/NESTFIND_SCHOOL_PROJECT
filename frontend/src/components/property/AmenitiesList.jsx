import { Check } from "lucide-react";
import { AMENITIES } from "../../utils/amenities";

const AMENITY_META = Object.fromEntries(AMENITIES.map((a) => [a.key, a]));

export default function AmenitiesList({ amenities }) {
  if (!amenities.length) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {amenities.map((key) => {
        const meta = AMENITY_META[key] || { label: key, icon: Check };
        const Icon = meta.icon;
        return (
          <div key={key} className="flex items-center gap-2.5 text-sm text-slate-700">
            <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            {meta.label}
          </div>
        );
      })}
    </div>
  );
}
