import { create } from "zustand";

const STORAGE_KEY = "wishlist";

const getStoredWishlist = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load wishlist:", error);
    return [];
  }
};

const saveWishlist = (wishlist) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  } catch (error) {
    console.error("Failed to save wishlist:", error);
  }
};

const useWishlistStore = create((set, get) => ({
  wishlist: getStoredWishlist(),

  isSaved: (listingId) => {
    return get().wishlist.some((item) => item.id === listingId);
  },

  toggleWishlist: (listing) => {
    const currentWishlist = get().wishlist;

    const alreadySaved = currentWishlist.some((item) => item.id === listing.id);

    const updatedWishlist = alreadySaved
      ? currentWishlist.filter((item) => item.id !== listing.id)
      : [...currentWishlist, listing];

    saveWishlist(updatedWishlist);

    set({
      wishlist: updatedWishlist,
    });
  },

  removeFromWishlist: (listingId) => {
    const updatedWishlist = get().wishlist.filter(
      (item) => item.id !== listingId,
    );

    saveWishlist(updatedWishlist);

    set({
      wishlist: updatedWishlist,
    });
  },

  clearWishlist: () => {
    localStorage.removeItem(STORAGE_KEY);

    set({
      wishlist: [],
    });
  },
}));

export default useWishlistStore;
