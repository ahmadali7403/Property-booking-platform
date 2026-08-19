import { create } from "zustand";

const initialFilters = {
  priceRange: [50, 500],
  propertyTypes: [],
  amenities: [],
  guests: {
    adults: 0,
    children: 0,
    infants: 0,
  },
};

const useFilterStore = create((set) => ({
  filters: initialFilters,

  setPriceRange: (priceRange) =>
    set((state) => ({
      filters: {
        ...state.filters,
        priceRange,
      },
    })),

  togglePropertyType: (type) =>
    set((state) => {
      const currentTypes = state.filters.propertyTypes;

      const propertyTypes = currentTypes.includes(type)
        ? currentTypes.filter((item) => item !== type)
        : [...currentTypes, type];

      return {
        filters: {
          ...state.filters,
          propertyTypes,
        },
      };
    }),

  toggleAmenity: (amenity) =>
    set((state) => {
      const currentAmenities = state.filters.amenities;

      const amenities = currentAmenities.includes(amenity)
        ? currentAmenities.filter((item) => item !== amenity)
        : [...currentAmenities, amenity];

      return {
        filters: {
          ...state.filters,
          amenities,
        },
      };
    }),

  updateGuestCount: (guestType, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        guests: {
          ...state.filters.guests,
          [guestType]: Math.max(0, value),
        },
      },
    })),

  clearFilters: () =>
    set({
      filters: initialFilters,
    }),
}));

export default useFilterStore;
