import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { posterUrl } from '../api/tmdb.js';

const TrendingMovies = ({ movies = [], isLoading = false, errorMessage = '' }) => {
    const sliderRef = useRef(null);
    const isDragging = useRef(false);
    const hasDragged = useRef(false);
    const dragStartX = useRef(0);
    const dragStartScrollLeft = useRef(0);

    const scrollByPage = (direction) => {
        const slider = sliderRef.current;
        if (!slider) return;
        slider.scrollBy({ left: slider.clientWidth * 0.8 * direction, behavior: 'smooth' });
    };

    const handleMouseDown = (e) => {
        const slider = sliderRef.current;
        if (!slider) return;
        isDragging.current = true;
        hasDragged.current = false;
        slider.classList.add('dragging');
        dragStartX.current = e.pageX - slider.offsetLeft;
        dragStartScrollLeft.current = slider.scrollLeft;
    };

    const stopDragging = () => {
        const slider = sliderRef.current;
        isDragging.current = false;
        slider?.classList.remove('dragging');
    };

    const handleMouseMove = (e) => {
        const slider = sliderRef.current;
        if (!isDragging.current || !slider) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - dragStartX.current) * 1.2;
        if (Math.abs(walk) > 4) hasDragged.current = true;
        slider.scrollLeft = dragStartScrollLeft.current - walk;
    };

    // Prevent a drag from being treated as a click that navigates.
    const handleCardClick = (e) => {
        if (hasDragged.current) e.preventDefault();
    };

    if (isLoading) {
        return (
            <section className="trending">
                <div className="trending-header">
                    <h2>Trending Movies</h2>
                </div>
                <p className="trending-status">Loading trending movies...</p>
            </section>
        );
    }

    if (errorMessage) {
        return (
            <section className="trending">
                <div className="trending-header">
                    <h2>Trending Movies</h2>
                </div>
                <p className="trending-status">{errorMessage}</p>
            </section>
        );
    }

    if (!movies.length) {
        return null;
    }

    return (
        <section className="trending">
            <div className="trending-header">
                <h2>Trending Movies</h2>
            </div>

            <div className="trending-carousel">
                <button
                    type="button"
                    className="trending-nav trending-nav-left"
                    onClick={() => scrollByPage(-1)}
                    aria-label="Scroll trending movies left"
                >
                    &#8249;
                </button>

                <div
                    className="trending-slider"
                    ref={sliderRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={stopDragging}
                    onMouseUp={stopDragging}
                    onMouseMove={handleMouseMove}
                >
                    {movies.map((movie, index) => {
                        const poster = posterUrl(movie.poster_path);
                        const label = movie.title || movie.name || 'Movie';
                        return (
                            <Link
                                to={`/movie/${movie.id}`}
                                className="trending-card"
                                key={movie.id}
                                draggable="false"
                                onClick={handleCardClick}
                                aria-label={`View details for ${label}`}
                            >
                                <div className="trending-poster-wrap">
                                    {poster ? (
                                        <img
                                            className="trending-poster"
                                            src={poster}
                                            alt={label}
                                            loading="lazy"
                                            draggable="false"
                                        />
                                    ) : (
                                        <div className="trending-poster trending-poster-fallback">
                                            <span>{label}</span>
                                        </div>
                                    )}

                                    {typeof movie.vote_average === 'number' && movie.vote_average > 0 && (
                                        <div className="trending-rating">
                                            <img src="/Rating.svg" alt="" />
                                            <span>{movie.vote_average.toFixed(1)}</span>
                                        </div>
                                    )}
                                </div>

                                <p className="trending-rank">#{String(index + 1).padStart(2, '0')}</p>

                                <p className="trending-title">{label}</p>
                            </Link>
                        );
                    })}
                </div>

                <button
                    type="button"
                    className="trending-nav trending-nav-right"
                    onClick={() => scrollByPage(1)}
                    aria-label="Scroll trending movies right"
                >
                    &#8250;
                </button>
            </div>
        </section>
    );
};

export default TrendingMovies;
