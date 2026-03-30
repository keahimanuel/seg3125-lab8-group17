import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchPet } from '../api';
import { useT } from '../i18n/LanguageContext';
import ProfileTabs from '../components/ProfileTabs';

function PetProfile() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const t = useT();

  useEffect(() => {
    setLoading(true);
    fetchPet(id).then((data) => {
      setPet(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="container page-content"><p>{t('profile.loading')}</p></div>;
  }

  if (!pet) {
    return (
      <div className="container page-content empty-state">
        <h2>{t('profile.notFound')}</h2>
        <Link to="/pets" className="button primary-button">{t('profile.back')}</Link>
      </div>
    );
  }

  return (
    <div className="container page-content">
      <section className="profile-layout">
        <img src={pet.image} alt={pet.name} className="profile-image" />

        <div className="profile-summary card">
          <p className="eyebrow">{t('profile.eyebrow')}</p>
          <h2>{pet.name}</h2>
          <p>{pet.species} • {pet.breed}</p>
          <p>{pet.age} • {pet.gender} • {pet.size}</p>
          <span className={`status-badge ${pet.status.toLowerCase()}`}>{pet.status}</span>

          <div className="profile-actions">
            <Link to={`/apply/${pet.id}`} className="button primary-button">{t('profile.adoption')}</Link>
            <Link to="/messages" className="button secondary-button">{t('profile.question')}</Link>
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
