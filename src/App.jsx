import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import Navbar from "./Components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import MovieDetailsPage from "./pages/MovieDetailsPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <WishlistProvider>
        <main>
          <Navbar />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </WishlistProvider>
    </BrowserRouter>
  );
};

export default App;
