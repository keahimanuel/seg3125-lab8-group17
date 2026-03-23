import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { pets } from '../data/pets';
import ProfileTabs from '../components/ProfileTabs';

function PetProfile() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('about');

  const pet = useMemo(() => pets.find((item) => item.id === id), [id]);

  if (!pet) {
    return (
      <div className="container page-content empty-state">
        <h2>Pet not found</h2>
        <Link to="/pets" className="button primary-button">Back to Browse Pets</Link>
      </div>
    );
  }

  return (
    <div className="container page-content">
      <section className="profile-layout">
        <img src={pet.image} alt={pet.name} className="profile-image" />

        <div className="profile-summary card">
          <p className="eyebrow">Absorbing information</p>
          <h2>{pet.name}</h2>
          <p>{pet.species} • {pet.breed}</p>
          <p>{pet.age} • {pet.gender} • {pet.size}</p>
          <p className="muted-text">Location: {pet.location}</p>
          <span className={`status-badge ${pet.status.toLowerCase()}`}>{pet.status}</span>

          <div className="profile-actions">
            <Link to={`/apply/${pet.id}`} className="button primary-button">Start Adoption</Link>
            <Link to="/messages" className="button secondary-button">Ask a Question</Link>
          </div>
        </div>
      </section>

      <section className="card">
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} pet={pet} />
      </section>
    </div>
  );
}

export default PetProfile;
