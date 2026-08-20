import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'zeltron_wishlist';

const WishlistContext = createContext(null);

const readFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// Keep only the fields we actually need to re-render a MovieCard later.
const slim = (movie) => ({
  id: movie.id,
  title: movie.title || movie.name || '',
  poster_path: movie.poster_path ?? null,
  vote_average: typeof movie.vote_average === 'number' ? movie.vote_average : null,
  release_date: movie.release_date || movie.first_air_date || '',
  original_language: movie.original_language || '',
});

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState(readFromStorage);

  // Persist whenever the list changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage might be unavailable (private mode) — fail silently */
    }
  }, [items]);

  // Keep multiple tabs in sync.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setItems(readFromStorage());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isInWishlist = useCallback((id) => items.some((m) => m.id === id), [items]);

  const addToWishlist = useCallback((movie) => {
    if (!movie || movie.id == null) return;
    setItems((prev) => (prev.some((m) => m.id === movie.id) ? prev : [slim(movie), ...prev]));
  }, []);

  const removeFromWishlist = useCallback((id) => {
    setItems((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const toggleWishlist = useCallback((movie) => {
    if (!movie || movie.id == null) return;
    setItems((prev) =>
      prev.some((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [slim(movie), ...prev]
    );
  }, []);

  const clearWishlist = useCallback(() => setItems([]), []);

  const value = {
    wishlist: items,
    count: items.length,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return ctx;
};

export default WishlistContext;
