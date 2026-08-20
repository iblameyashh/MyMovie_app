import { Link, useLocation } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';

const Navbar = () => {
    const { count } = useWishlist();
    const { pathname } = useLocation();
    const onWishlist = pathname === '/wishlist';

    return (
        <nav className="zed-navbar">
            <div className="zed-navbar-inner">
                <Link to="/" className="zed-brand" aria-label="Zeltron home">
                    <img src="/logo.png" alt="Zeltron" className="zed-brand-logo" />
                    <span className="zed-brand-name">ZELTRON</span>
                </Link>

                <Link
                    to="/wishlist"
                    className={`zed-wishlist-link${onWishlist ? ' is-active' : ''}`}
                    aria-label={`Wishlist${count ? `, ${count} saved` : ''}`}
                >
                    <span className="zed-heart" aria-hidden="true">♥</span>
                    <span className="zed-wishlist-text">Wishlist</span>
                    {count > 0 && <span className="zed-wishlist-badge">{count}</span>}
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
