import { Link } from 'react-router-dom';
import MovieCard from '../Components/MovieCard.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

const WishlistPage = () => {
    const { wishlist, removeFromWishlist, count } = useWishlist();

    return (
        <section className="wishlist-page">
            <div className="wishlist-head">
                <h2>My Wishlist</h2>
                {count > 0 && <span className="wishlist-count">{count} {count === 1 ? 'movie' : 'movies'}</span>}
            </div>

            {wishlist.length === 0 ? (
                <div className="wishlist-empty">
                    <div className="wishlist-empty-icon" aria-hidden="true">♡</div>
                    <p className="wishlist-empty-title">Your wishlist is empty</p>
                    <p className="wishlist-empty-sub">Start adding movies you love ❤️</p>
                    <Link to="/" className="zed-btn zed-btn-purchase wishlist-empty-cta">Browse Movies</Link>
                </div>
            ) : (
                <ul className="wishlist-grid">
                    {wishlist.map((movie) => (
                        <li key={movie.id} className="wishlist-item">
                            <MovieCard movie={movie} />
                            <button
                                type="button"
                                className="wishlist-remove"
                                onClick={() => removeFromWishlist(movie.id)}
                                aria-label={`Remove ${movie.title || 'movie'} from wishlist`}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default WishlistPage;
