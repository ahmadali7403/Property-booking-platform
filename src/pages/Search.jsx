import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import mockData from "../data/mock-data.json";
import SkeletonListingCard from "../components/SkeletonListingCard/SkeletonListingCard";
import ListingCard from "../components/ListingCard/ListingCard";
import PropertyMap from "../components/PropertyMap/PropertyMap";

const Search = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeListingId, setActiveListingId] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const listingRefs = useRef({});

  useEffect(() => {
    const loadListings = async () => {
      try {
        setListings(mockData);
      } catch (error) {
        console.error("Failed to load listings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, []);

  const handleMarkerClick = (listingId) => {
    setActiveListingId(listingId);

    requestAnimationFrame(() => {
      listingRefs.current[listingId]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  };

  return (
    <main className="min-h-screen bg-surface-muted">
      <div className="flex min-h-screen">
        <section className="w-full lg:w-1/2">
          <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Find your perfect stay
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Explore beautiful places to stay.
            </p>

            <div className="mt-6">
              {loading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <SkeletonListingCard key={index} />
                  ))}
                </div>
              ) : listings.length > 0 ? (
                <>
                  <p className="text-sm text-gray-600">
                    {listings.length} properties found
                  </p>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {listings.map((listing) => (
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
                    We couldn't find any properties matching your search. Try
                    changing your dates, location, or filters.
                  </p>

                  <button
                    type="button"
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
              listings={listings}
              activeListingId={activeListingId}
              onMarkerClick={handleMarkerClick}
            />
          </div>
        </section>
      </div>

      {/* Mobile Show Map Button */}
      <button
        type="button"
        onClick={() => setIsMapOpen(true)}
        className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 cursor-pointer rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-gray-800 lg:hidden"
      >
        Show map
      </button>

      {/* Mobile Fullscreen Map */}
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
                listings={listings}
                activeListingId={activeListingId}
                onMarkerClick={(listingId) => {
                  setActiveListingId(listingId);
                }}
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
    </main>
  );
};

export default Search;
