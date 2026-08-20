import { useState } from 'react';
import { logoUrl } from '../api/tmdb.js';

const ProductionCard = ({ company }) => {
    const logo = logoUrl(company.logo_path);
    const [failed, setFailed] = useState(false);
    const showLogo = logo && !failed;

    return (
        <div className="prod-card">
            {showLogo ? (
                <div className="prod-logo-chip">
                    <img
                        className="prod-logo"
                        src={logo}
                        alt={company.name}
                        loading="lazy"
                        onError={() => setFailed(true)}
                    />
                </div>
            ) : (
                <div className="prod-logo-chip prod-logo-fallback">
                    <span>{company.name}</span>
                </div>
            )}

            <div className="prod-meta">
                <p className="prod-name">{company.name}</p>
                {company.origin_country && <p className="prod-country">{company.origin_country}</p>}
            </div>
        </div>
    );
};

export default ProductionCard;
