import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { backdropUrl, posterUrl } from '../api/tmdb.js';
import WishlistButton from './WishlistButton.jsx';
import PurchaseModal from './PurchaseModal.jsx';
import CastCard from './CastCard.jsx';
import ProductionCard from './ProductionCard.jsx';
import MovieCard from './MovieCard.jsx';

const OVERVIEW_LIMIT = 300;

const CREW_JOBS = [
    { job: 'Director', label: 'Director' },
    { job: 'Screenplay', label: 'Screenplay' },
    { job: 'Writer', label: 'Writer' },
    { job: 'Story', label: 'Story' },
    { job: 'Producer', label: 'Producer' },
    { job: 'Director of Photography', label: 'Cinematographer' },
    { job: 'Editor', label: 'Editor' },
    { job: 'Original Music Composer', label: 'Composer' },
];

const formatRuntime = (min) => {
    if (!min || min <= 0) return null;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h ? `${h}h ${m}m` : `${m}m`;
};

const formatMoney = (n) => {
    if (!n || n <= 0) return null;
    return '$' + Number(n).toLocaleString('en-US');
};

const formatDate = (str) => {
    if (!str) return null;
    const d = new Date(str);
    if (Number.isNaN(d.getTime())) return str;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const MovieDetails = ({ movie }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [expanded, setExpanded] = useState(false);
    const [posterFailed, setPosterFailed] = useState(false);
    const [showPurchase, setShowPurchase] = useState(false);

    const goBack = () => {
        if (location.key && location.key !== 'default') navigate(-1);
        else navigate('/');
    };

    const title = movie.title || movie.name || 'Untitled';
    const backdrop = backdropUrl(movie.backdrop_path, 'original');
    const poster = posterUrl(movie.poster_path, 'w500');
    const showPoster = poster && !posterFailed;

    const rating = typeof movie.vote_average === 'number' && movie.vote_average > 0
        ? movie.vote_average.toFixed(1)
        : null;
    const genres = movie.genres || [];
    const runtime = formatRuntime(movie.runtime);
    const releaseDate = formatDate(movie.release_date);
    const budget = formatMoney(movie.budget);
    const revenue = formatMoney(movie.revenue);

    const language =
        movie.spoken_languages?.find((l) => l.iso_639_1 === movie.original_language)?.english_name ||
        (movie.original_language ? movie.original_language.toUpperCase() : null);

    const overview = movie.overview || '';
    const isLong = overview.length > OVERVIEW_LIMIT;
    const shownOverview = !isLong || expanded ? overview : `${overview.slice(0, OVERVIEW_LIMIT).trimEnd()}…`;

    // Cast: keep the most prominent 12.
    const cast = (movie.credits?.cast || []).slice(0, 12);

    // Crew: pick a few important roles only.
    const crewList = CREW_JOBS
        .map(({ job, label }) => {
            const names = [
                ...new Set((movie.credits?.crew || []).filter((c) => c.job === job).map((c) => c.name)),
            ];
            return names.length ? { label, names: names.slice(0, 2).join(', ') } : null;
        })
        .filter(Boolean);

    const companies = movie.production_companies || [];

    // Recommendations first, then similar; de-duped and excluding this movie.
    const seen = new Set([movie.id]);
    const recommended = [];
    for (const m of [
        ...(movie.recommendations?.results || []),
        ...(movie.similar?.results || []),
    ]) {
        if (m && !seen.has(m.id)) {
            seen.add(m.id);
            recommended.push(m);
        }
    }
    const recommendedTop = recommended.slice(0, 12);

    return (
        <div className="details">
            {/* ---------- HERO ---------- */}
            <section className={`details-hero${backdrop ? '' : ' details-hero-nobg'}`}>
                {backdrop && (
                    <div
                        className="details-backdrop"
                        style={{ backgroundImage: `url(${backdrop})` }}
                        aria-hidden="true"
                    />
                )}
                <div className="details-backdrop-overlay" aria-hidden="true" />

                <button type="button" className="details-back" onClick={goBack}>
                    <span aria-hidden="true">←</span> Back
                </button>

                <div className="details-hero-inner">
                    <div className="details-poster-wrap">
                        {showPoster ? (
                            <img
                                className="details-poster"
                                src={poster}
                                alt={title}
                                onError={() => setPosterFailed(true)}
                            />
                        ) : (
                            <div className="details-poster details-poster-fallback">
                                <span>{title}</span>
                            </div>
                        )}
                    </div>

                    <div className="details-info">
                        <h1 className="details-title">{title}</h1>
                        {movie.original_title && movie.original_title !== title && (
                            <p className="details-original-title">{movie.original_title}</p>
                        )}
                        {movie.tagline && <p className="details-tagline">“{movie.tagline}”</p>}

                        <div className="details-meta">
                            {rating && (
                                <span className="details-rating">
                                    <img src="/Rating.svg" alt="" /> {rating}
                                    {movie.vote_count > 0 && (
                                        <span className="details-votes">({movie.vote_count.toLocaleString('en-US')})</span>
                                    )}
                                </span>
                            )}
                            {releaseDate && <span className="details-meta-item">{releaseDate}</span>}
                            {runtime && <span className="details-meta-item">{runtime}</span>}
                            {language && <span className="details-meta-item">{language}</span>}
                        </div>

                        {genres.length > 0 && (
                            <div className="details-genres">
                                {genres.map((g) => (
                                    <span className="details-genre" key={g.id}>{g.name}</span>
                                ))}
                            </div>
                        )}

                        {overview && <p className="details-hero-overview">{overview}</p>}

                        <div className="details-actions">
                            <WishlistButton movie={movie} />
                            <button
                                type="button"
                                className="zed-btn zed-btn-purchase"
                                onClick={() => setShowPurchase(true)}
                            >
                                Purchase
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="details-body">
                {/* ---------- MOVIE DETAILS ---------- */}
                <section className="details-section">
                    <h2 className="section-title">Movie Details</h2>

                    {overview && (
                        <div className="details-overview-block">
                            <h3 className="details-subtitle">Overview</h3>
                            <p className="details-overview">{shownOverview}</p>
                            {isLong && (
                                <button
                                    type="button"
                                    className="details-readmore"
                                    onClick={() => setExpanded((v) => !v)}
                                >
                                    {expanded ? 'Read Less' : 'Read More'}
                                </button>
                            )}
                        </div>
                    )}

                    <dl className="details-facts">
                        {genres.length > 0 && (
                            <div className="fact">
                                <dt>Genres</dt>
                                <dd>{genres.map((g) => g.name).join(', ')}</dd>
                            </div>
                        )}
                        {releaseDate && (
                            <div className="fact">
                                <dt>Release Date</dt>
                                <dd>{releaseDate}</dd>
                            </div>
                        )}
                        {runtime && (
                            <div className="fact">
                                <dt>Runtime</dt>
                                <dd>{runtime}</dd>
                            </div>
                        )}
                        {language && (
                            <div className="fact">
                                <dt>Language</dt>
                                <dd>{language}</dd>
                            </div>
                        )}
                        {movie.status && (
                            <div className="fact">
                                <dt>Status</dt>
                                <dd>{movie.status}</dd>
                            </div>
                        )}
                        {typeof movie.popularity === 'number' && movie.popularity > 0 && (
                            <div className="fact">
                                <dt>Popularity</dt>
                                <dd>{Math.round(movie.popularity).toLocaleString('en-US')}</dd>
                            </div>
                        )}
                        {budget && (
                            <div className="fact">
                                <dt>Budget</dt>
                                <dd>{budget}</dd>
                            </div>
                        )}
                        {revenue && (
                            <div className="fact">
                                <dt>Revenue</dt>
                                <dd>{revenue}</dd>
                            </div>
                        )}
                    </dl>
                </section>

                {/* ---------- CREW ---------- */}
                {crewList.length > 0 && (
                    <section className="details-section">
                        <h2 className="section-title">Crew</h2>
                        <div className="crew-grid">
                            {crewList.map((c) => (
                                <div className="crew-item" key={c.label}>
                                    <p className="crew-role">{c.label}</p>
                                    <p className="crew-name">{c.names}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ---------- CAST ---------- */}
                {cast.length > 0 && (
                    <section className="details-section">
                        <h2 className="section-title">Cast</h2>
                        <div className="cast-row">
                            {cast.map((person) => (
                                <CastCard key={person.cast_id ?? person.credit_id ?? person.id} person={person} />
                            ))}
                        </div>
                    </section>
                )}

                {/* ---------- PRODUCTION ---------- */}
                {companies.length > 0 && (
                    <section className="details-section">
                        <h2 className="section-title">Production</h2>
                        <div className="prod-grid">
                            {companies.map((company) => (
                                <ProductionCard key={company.id} company={company} />
                            ))}
                        </div>
                    </section>
                )}

                {/* ---------- RECOMMENDATIONS ---------- */}
                {recommendedTop.length > 0 && (
                    <section className="details-section">
                        <h2 className="section-title">You May Also Like</h2>
                        <ul className="recommend-grid">
                            {recommendedTop.map((rec) => (
                                <MovieCard key={rec.id} movie={rec} />
                            ))}
                        </ul>
                    </section>
                )}
            </div>

            <PurchaseModal
                movie={movie}
                isOpen={showPurchase}
                onClose={() => setShowPurchase(false)}
            />
        </div>
    );
};

export default MovieDetails;
