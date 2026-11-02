import { Marker, Popup } from "react-leaflet";
import MapPopup from "./MapPopup";

export default function PropertyMarker({ property }) {
  return (
    <Marker position={[property.latitude, property.longitude]}>
      <Popup>
        <MapPopup property={property} />
      </Popup>
    </Marker>
  );
}
