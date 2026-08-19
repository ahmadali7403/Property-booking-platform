import { MapContainer, TileLayer } from "react-leaflet";

import PriceMarker from "./PriceMarker";

const PropertyMap = ({
  listings = [],
  activeListingId = null,
  onMarkerClick,
}) => {
  const center = [31.5204, 74.3587];

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {listings.map((listing) => (
        <PriceMarker
          key={listing.id}
          listing={listing}
          isActive={listing.id === activeListingId}
          onClick={() => onMarkerClick?.(listing.id)}
        />
      ))}
    </MapContainer>
  );
};

export default PropertyMap;
