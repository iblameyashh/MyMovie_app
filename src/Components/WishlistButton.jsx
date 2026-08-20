import { useWishlist } from '../context/WishlistContext.jsx';

const WishlistButton = ({ movie, className = '' }) => {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const added = movie ? isInWishlist(movie.id) : false;

    return (
        <button
            type="button"
            onClick={() => toggleWishlist(movie)}
            className={`zed-btn zed-btn-wishlist${added ? ' is-added' : ''} ${className}`}
            aria-pressed={added}
        >
            <span className="zed-btn-icon" aria-hidden="true">{added ? '✓' : '♡'}</span>
            <span>{added ? 'Added to Wishlist' : 'Add to Wishlist'}</span>
        </button>
    );
};

export default WishlistButton;
