import { Wifi, SquareParking, Shield, Droplet, Zap, Wind, Sofa, Waves, Dumbbell } from "lucide-react";

// Single source of truth for the amenity list — used by FilterPanel,
// AmenitiesList, and the Add/Edit Listing form so they can't drift apart.
export const AMENITIES = [
  { key: "wifi", label: "WiFi", icon: Wifi },
  { key: "parking", label: "Parking", icon: SquareParking },
  { key: "security", label: "24/7 Security", icon: Shield },
  { key: "water", label: "Water Supply", icon: Droplet },
  { key: "generator", label: "Generator", icon: Zap },
  { key: "ac", label: "Air Conditioning", icon: Wind },
  { key: "furnished", label: "Furnished", icon: Sofa },
  { key: "pool", label: "Swimming Pool", icon: Waves },
  { key: "gym", label: "Gym", icon: Dumbbell },
];
