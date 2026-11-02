import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./leafletIconFix";

const NIGERIA_CENTER = [9.082, 8.6753];

function ClickHandler({ onChange }) {
  useMapEvents({
    click(event) {
      onChange(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

export default function LocationPicker({ latitude, longitude, onChange }) {
  const hasPosition = latitude != null && longitude != null;

  return (
    <MapContainer
      center={hasPosition ? [latitude, longitude] : NIGERIA_CENTER}
      zoom={hasPosition ? 13 : 6}
      scrollWheelZoom
      className="h-full w-full rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onChange={onChange} />
      {hasPosition && <Marker position={[latitude, longitude]} />}
    </MapContainer>
  );
}
