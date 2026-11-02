import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./leafletIconFix";
import PropertyMarker from "./PropertyMarker";

const NIGERIA_CENTER = [9.082, 8.6753];

function FitToMarkers({ properties }) {
  const map = useMap();

  useEffect(() => {
    if (!properties.length) return;
    if (properties.length === 1) {
      map.setView([properties[0].latitude, properties[0].longitude], 13);
      return;
    }
    const bounds = properties.map((p) => [p.latitude, p.longitude]);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, properties]);

  return null;
}

export default function MapView({ properties }) {
  return (
    <MapContainer
      center={NIGERIA_CENTER}
      zoom={6}
      scrollWheelZoom
      className="h-full w-full rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitToMarkers properties={properties} />
      {properties.map((property) => (
        <PropertyMarker key={property.id} property={property} />
      ))}
    </MapContainer>
  );
}
