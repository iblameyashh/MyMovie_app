import { useEffect, useState } from 'react';
import { posterUrl } from '../api/tmdb.js';

const PRICE = '₹199';

const PurchaseModal = ({ movie, isOpen, onClose }) => {
    // 'idle' | 'processing' | 'success'
    const [status, setStatus] = useState('idle');

    // Reset to a clean state every time the modal opens.
    useEffect(() => {
        if (isOpen) setStatus('idle');
    }, [isOpen]);

    // Lock body scroll + close on Escape while open.
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [isOpen, onClose]);

    if (!isOpen || !movie) return null;

    const poster = posterUrl(movie.poster_path);
    const title = movie.title || movie.name || 'this movie';

    const handleConfirm = () => {
        setStatus('processing');
        // Simulated purchase — no real payment data is collected.
        setTimeout(() => setStatus('success'), 1200);
    };

    return (
        <div
            className="zed-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Purchase movie"
            onClick={onClose}
        >
            <div className="zed-modal" onClick={(e) => e.stopPropagation()}>
                {status === 'success' ? (
                    <div className="zed-modal-success">
                        <div className="zed-modal-check" aria-hidden="true">✓</div>
                        <h3>Purchase Successful</h3>
                        <p>You now own <strong>{title}</strong>. Enjoy the show!</p>
                        <button type="button" className="zed-btn zed-btn-purchase" onClick={onClose}>
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <h3 className="zed-modal-title">Purchase Movie</h3>

                        <div className="zed-modal-body">
                            {poster ? (
                                <img className="zed-modal-poster" src={poster} alt={title} />
                            ) : (
                                <div className="zed-modal-poster zed-modal-poster-fallback">
                                    <span>{title}</span>
                                </div>
                            )}

                            <div className="zed-modal-info">
                                <p className="zed-modal-movie-title">{title}</p>
                                <p className="zed-modal-price-label">Price</p>
                                <p className="zed-modal-price">{PRICE}</p>
                                <p className="zed-modal-note">Demo checkout — no real payment is taken.</p>
                            </div>
                        </div>

                        <div className="zed-modal-actions">
                            <button
                                type="button"
                                className="zed-btn zed-btn-purchase"
                                onClick={handleConfirm}
                                disabled={status === 'processing'}
                            >
                                {status === 'processing' ? 'Processing…' : 'Confirm Purchase'}
                            </button>
                            <button
                                type="button"
                                className="zed-btn zed-btn-wishlist"
                                onClick={onClose}
                                disabled={status === 'processing'}
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PurchaseModal;
