import { create } from "zustand";

const useBookingStore = create((set) => ({
  currentStep: 1,

  listingId: null,

  checkIn: "",
  checkOut: "",
  guests: 1,

  setListingId: (listingId) =>
    set({
      listingId,
    }),

  setCurrentStep: (step) =>
    set({
      currentStep: step,
    }),

  setDates: (checkIn, checkOut) =>
    set({
      checkIn,
      checkOut,
    }),

  setGuests: (guests) =>
    set({
      guests: Math.max(1, guests),
    }),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 4),
    })),

  previousStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),

  resetBooking: () =>
    set({
      currentStep: 1,
      listingId: null,
      checkIn: "",
      checkOut: "",
      guests: 1,
    }),

  startNewBooking: (listingId) =>
    set({
      currentStep: 1,
      listingId,
      checkIn: "",
      checkOut: "",
      guests: 1,
    }),
}));

export default useBookingStore;
