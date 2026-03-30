import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageContext';

function PetCard({ pet }) {
  const t = useT();
  return (
    <article className="pet-card">
      <img src={pet.image} alt={pet.name} className="pet-card-image" />
      <div className="pet-card-body">
        <div className="pet-card-top">
          <h3>{pet.name}</h3>
          <span className={`status-badge ${pet.status.toLowerCase()}`}>{pet.status}</span>
        </div>
        <p>{pet.species} • {pet.breed}</p>
        <p>{pet.age} • {pet.gender} • {pet.size}</p>
        <p className="muted-text">{pet.location}</p>
        <div className="pet-card-actions">
          <Link to={`/pets/${pet.id}`} className="button secondary-button">{t('petCard.viewProfile')}</Link>
          <Link to={`/apply/${pet.id}`} className="button primary-button">{t('petCard.apply')}</Link>
        </div>
      </div>
    </article>
  );
}

export default PetCard;
