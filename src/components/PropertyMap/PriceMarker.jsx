import { divIcon } from "leaflet";
import { Marker } from "react-leaflet";
import { useEffect, useMemo, useRef } from "react";

const PriceMarker = ({ listing, isActive = false, onClick }) => {
  const markerRef = useRef(null);

  const icon = useMemo(
    () =>
      divIcon({
        className: "price-marker-wrapper",
        html: `
          <div class="price-marker">
            $${listing.price}
          </div>
        `,
        iconSize: [80, 40],
        iconAnchor: [40, 20],
      }),
    [listing.price],
  );

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    const element = marker.getElement();
    if (!element) return;

    const priceElement = element.querySelector(".price-marker");
    if (!priceElement) return;

    priceElement.classList.toggle("price-marker-active", isActive);
  }, [isActive]);

  return (
    <Marker
      ref={markerRef}
      position={[listing.lat, listing.lng]}
      icon={icon}
      eventHandlers={{
        click: onClick,
        mouseover: onClick,
      }}
    />
  );
};

export default PriceMarker;
