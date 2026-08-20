import { useState } from 'react';
import { Link } from 'react-router-dom';
import { posterUrl } from '../api/tmdb.js';

const MovieCard = ({ movie }) => {
    const { id, title, name, vote_average, poster_path, original_language } = movie;
    const displayTitle = title || name || 'Untitled';
    const poster = posterUrl(poster_path);

    const [imgFailed, setImgFailed] = useState(false);
    const showPoster = poster && !imgFailed;

    return (
        <Link to={`/movie/${id}`} className="movie-card" aria-label={`View details for ${displayTitle}`}>
            {showPoster ? (
                <img
                    src={poster}
                    alt={displayTitle}
                    loading="lazy"
                    onError={() => setImgFailed(true)}
                />
            ) : (
                <div className="movie-card-fallback">
                    <span>{displayTitle}</span>
                </div>
            )}

            <div className="mt-4">
                <h3>{displayTitle}</h3>
            </div>

            <div className='content'>
                <div className="rating">
                    <img src="/Rating.svg" alt="" />
                    <p>{typeof vote_average === 'number' ? vote_average.toFixed(1) : 'N/A'}</p>
                </div>
                <span style={{ fontSize: "1.2rem" }}>•</span>

                <p className="orginal_language">{(original_language || '').toUpperCase()}</p>
            </div>
        </Link>
    );
};

export default MovieCard;
