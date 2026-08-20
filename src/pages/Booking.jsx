import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  CreditCard,
  Minus,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import mockData from "../data/mock-data.json";
import useBookingStore from "../store/bookingStore";

const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(16, "Card number must be 16 digits.")
    .max(19, "Card number is too long.")
    .regex(/^[0-9\s]+$/, "Enter a valid card number."),

  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY format."),

  cvc: z.string().regex(/^\d{3,4}$/, "CVC must be 3 or 4 digits."),
});

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    currentStep,
    listingId: storedListingId,
    checkIn,
    checkOut,
    guests,
    setDates,
    setGuests,
    setListingId,
    setCurrentStep,
    nextStep,
    previousStep,
    startNewBooking,
  } = useBookingStore();

  const [errors, setErrors] = useState({});
  const [bookingReference, setBookingReference] = useState("");

  // --------------------------------------------------
  // LISTING
  // --------------------------------------------------

  const queryListingId = new URLSearchParams(location.search).get("listing");

  const listingId = queryListingId ? Number(queryListingId) : storedListingId;

  const listing = useMemo(() => {
    return mockData.find((item) => item.id === Number(listingId));
  }, [listingId]);

  // --------------------------------------------------
  // NEW BOOKING RESET
  // --------------------------------------------------

  useEffect(() => {
    if (!queryListingId) return;

    const newListingId = Number(queryListingId);

    if (storedListingId !== null && Number(storedListingId) !== newListingId) {
      startNewBooking(newListingId);
    }

    if (storedListingId === null) {
      startNewBooking(newListingId);
    }
  }, [queryListingId, storedListingId, startNewBooking]);

  // --------------------------------------------------
  // DATE HELPERS
  // --------------------------------------------------

  const today = new Date().toISOString().split("T")[0];

  const getNextDay = (date) => {
    if (!date) {
      return today;
    }

    const nextDay = new Date(`${date}T00:00:00`);

    nextDay.setDate(nextDay.getDate() + 1);

    return nextDay.toISOString().split("T")[0];
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) {
      return 0;
    }

    const start = new Date(`${checkIn}T00:00:00`);

    const end = new Date(`${checkOut}T00:00:00`);

    const difference = end - start;

    return Math.max(0, Math.ceil(difference / (1000 * 60 * 60 * 24)));
  };

  const nights = calculateNights();

  const nightlyTotal = nights * (listing?.price ?? 0);

  const serviceFee = Math.round(nightlyTotal * 0.12);

  const total = nightlyTotal + serviceFee;

  // --------------------------------------------------
  // PAYMENT FORM
  // --------------------------------------------------

  const {
    register,
    handleSubmit,
    formState: { errors: paymentErrors },
  } = useForm({
    resolver: zodResolver(paymentSchema),

    defaultValues: {
      cardNumber: "",
      expiry: "",
      cvc: "",
    },
  });

  // --------------------------------------------------
  // STEP 1 — DATES
  // --------------------------------------------------

  const handleCheckInChange = (event) => {
    const value = event.target.value;

    // New check-in means checkout must be selected again.
    setDates(value, "");

    setErrors((prev) => ({
      ...prev,
      checkIn: "",
      checkOut: "",
    }));
  };

  const handleCheckOutChange = (event) => {
    const value = event.target.value;

    setDates(checkIn, value);

    setErrors((prev) => ({
      ...prev,
      checkOut: "",
    }));
  };

  const validateStepOne = () => {
    const newErrors = {};

    if (!checkIn) {
      newErrors.checkIn = "Please select your check-in date.";
    }

    if (!checkOut) {
      newErrors.checkOut = "Please select your check-out date.";
    }

    if (checkIn && checkOut && checkOut <= checkIn) {
      newErrors.checkOut = "Check-out must be after check-in.";
    }

    if (guests < 1) {
      newErrors.guests = "At least 1 guest is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleStepOneContinue = () => {
    if (!validateStepOne()) {
      return;
    }

    setListingId(listing.id);

    nextStep();
  };

  // --------------------------------------------------
  // GUEST HANDLERS
  // --------------------------------------------------

  const decreaseGuests = () => {
    if (guests <= 1) {
      return;
    }

    setGuests(guests - 1);
  };

  const increaseGuests = () => {
    setGuests(guests + 1);
  };

  // --------------------------------------------------
  // EDIT BOOKING
  // --------------------------------------------------

  const handleEditBooking = () => {
    setCurrentStep(1);
  };

  // --------------------------------------------------
  // PAYMENT
  // --------------------------------------------------

  const handlePayment = () => {
    const reference = `BK-${Date.now().toString().slice(-8).toUpperCase()}`;

    setBookingReference(reference);

    nextStep();
  };

  // --------------------------------------------------
  // BACK BUTTON
  // --------------------------------------------------

  const handleBack = () => {
    if (currentStep === 1) {
      navigate(`/listing/${listing.id}`);
      return;
    }

    previousStep();
  };

  // --------------------------------------------------
  // LISTING NOT FOUND
  // --------------------------------------------------

  if (!listing) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface-muted p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Booking listing not found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            The property you're trying to book could not be found.
          </p>

          <button
            type="button"
            onClick={() => navigate("/search")}
            className="mt-5 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Back to Search
          </button>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // STEP INDICATOR
  // --------------------------------------------------

  const steps = ["Dates & Guests", "Review", "Payment", "Confirmation"];

  return (
    <main className="min-h-screen bg-surface-muted px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* ==========================================
            BACK BUTTON
        ========================================== */}

        <button
          type="button"
          onClick={handleBack}
          className="mb-6 inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
        >
          <ArrowLeft size={16} />

          {currentStep === 1 ? "Back to Listing" : "Back"}
        </button>

        {/* ==========================================
            STEP INDICATOR
        ========================================== */}

        <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center">
            {steps.map((step, index) => {
              const stepNumber = index + 1;

              const isActive = currentStep === stepNumber;

              const isCompleted = currentStep > stepNumber;

              return (
                <div
                  key={step}
                  className="flex flex-1 items-center last:flex-none"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition ${
                        isActive || isCompleted
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {isCompleted ? <Check size={16} /> : stepNumber}
                    </div>
                  </div>

                  {stepNumber < steps.length && (
                    <div
                      className={`mx-2 h-px flex-1 transition sm:mx-4 ${
                        currentStep > stepNumber ? "bg-gray-900" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-4 text-center text-[11px] font-medium sm:text-xs">
            {steps.map((step, index) => (
              <span
                key={step}
                className={
                  currentStep === index + 1
                    ? "text-gray-900"
                    : currentStep > index + 1
                      ? "text-gray-700"
                      : "text-gray-400"
                }
              >
                {step}
              </span>
            ))}
          </div>
        </div>

        {/* ==========================================
            CONTENT
        ========================================== */}

        <AnimatePresence mode="wait">
          {/* ========================================
              STEP 1
          ======================================== */}

          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -20,
              }}
              transition={{
                duration: 0.2,
              }}
              className="grid gap-8 lg:grid-cols-[1fr_340px]"
            >
              <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <p className="text-sm font-medium text-gray-500">Step 1 of 4</p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
                  Choose your dates
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Select your stay dates and tell us how many guests are coming.
                </p>

                {/* DATES */}

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {/* CHECK IN */}

                  <div>
                    <label className="block text-sm font-semibold text-gray-900">
                      Check-in
                    </label>

                    <div
                      className={`mt-2 flex items-center gap-3 rounded-2xl border bg-white p-4 ${
                        errors.checkIn
                          ? "border-red-400 ring-2 ring-red-100"
                          : "border-gray-300 focus-within:border-gray-900"
                      }`}
                    >
                      <CalendarDays
                        size={19}
                        className="shrink-0 text-gray-500"
                      />

                      <input
                        type="date"
                        min={today}
                        value={checkIn}
                        onChange={handleCheckInChange}
                        className="w-full bg-transparent text-sm text-gray-900 outline-none"
                      />
                    </div>

                    {errors.checkIn && (
                      <p className="mt-2 text-xs font-medium text-red-600">
                        {errors.checkIn}
                      </p>
                    )}
                  </div>

                  {/* CHECK OUT */}

                  <div>
                    <label className="block text-sm font-semibold text-gray-900">
                      Check-out
                    </label>

                    <div
                      className={`mt-2 flex items-center gap-3 rounded-2xl border bg-white p-4 ${
                        errors.checkOut
                          ? "border-red-400 ring-2 ring-red-100"
                          : "border-gray-300 focus-within:border-gray-900"
                      }`}
                    >
                      <CalendarDays
                        size={19}
                        className="shrink-0 text-gray-500"
                      />

                      <input
                        type="date"
                        min={getNextDay(checkIn)}
                        value={checkOut}
                        onChange={handleCheckOutChange}
                        disabled={!checkIn}
                        className="w-full bg-transparent text-sm text-gray-900 outline-none disabled:cursor-not-allowed disabled:text-gray-400"
                      />
                    </div>

                    {!checkIn && !errors.checkOut && (
                      <p className="mt-2 text-xs text-gray-500">
                        Select check-in first.
                      </p>
                    )}

                    {errors.checkOut && (
                      <p className="mt-2 text-xs font-medium text-red-600">
                        {errors.checkOut}
                      </p>
                    )}
                  </div>
                </div>

                {/* GUESTS */}

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-900">
                    Guests
                  </label>

                  <div
                    className={`mt-2 flex items-center justify-between rounded-2xl border bg-white p-4 ${
                      errors.guests
                        ? "border-red-400 ring-2 ring-red-100"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Users size={20} className="text-gray-500" />

                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {guests} {guests === 1 ? "Guest" : "Guests"}
                        </p>

                        <p className="text-xs text-gray-500">Who's coming?</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={decreaseGuests}
                        disabled={guests === 1}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="w-5 text-center text-sm font-semibold text-gray-900">
                        {guests}
                      </span>

                      <button
                        type="button"
                        onClick={increaseGuests}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition hover:bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {errors.guests && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      {errors.guests}
                    </p>
                  )}
                </div>

                {/* CONTINUE */}

                <button
                  type="button"
                  onClick={handleStepOneContinue}
                  className="mt-8 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gray-900 py-4 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Continue
                  <ChevronRight size={18} />
                </button>
              </section>

              {/* LISTING SUMMARY */}

              <aside>
                <div className="sticky top-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                  <img
                    src={listing.images?.[0]}
                    alt={listing.title}
                    className="h-52 w-full object-cover"
                  />

                  <div className="p-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      {listing.type}
                    </p>

                    <h2 className="mt-1 text-lg font-semibold text-gray-900">
                      {listing.title}
                    </h2>

                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium text-gray-900">
                        ★ {listing.rating}
                      </span>

                      <span>·</span>

                      <span>{listing.reviewCount} reviews</span>
                    </div>

                    <div className="mt-5 border-t border-gray-100 pt-5">
                      <span className="text-xl font-bold text-gray-900">
                        ${listing.price}
                      </span>

                      <span className="text-sm text-gray-500"> / night</span>
                    </div>
                  </div>
                </div>
              </aside>
            </motion.div>
          )}

          {/* ========================================
              STEP 2 — REVIEW
          ======================================== */}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -20,
              }}
              transition={{
                duration: 0.2,
              }}
              className="grid gap-8 lg:grid-cols-[1fr_340px]"
            >
              <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <p className="text-sm font-medium text-gray-500">Step 2 of 4</p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
                  Review your trip
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Make sure everything looks right before continuing.
                </p>

                {/* LISTING */}

                <div className="mt-8 flex gap-4 rounded-2xl border border-gray-200 p-4">
                  <img
                    src={listing.images?.[0]}
                    alt={listing.title}
                    className="h-24 w-24 rounded-2xl object-cover"
                  />

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      {listing.type}
                    </p>

                    <h2 className="mt-1 font-semibold text-gray-900">
                      {listing.title}
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                      ★ {listing.rating} · {listing.reviewCount} reviews
                    </p>
                  </div>
                </div>

                {/* TRIP DETAILS */}

                <div className="mt-6 rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Dates
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {checkIn} → {checkOut}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {nights} {nights === 1 ? "night" : "nights"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleEditBooking}
                      className="cursor-pointer text-sm font-semibold text-gray-900 underline underline-offset-4"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="mt-5 border-t border-gray-100 pt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Guests
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {guests} {guests === 1 ? "guest" : "guests"}
                    </p>
                  </div>
                </div>

                {/* PRICE */}

                <div className="mt-6 rounded-2xl border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Price details
                  </h3>

                  <div className="mt-5 space-y-4 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-600">
                        ${listing.price} × {nights}{" "}
                        {nights === 1 ? "night" : "nights"}
                      </span>

                      <span className="font-medium text-gray-900">
                        ${nightlyTotal}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-600">Service fee</span>

                      <span className="font-medium text-gray-900">
                        ${serviceFee}
                      </span>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex justify-between gap-4">
                        <span className="font-semibold text-gray-900">
                          Total
                        </span>

                        <span className="text-lg font-bold text-gray-900">
                          ${total}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="mt-8 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gray-900 py-4 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Continue to Payment
                  <ChevronRight size={18} />
                </button>
              </section>

              {/* SUMMARY */}

              <aside>
                <div className="sticky top-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    Your total
                  </p>

                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    ${total}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {nights} {nights === 1 ? "night" : "nights"}
                  </p>

                  <div className="mt-6 border-t border-gray-100 pt-5">
                    <p className="text-sm font-medium text-gray-900">
                      {listing.title}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      {guests} {guests === 1 ? "guest" : "guests"}
                    </p>
                  </div>
                </div>
              </aside>
            </motion.div>
          )}

          {/* ========================================
              STEP 3 — PAYMENT
          ======================================== */}

          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -20,
              }}
              transition={{
                duration: 0.2,
              }}
              className="grid gap-8 lg:grid-cols-[1fr_340px]"
            >
              <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <p className="text-sm font-medium text-gray-500">Step 3 of 4</p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
                  Payment
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Enter your card details. This is a demo payment form and no
                  real payment will be processed.
                </p>

                <form
                  onSubmit={handleSubmit(handlePayment)}
                  className="mt-8 space-y-5"
                >
                  {/* CARD NUMBER */}

                  <div>
                    <label className="block text-sm font-semibold text-gray-900">
                      Card number
                    </label>

                    <div
                      className={`mt-2 flex items-center gap-3 rounded-2xl border p-4 ${
                        paymentErrors.cardNumber
                          ? "border-red-400 ring-2 ring-red-100"
                          : "border-gray-300"
                      }`}
                    >
                      <CreditCard
                        size={19}
                        className="shrink-0 text-gray-500"
                      />

                      <input
                        {...register("cardNumber")}
                        type="text"
                        inputMode="numeric"
                        placeholder="1234 5678 9012 3456"
                        className="w-full bg-transparent text-sm text-gray-900 outline-none"
                      />
                    </div>

                    {paymentErrors.cardNumber && (
                      <p className="mt-2 text-xs font-medium text-red-600">
                        {paymentErrors.cardNumber.message}
                      </p>
                    )}
                  </div>

                  {/* EXPIRY + CVC */}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900">
                        Expiry
                      </label>

                      <input
                        {...register("expiry")}
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        className={`mt-2 w-full rounded-2xl border p-4 text-sm text-gray-900 outline-none ${
                          paymentErrors.expiry
                            ? "border-red-400 ring-2 ring-red-100"
                            : "border-gray-300 focus:border-gray-900"
                        }`}
                      />

                      {paymentErrors.expiry && (
                        <p className="mt-2 text-xs font-medium text-red-600">
                          {paymentErrors.expiry.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900">
                        CVC
                      </label>

                      <input
                        {...register("cvc")}
                        type="password"
                        inputMode="numeric"
                        placeholder="123"
                        maxLength={4}
                        className={`mt-2 w-full rounded-2xl border p-4 text-sm text-gray-900 outline-none ${
                          paymentErrors.cvc
                            ? "border-red-400 ring-2 ring-red-100"
                            : "border-gray-300 focus:border-gray-900"
                        }`}
                      />

                      {paymentErrors.cvc && (
                        <p className="mt-2 text-xs font-medium text-red-600">
                          {paymentErrors.cvc.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* SECURITY */}

                  <div className="flex gap-3 rounded-2xl bg-gray-50 p-4">
                    <ShieldCheck size={20} className="shrink-0 text-gray-700" />

                    <p className="text-xs leading-5 text-gray-600">
                      This is a mock payment form for demonstration purposes. No
                      real card information is processed or stored.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gray-900 py-4 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    Pay ${total}
                    <ChevronRight size={18} />
                  </button>
                </form>
              </section>

              {/* PAYMENT SUMMARY */}

              <aside>
                <div className="sticky top-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    Booking total
                  </p>

                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    ${total}
                  </p>

                  <div className="mt-6 space-y-3 border-t border-gray-100 pt-5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Stay</span>

                      <span className="font-medium text-gray-900">
                        ${nightlyTotal}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Service fee</span>

                      <span className="font-medium text-gray-900">
                        ${serviceFee}
                      </span>
                    </div>

                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">
                          Total
                        </span>

                        <span className="font-bold text-gray-900">
                          ${total}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </motion.div>
          )}

          {/* ========================================
              STEP 4 — CONFIRMATION
          ======================================== */}

          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
              }}
              className="mx-auto max-w-2xl"
            >
              <section className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
                {/* SUCCESS ICON */}

                <motion.div
                  initial={{
                    scale: 0,
                  }}
                  animate={{
                    scale: 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 180,
                    damping: 12,
                  }}
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-900 text-white"
                >
                  <Check size={36} />
                </motion.div>

                {/* TITLE */}

                <motion.h1
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.2,
                  }}
                  className="mt-6 text-3xl font-bold tracking-tight text-gray-900"
                >
                  Booking confirmed!
                </motion.h1>

                <motion.p
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{
                    delay: 0.3,
                  }}
                  className="mt-3 text-sm leading-6 text-gray-500"
                >
                  Your stay has been successfully reserved. We hope you have an
                  amazing trip.
                </motion.p>

                {/* REFERENCE */}

                <div className="mt-8 rounded-2xl bg-gray-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Booking reference
                  </p>

                  <p className="mt-2 text-xl font-bold tracking-wider text-gray-900">
                    {bookingReference}
                  </p>
                </div>

                {/* BOOKING DETAILS */}

                <div className="mt-6 rounded-2xl border border-gray-200 p-5 text-left">
                  <div className="flex gap-4">
                    <img
                      src={listing.images?.[0]}
                      alt={listing.title}
                      className="h-20 w-20 rounded-xl object-cover"
                    />

                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {listing.title}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {listing.type}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        ★ {listing.rating}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-gray-500">Check-in</p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {checkIn}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Check-out</p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {checkOut}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Guests</p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {guests}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
                    <span className="font-semibold text-gray-900">
                      Total paid
                    </span>

                    <span className="text-lg font-bold text-gray-900">
                      ${total}
                    </span>
                  </div>
                </div>

                {/* BACK TO LISTING */}

                <button
                  type="button"
                  onClick={() => navigate(`/listing/${listing.id}`)}
                  className="mt-8 inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Back to Listing
                </button>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default Booking;
