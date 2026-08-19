import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Search from "./pages/Search";
import ListingDetail from "./pages/ListingDetail";
import Wishlist from "./pages/Wishlist";
import Booking from "./pages/Booking";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/search" replace />} />

        <Route path="/search" element={<Search />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
