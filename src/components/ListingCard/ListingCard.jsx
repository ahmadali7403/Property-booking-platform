import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { motion } from "framer-motion";

import Badge from "../Badge/Badge";
import StarRating from "../StarRating/StarRating";
import useWishlistStore from "../../store/wishlistStore";

const ListingCard = ({ listing, isActive = false, onHover, onLeave }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const navigate = useNavigate();

  const { isSaved, toggleWishlist } = useWishlistStore();

  const images = listing.images ?? [];
  const saved = isSaved(listing.id);

  const handleCardClick = () => {
    navigate(`/listing/${listing.id}`);
  };

  const handleWishlistClick = (event) => {
    event.stopPropagation();

    toggleWishlist(listing);
  };

  const nextImage = (event) => {
    event.stopPropagation();

    if (images.length === 0) return;

    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const previousImage = (event) => {
    event.stopPropagation();

    if (images.length === 0) return;

    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.article
      onClick={handleCardClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      animate={{
        scale: isActive ? 1.025 : 1,
        y: isActive ? -4 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 24,
      }}
      className={`group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-card ${
        isActive ? "ring-2 ring-gray-900/10 shadow-xl" : ""
      }`}
    >
      {/* Image */}
      <div className="group relative aspect-[4/3] overflow-hidden">
        {images.length > 0 ? (
          <img
            src={images[currentImage]}
            alt={listing.title}
            className="h-full w-full object-cover transition-opacity duration-200"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-200 text-sm text-gray-500">
            No image available
          </div>
        )}

        {/* Property Type */}
        <div className="absolute left-3 top-3">
          <Badge variant="brand">{listing.type}</Badge>
        </div>

        {/* Wishlist Button */}
        <motion.button
          type="button"
          onClick={handleWishlistClick}
          whileTap={{ scale: 0.85 }}
          animate={{
            scale: saved ? [1, 1.15, 1] : 1,
          }}
          transition={{
            duration: 0.25,
          }}
          className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md backdrop-blur-sm transition hover:bg-white"
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
        >
          <Heart
            size={19}
            strokeWidth={2}
            className={saved ? "fill-red-500 text-red-500" : "text-gray-700"}
          />
        </motion.button>

        {/* Image Controls */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={previousImage}
              className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 opacity-0 shadow-md transition group-hover:opacity-100 hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={nextImage}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 opacity-0 shadow-md transition group-hover:opacity-100 hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentImage
                      ? "w-4 bg-white"
                      : "w-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="line-clamp-1 text-base font-semibold text-gray-900">
          {listing.title}
        </h3>

        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">
              ${listing.price}
            </span>{" "}
            / night
          </p>

          <StarRating rating={listing.rating} showValue={true} />
        </div>
      </div>
    </motion.article>
  );
};

export default ListingCard;
