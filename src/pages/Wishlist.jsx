import { Link } from "react-router-dom";
import { Heart, Search, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import ListingCard from "../components/ListingCard/ListingCard";
import useWishlistStore from "../store/wishlistStore";

const Wishlist = () => {
  const wishlist = useWishlistStore((state) => state.wishlist);
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist,
  );

  if (wishlist.length === 0) {
    return (
      <main className="min-h-screen bg-surface-muted">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-md text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100"
            >
              <Heart size={36} className="text-gray-400" />
            </motion.div>

            <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Your wishlist is empty
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Save places you love and come back to them whenever you're ready
              to book.
            </p>

            <Link
              to="/search"
              className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              <Search size={17} />
              Explore Listings
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface-muted pb-16">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Heart size={22} className="fill-red-500 text-red-500" />

              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Wishlist
              </h1>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              {wishlist.length} {wishlist.length === 1 ? "place" : "places"}{" "}
              saved for later.
            </p>
          </div>

          <Link
            to="/search"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
          >
            <Search size={16} />
            Explore more
          </Link>
        </div>

        {/* Wishlist Grid */}
        <motion.div
          layout
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {wishlist.map((listing) => (
              <motion.div
                key={listing.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.85,
                  y: 20,
                  transition: {
                    duration: 0.2,
                  },
                }}
                transition={{
                  layout: {
                    duration: 0.3,
                  },
                }}
                className="relative"
              >
                <ListingCard listing={listing} />

                {/* Remove Button */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={(event) => {
                    event.stopPropagation();
                    removeFromWishlist(listing.id);
                  }}
                  className="absolute bottom-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gray-600 shadow-md backdrop-blur-sm transition hover:bg-red-50 hover:text-red-500 cursor-pointer"
                  aria-label={`Remove ${listing.title} from wishlist`}
                >
                  <Trash2 size={16} />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
};

export default Wishlist;
