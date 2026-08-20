import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Users,
  X,
} from "lucide-react";

import mockData from "../data/mock-data.json";
import useBookingStore from "../store/bookingStore";

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const startNewBooking = useBookingStore((state) => state.startNewBooking);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const listing = mockData.find((item) => item.id === Number(id));
  const images = listing?.images ?? [];

  const today = new Date().toISOString().split("T")[0];

  const openLightbox = (index) => {
    setActiveImage(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const showNextImage = () => {
    if (images.length <= 1) return;

    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const showPreviousImage = () => {
    if (images.length <= 1) return;

    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleReserve = () => {
    if (!listing) return;

    // New booking starts fresh for this property
    startNewBooking(listing.id);

    navigate(`/booking?listing=${listing.id}`);
  };

  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowRight") {
        showNextImage();
      }

      if (event.key === "ArrowLeft") {
        showPreviousImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen]);

  if (!listing) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface-muted p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Listing not found
          </h1>

          <p className="mt-2 text-gray-600">
            The property you are looking for does not exist.
          </p>

          <Link
            to="/search"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            <ArrowLeft size={16} />
            Back to Search
          </Link>
        </div>
      </main>
    );
  }

  const amenityIcons = {
    WiFi: "📶",
    Pool: "🏊",
    Kitchen: "🍳",
    Parking: "🚗",
    TV: "📺",
    "Air conditioning": "❄️",
    Garden: "🌿",
    Washer: "🧺",
    Breakfast: "🍽️",
    Workspace: "💻",
    Elevator: "🛗",
    Gym: "🏋️",
  };

  const reviews = [
    {
      id: 1,
      name: "Ali Raza",
      avatar: "https://i.pravatar.cc/150?img=12",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "Amazing place with a beautiful interior. Everything was clean, comfortable and exactly as shown in the pictures.",
    },
    {
      id: 2,
      name: "Hina Ahmed",
      avatar: "https://i.pravatar.cc/150?img=32",
      rating: 5,
      date: "1 month ago",
      comment:
        "Really enjoyed our stay. The location was convenient and the host was very helpful throughout our visit.",
    },
    {
      id: 3,
      name: "Usman Malik",
      avatar: "https://i.pravatar.cc/150?img=11",
      rating: 4,
      date: "2 months ago",
      comment:
        "Very comfortable property with all the basic amenities we needed. Would definitely consider staying again.",
    },
    {
      id: 4,
      name: "Sara Khan",
      avatar: "https://i.pravatar.cc/150?img=45",
      rating: 5,
      date: "3 months ago",
      comment:
        "Beautiful property and peaceful environment. The place felt welcoming from the moment we arrived.",
    },
  ];

  const ratingPercentages = {
    5: 88,
    4: 8,
    3: 3,
    2: 1,
    1: 0,
  };

  return (
    <main className="min-h-screen bg-surface-muted pb-24 lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            to="/search"
            className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:-translate-x-0.5 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:shadow"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            Back to Search
          </Link>
        </div>

        {/* Heading */}
        <div>
          <p className="text-sm font-medium text-gray-500">{listing.type}</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {listing.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span className="font-medium text-gray-900">
              ★ {listing.rating}
            </span>

            <span>•</span>

            <span>{listing.reviewCount} reviews</span>
          </div>
        </div>

        {/* Gallery */}
        <div className="mt-8 grid h-[500px] grid-cols-1 gap-2 overflow-hidden rounded-3xl md:grid-cols-2">
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="group h-full cursor-pointer overflow-hidden"
          >
            <img
              src={images[0]}
              alt={listing.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </button>

          {images[1] && (
            <button
              type="button"
              onClick={() => openLightbox(1)}
              className="group hidden h-full cursor-pointer overflow-hidden md:block"
            >
              <img
                src={images[1]}
                alt={`${listing.title} view 2`}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </button>
          )}
        </div>

        {/* Main Content + Booking */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Left Content */}
          <div>
            {/* Host */}
            <section className="border-t border-gray-200 pt-8">
              <div className="flex items-center gap-4">
                <img
                  src={listing.host.avatar}
                  alt={listing.host.name}
                  className="h-14 w-14 rounded-full object-cover shadow-md ring-2 ring-white"
                />

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Hosted by {listing.host.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Host since {listing.host.joinedYear}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <p className="text-sm font-semibold text-gray-900">
                    ★ {listing.rating}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">Guest rating</p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <p className="text-sm font-semibold text-gray-900">
                    {listing.reviewCount}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">Reviews</p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <p className="text-sm font-semibold text-gray-900">
                    Verified host
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Trusted by guests
                  </p>
                </div>
              </div>
            </section>

            {/* Amenities */}
            <section className="mt-10 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-semibold text-gray-900">
                What this place offers
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Everything you need for a comfortable stay.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {listing.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg">
                      {amenityIcons[amenity] ?? "✨"}
                    </span>

                    <span className="text-sm font-medium text-gray-700">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section className="mt-10 border-t border-gray-200 pt-8">
              <div className="flex items-center gap-2">
                <span className="text-xl text-gray-900">★</span>

                <h2 className="text-2xl font-semibold text-gray-900">
                  {listing.rating} · {listing.reviewCount} reviews
                </h2>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                See what previous guests loved about this stay.
              </p>

              {/* Rating Breakdown */}
              <div className="mt-8 grid gap-8 rounded-3xl border border-gray-200 bg-white p-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Rating breakdown
                  </h3>

                  <div className="mt-5 space-y-4">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-3">
                        <span className="w-4 text-sm font-medium text-gray-700">
                          {rating}
                        </span>

                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-gray-900 transition-all duration-500"
                            style={{
                              width: `${ratingPercentages[rating]}%`,
                            }}
                          />
                        </div>

                        <span className="w-8 text-right text-xs text-gray-500">
                          {ratingPercentages[rating]}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 p-6 text-center">
                  <div className="text-4xl font-bold text-gray-900">
                    {listing.rating}
                  </div>

                  <div className="mt-2 text-lg tracking-wide text-gray-900">
                    ★★★★★
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    Based on {listing.reviewCount} guest reviews
                  </p>
                </div>
              </div>

              {/* Review Cards */}
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {reviews.map((review) => (
                  <article
                    key={review.id}
                    className="rounded-3xl border border-gray-200 bg-white p-5 transition duration-200 hover:border-gray-300 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="h-11 w-11 rounded-full object-cover"
                        />

                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">
                            {review.name}
                          </h4>

                          <p className="mt-0.5 text-xs text-gray-500">
                            {review.date}
                          </p>
                        </div>
                      </div>

                      <div className="text-sm font-medium text-gray-900">
                        ★ {review.rating}
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-gray-600">
                      {review.comment}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          {/* Desktop Sticky Booking */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-lg">
              {/* Price */}
              <div className="flex items-end justify-between gap-4">
                <div>
                  <span className="text-2xl font-bold text-gray-900">
                    ${listing.price}
                  </span>

                  <span className="text-sm text-gray-500"> / night</span>
                </div>

                <div className="text-sm text-gray-600">★ {listing.rating}</div>
              </div>

              {/* Dates */}
              <div className="mt-6 overflow-hidden rounded-2xl border border-gray-300">
                <div className="grid grid-cols-2">
                  <label className="border-r border-gray-300 p-3">
                    <span className="block text-[10px] font-bold uppercase tracking-wide text-gray-500">
                      Check-in
                    </span>

                    <div className="mt-1 flex items-center gap-2">
                      <CalendarDays
                        size={15}
                        className="shrink-0 text-gray-500"
                      />

                      <input
                        type="date"
                        min={today}
                        value={checkIn}
                        onChange={(event) => setCheckIn(event.target.value)}
                        className="w-full cursor-pointer bg-transparent text-sm text-gray-900 outline-none"
                      />
                    </div>
                  </label>

                  <label className="p-3">
                    <span className="block text-[10px] font-bold uppercase tracking-wide text-gray-500">
                      Check-out
                    </span>

                    <div className="mt-1 flex items-center gap-2">
                      <CalendarDays
                        size={15}
                        className="shrink-0 text-gray-500"
                      />

                      <input
                        type="date"
                        min={checkIn || today}
                        value={checkOut}
                        onChange={(event) => setCheckOut(event.target.value)}
                        className="w-full cursor-pointer bg-transparent text-sm text-gray-900 outline-none"
                      />
                    </div>
                  </label>
                </div>
              </div>

              {/* Guests */}
              <div className="mt-4 rounded-2xl border border-gray-300 p-3">
                <span className="block text-[10px] font-bold uppercase tracking-wide text-gray-500">
                  Guests
                </span>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users size={17} className="text-gray-500" />

                    <span className="text-sm font-medium text-gray-900">
                      {guests} {guests === 1 ? "guest" : "guests"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={guests <= 1}
                      onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      −
                    </button>

                    <button
                      type="button"
                      onClick={() => setGuests((prev) => prev + 1)}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 text-gray-700 transition hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Reserve */}
              <button
                type="button"
                onClick={handleReserve}
                className="mt-6 w-full cursor-pointer rounded-2xl bg-gray-900 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Reserve
              </button>

              <p className="mt-3 text-center text-xs text-gray-500">
                You won't be charged yet
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Bottom Reserve Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-lg font-bold text-gray-900">
              ${listing.price}
              <span className="ml-1 text-xs font-normal text-gray-500">
                / night
              </span>
            </p>

            <p className="text-xs text-gray-500">
              ★ {listing.rating} · {listing.reviewCount} reviews
            </p>
          </div>

          <button
            type="button"
            onClick={handleReserve}
            className="cursor-pointer rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Reserve
          </button>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          >
            {/* Close */}
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-20 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
              aria-label="Close gallery"
            >
              <X size={22} />
            </button>

            {/* Previous */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={showPreviousImage}
                className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
                aria-label="Previous image"
              >
                <ChevronLeft size={26} />
              </button>
            )}

            {/* Image */}
            <motion.img
              key={activeImage}
              src={images[activeImage]}
              alt={`${listing.title} view ${activeImage + 1}`}
              drag={images.length > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                const distance = info.offset.x;
                const velocity = info.velocity.x;

                if (distance < -80 || velocity < -500) {
                  showNextImage();
                }

                if (distance > 80 || velocity > 500) {
                  showPreviousImage();
                }
              }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
              className="max-h-[85vh] max-w-[90vw] cursor-grab touch-pan-y select-none rounded-xl object-contain active:cursor-grabbing"
            />

            {/* Next */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={showNextImage}
                className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
                aria-label="Next image"
              >
                <ChevronRight size={26} />
              </button>
            )}

            {/* Counter */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
              {activeImage + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default ListingDetail;
