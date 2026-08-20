// Shared TMDB API configuration and helpers for the whole app.
// Single source of truth so the API key is never duplicated across files.

export const API_BASE_URL = 'https://api.themoviedb.org/3';

export const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const API_OPTION = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

// ---- Image URL helpers (return null when no path so callers can show a fallback) ----
const IMG_BASE = 'https://image.tmdb.org/t/p';

export const posterUrl = (path, size = 'w500') => (path ? `${IMG_BASE}/${size}${path}` : null);
export const backdropUrl = (path, size = 'original') => (path ? `${IMG_BASE}/${size}${path}` : null);
export const profileUrl = (path, size = 'w185') => (path ? `${IMG_BASE}/${size}${path}` : null);
export const logoUrl = (path, size = 'w200') => (path ? `${IMG_BASE}/${size}${path}` : null);

// Generic fetch that reuses the shared auth options and supports aborting.
export const tmdbFetch = async (endpoint, signal) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, { ...API_OPTION, signal });
  if (!response.ok) {
    const err = new Error(`TMDB request failed (${response.status})`);
    err.status = response.status;
    throw err;
  }
  return response.json();
};

// Movie details + credits + similar + recommendations in a single request.
export const fetchMovieDetails = (id, signal) =>
  tmdbFetch(`/movie/${id}?append_to_response=credits,similar,recommendations`, signal);
