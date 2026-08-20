import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Spinner from '../Components/spinner.jsx';
import MovieDetails from '../Components/MovieDetails.jsx';
import { fetchMovieDetails } from '../api/tmdb.js';

const MovieDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Guard against a non-numeric / missing id before hitting the API.
        if (!id || Number.isNaN(Number(id))) {
            setLoading(false);
            setError('Invalid movie ID.');
            setMovie(null);
            return undefined;
        }

        const controller = new AbortController();
        setLoading(true);
        setError('');
        setMovie(null);
        window.scrollTo({ top: 0, behavior: 'auto' });

        fetchMovieDetails(id, controller.signal)
            .then((data) => setMovie(data))
            .catch((err) => {
                if (err.name === 'AbortError') return;
                setError(err.status === 404 ? 'Movie not found.' : 'Failed to load movie details.');
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });

        return () => controller.abort();
    }, [id]);

    const goBack = () => {
        if (location.key && location.key !== 'default') navigate(-1);
        else navigate('/');
    };

    if (loading) {
        return (
            <div className="details-status">
                <Spinner />
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="details-status">
                <div className="details-error">
                    <h2>{error || 'Something went wrong.'}</h2>
                    <p>We couldn’t load this movie. It may have been removed or the link is incorrect.</p>
                    <div className="details-error-actions">
                        <button type="button" className="zed-btn zed-btn-purchase" onClick={goBack}>
                            Go Back
                        </button>
                        <button
                            type="button"
                            className="zed-btn zed-btn-wishlist"
                            onClick={() => navigate('/')}
                        >
                            Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return <MovieDetails movie={movie} />;
};

export default MovieDetailsPage;
