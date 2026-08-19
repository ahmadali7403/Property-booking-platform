import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import mockData from "../data/mock-data.json";
import SkeletonListingCard from "../components/SkeletonListingCard/SkeletonListingCard";
import ListingCard from "../components/ListingCard/ListingCard";
import PropertyMap from "../components/PropertyMap/PropertyMap";
import FiltersPanel from "../components/FiltersPanel/FiltersPanel";
import useFilterStore from "../store/filterStore";

const Search = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeListingId, setActiveListingId] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const listingRefs = useRef({});

  const { filters, clearFilters, togglePropertyType, toggleAmenity } =
    useFilterStore();

  useEffect(() => {
    try {
      setListings(mockData);
    } catch (error) {
      console.error("Failed to load listings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      // Price
      const [minPrice, maxPrice] = filters.priceRange;

      const matchesPrice =
        listing.price >= minPrice && listing.price <= maxPrice;

      // Property type
      const matchesPropertyType =
        filters.propertyTypes.length === 0 ||
        filters.propertyTypes.some(
          (type) => type.toLowerCase() === listing.type.toLowerCase(),
        );

      // Amenities
      const matchesAmenities =
        filters.amenities.length === 0 ||
        filters.amenities.every((selectedAmenity) =>
          listing.amenities.some(
            (amenity) =>
              amenity.toLowerCase() === selectedAmenity.toLowerCase(),
          ),
        );

      return matchesPrice && matchesPropertyType && matchesAmenities;
    });
  }, [listings, filters]);

  const handleMarkerClick = (listingId) => {
    setActiveListingId(listingId);

    requestAnimationFrame(() => {
      listingRefs.current[listingId]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  };

  // Active filter chips
  const activeChips = [];

  const [minPrice, maxPrice] = filters.priceRange;

  if (minPrice > 50 || maxPrice < 500) {
    activeChips.push({
      id: "price",
      label: `$${minPrice} – $${maxPrice}`,
      onRemove: () => {
        useFilterStore.getState().setPriceRange([50, 500]);
      },
    });
  }

  filters.propertyTypes.forEach((type) => {
    activeChips.push({
      id: `type-${type}`,
      label: type,
      onRemove: () => togglePropertyType(type),
    });
  });

  filters.amenities.forEach((amenity) => {
    activeChips.push({
      id: `amenity-${amenity}`,
      label: amenity,
      onRemove: () => toggleAmenity(amenity),
    });
  });

  const hasActiveFilters = activeChips.length > 0;

  return (
    <main className="min-h-screen bg-surface-muted">
      <div className="flex min-h-screen">
        {/* Listings */}
        <section className="w-full lg:w-1/2">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Find your perfect stay
                </h1>

                <p className="mt-2 text-sm text-gray-600">
                  Explore beautiful places to stay.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsFiltersOpen(true)}
                className="shrink-0 cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:border-gray-300 hover:shadow"
              >
                Filters
              </button>
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {activeChips.map((chip) => (
                  <motion.button
                    key={chip.id}
                    type="button"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={chip.onRemove}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
                  >
                    <span className="capitalize">{chip.label}</span>

                    <span className="text-gray-400">×</span>
                  </motion.button>
                ))}

                <button
                  type="button"
                  onClick={clearFilters}
                  className="cursor-pointer px-2 py-1.5 text-xs font-semibold text-gray-500 transition hover:text-gray-900"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Results */}
            <div className="mt-6">
              {loading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <SkeletonListingCard key={index} />
                  ))}
                </div>
              ) : filteredListings.length > 0 ? (
                <>
                  <p className="text-sm text-gray-600">
                    {filteredListings.length}{" "}
                    {filteredListings.length === 1 ? "property" : "properties"}{" "}
                    found
                  </p>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {filteredListings.map((listing) => (
                      <div
                        key={listing.id}
                        ref={(element) => {
                          listingRefs.current[listing.id] = element;
                        }}
                      >
                        <ListingCard
                          listing={listing}
                          isActive={listing.id === activeListingId}
                          onHover={() => setActiveListingId(listing.id)}
                          onLeave={() => setActiveListingId(null)}
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl bg-white px-6 py-12 text-center shadow-card">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-4xl">
                    🏡
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900">
                    No stays found
                  </h2>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                    We couldn't find any properties matching your filters. Try
                    removing some filters.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 cursor-pointer rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Desktop Map */}
        <section className="hidden lg:block lg:w-1/2">
          <div className="sticky top-0 h-screen">
            <PropertyMap
              listings={filteredListings}
              activeListingId={activeListingId}
              onMarkerClick={handleMarkerClick}
            />
          </div>
        </section>
      </div>

      {/* Mobile Show Map */}
      <button
        type="button"
        onClick={() => setIsMapOpen(true)}
        className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 cursor-pointer rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-gray-800 lg:hidden"
      >
        Show map
      </button>

      {/* Mobile Map */}
      <AnimatePresence>
        {isMapOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white lg:hidden"
          >
            <div className="relative h-full w-full">
              <PropertyMap
                listings={filteredListings}
                activeListingId={activeListingId}
                onMarkerClick={handleMarkerClick}
              />

              <button
                type="button"
                onClick={() => setIsMapOpen(false)}
                className="absolute right-4 top-4 z-[1000] flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white text-xl font-semibold text-gray-900 shadow-lg"
                aria-label="Close map"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Panel */}
      <FiltersPanel
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      />
    </main>
  );
};

export default Search;
