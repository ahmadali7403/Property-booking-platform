import {
  Wifi,
  Waves,
  CookingPot,
  Car,
  AirVent,
  WashingMachine,
  Tv,
  BriefcaseBusiness,
  Minus,
  Plus,
} from "lucide-react";
import useFilterStore from "../../store/filterStore";

const propertyTypes = [
  "apartment",
  "house",
  "villa",
  "cabin",
  "cottage",
  "guesthouse",
];

const amenities = [
  {
    id: "wifi",
    label: "WiFi",
    icon: Wifi,
  },
  {
    id: "pool",
    label: "Pool",
    icon: Waves,
  },
  {
    id: "kitchen",
    label: "Kitchen",
    icon: CookingPot,
  },
  {
    id: "parking",
    label: "Parking",
    icon: Car,
  },
  {
    id: "air-conditioning",
    label: "Air conditioning",
    icon: AirVent,
  },
  {
    id: "washer",
    label: "Washer",
    icon: WashingMachine,
  },
  {
    id: "tv",
    label: "TV",
    icon: Tv,
  },
  {
    id: "workspace",
    label: "Workspace",
    icon: BriefcaseBusiness,
  },
];

const guestTypes = [
  {
    id: "adults",
    label: "Adults",
    description: "Ages 13 or above",
  },
  {
    id: "children",
    label: "Children",
    description: "Ages 2–12",
  },
  {
    id: "infants",
    label: "Infants",
    description: "Under 2",
  },
];

const FiltersPanel = ({ isOpen, onClose }) => {
  const {
    filters,
    setPriceRange,
    togglePropertyType,
    toggleAmenity,
    updateGuestCount,
  } = useFilterStore();

  const [minPrice, maxPrice] = filters.priceRange;

  const handleMinChange = (event) => {
    const value = Math.min(Number(event.target.value), maxPrice - 10);

    setPriceRange([value, maxPrice]);
  };

  const handleMaxChange = (event) => {
    const value = Math.max(Number(event.target.value), minPrice + 10);

    setPriceRange([minPrice, value]);
  };

  const handleGuestChange = (guestType, amount) => {
    const currentValue = filters.guests[guestType];

    updateGuestCount(guestType, currentValue + amount);
  };

  const renderFilters = () => (
    <div className="space-y-8">
      {/* Price Range */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900">Price range</h3>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex-1 rounded-xl border border-gray-200 px-4 py-2">
            <p className="text-xs text-gray-500">Minimum</p>

            <p className="font-semibold text-gray-900">${minPrice}</p>
          </div>

          <span className="text-gray-400">—</span>

          <div className="flex-1 rounded-xl border border-gray-200 px-4 py-2">
            <p className="text-xs text-gray-500">Maximum</p>

            <p className="font-semibold text-gray-900">${maxPrice}</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={minPrice}
            onChange={handleMinChange}
            className="w-full cursor-pointer accent-gray-900"
          />

          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={maxPrice}
            onChange={handleMaxChange}
            className="w-full cursor-pointer accent-gray-900"
          />
        </div>
      </section>

      {/* Property Type */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900">Property type</h3>

        <div className="mt-4 space-y-2">
          {propertyTypes.map((type) => {
            const isChecked = filters.propertyTypes.includes(type);

            return (
              <label
                key={type}
                className={`flex cursor-pointer items-center gap-3 rounded-xl p-3 transition ${
                  isChecked ? "bg-gray-50" : "hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => togglePropertyType(type)}
                  className="h-4 w-4 cursor-pointer accent-gray-900"
                />

                <span className="text-sm capitalize text-gray-700">{type}</span>
              </label>
            );
          })}
        </div>
      </section>

      {/* Amenities */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900">Amenities</h3>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {amenities.map((amenity) => {
            const Icon = amenity.icon;

            const isChecked = filters.amenities.includes(amenity.id);

            return (
              <label
                key={amenity.id}
                className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border p-4 text-center transition ${
                  isChecked
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Icon
                  size={21}
                  strokeWidth={1.8}
                  className={isChecked ? "text-gray-900" : "text-gray-500"}
                />

                <span className="text-xs font-medium text-gray-700">
                  {amenity.label}
                </span>

                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleAmenity(amenity.id)}
                  className="sr-only"
                />
              </label>
            );
          })}
        </div>
      </section>

      {/* Guests */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900">Guests</h3>

        <div className="mt-4 divide-y divide-gray-100">
          {guestTypes.map((guest) => {
            const count = filters.guests[guest.id];

            return (
              <div
                key={guest.id}
                className="flex items-center justify-between py-4"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {guest.label}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {guest.description}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleGuestChange(guest.id, -1)}
                    disabled={count === 0}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-300 text-gray-700 transition hover:border-gray-900 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={`Decrease ${guest.label}`}
                  >
                    <Minus size={16} />
                  </button>

                  <span className="w-5 text-center text-sm font-semibold text-gray-900">
                    {count}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleGuestChange(guest.id, 1)}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-300 text-gray-700 transition hover:border-gray-900 hover:bg-gray-50"
                    aria-label={`Increase ${guest.label}`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );

  return (
    <>
      {/* Desktop Side Panel */}
      <aside
        className={`fixed right-0 top-0 z-40 hidden h-screen w-[380px] bg-white shadow-xl transition-transform duration-300 lg:block ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>

            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full px-3 py-2 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              aria-label="Close filters"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">{renderFilters()}</div>

          <div className="border-t p-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full cursor-pointer rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Apply filters
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={onClose} />

          <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] rounded-t-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-5">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>

              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-full px-3 py-2 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close filters"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-6">
              {renderFilters()}
            </div>

            <div className="border-t p-6">
              <button
                type="button"
                onClick={onClose}
                className="w-full cursor-pointer rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Apply filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FiltersPanel;
