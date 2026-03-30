import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPets } from '../api';
import PetCard from '../components/PetCard';

function Home() {
  const [featuredPets, setFeaturedPets] = useState([]);

  useEffect(() => {
    fetchPets().then((pets) => setFeaturedPets(pets.filter((p) => p.featured).slice(0, 3)));
  }, []);

  return (
    <div className="container page-content">
      <section className="hero-section">
        <div>
          <p className="eyebrow">Adopt with confidence</p>
          <h2>Helping pets find safe, loving homes.</h2>
          <p>
            Browse adoptable pets, learn about their needs, and submit an application through a clear,
            guided experience.
          </p>
          <div className="hero-actions">
            <Link to="/pets" className="button primary-button">Browse Pets</Link>
            <Link to="/faq" className="button secondary-button">Learn More</Link>
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
            <p className="eyebrow">Featured pets</p>
            <h2>Meet pets ready for adoption</h2>
          </div>
          <Link to="/pets" className="text-link">See all pets</Link>
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
