import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPets } from '../api';
import { useT } from '../i18n/LanguageContext';
import PetCard from '../components/PetCard';

function Home() {
  const [featuredPets, setFeaturedPets] = useState([]);
  const t = useT();

  useEffect(() => {
    fetchPets().then((pets) => setFeaturedPets(pets.filter((p) => p.featured).slice(0, 3)));
  }, []);

  return (
    <div className="container page-content">
      <section className="hero-section">
        <div>
          <p className="eyebrow">{t('home.eyebrow')}</p>
          <h2>{t('home.heading')}</h2>
          <p>{t('home.description')}</p>
          <div className="hero-actions">
            <Link to="/pets" className="button primary-button">{t('home.cta.browse')}</Link>
            <Link to="/faq" className="button secondary-button">{t('home.cta.learn')}</Link>
          </div>
        </div>
        <img
          className="hero-image"
          src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&q=80"
          alt="Dog and cat together"
        />
      </section>

      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t('home.featured.eyebrow')}</p>
            <h2>{t('home.featured.heading')}</h2>
          </div>
          <Link to="/pets" className="text-link">{t('home.featured.seeAll')}</Link>
        </div>

        <div className="pet-grid">
          {featuredPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
