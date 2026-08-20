import { useState } from 'react';
import { profileUrl } from '../api/tmdb.js';

const initialsOf = (name = '') =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase() || '?';

const CastCard = ({ person }) => {
    const photo = profileUrl(person.profile_path);
    const [failed, setFailed] = useState(false);
    const showPhoto = photo && !failed;

    return (
        <div className="cast-card">
            {showPhoto ? (
                <img
                    className="cast-photo"
                    src={photo}
                    alt={person.name}
                    loading="lazy"
                    onError={() => setFailed(true)}
                />
            ) : (
                <div className="cast-photo cast-photo-fallback" aria-hidden="true">
                    <span>{initialsOf(person.name)}</span>
                </div>
            )}
            <p className="cast-name">{person.name}</p>
            {person.character && <p className="cast-character">{person.character}</p>}
        </div>
    );
};

export default CastCard;
