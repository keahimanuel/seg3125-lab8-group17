import { useEffect, useState } from 'react';
import { fetchCareGuides } from '../api';

function CareGuides() {
  const [guides, setGuides] = useState([]);

  useEffect(() => {
    fetchCareGuides().then(setGuides);
  }, []);

  return (
    <div className="container page-content">
      <section className="page-header-block">
        <p className="eyebrow">Preparation</p>
        <h2>Care Guides</h2>
        <p>Helpful resources to prepare adopters for a smooth transition at home.</p>
      </section>

      <section className="guides-grid">
        {guides.map((guide) => (
          <article key={guide.care_guide_id} className="card guide-card">
            <h3>{guide.title}</h3>
            {guide.feeding_info  && <p><strong>Feeding:</strong> {guide.feeding_info}</p>}
            {guide.exercise_info && <p><strong>Exercise:</strong> {guide.exercise_info}</p>}
            {guide.grooming_info && <p><strong>Grooming:</strong> {guide.grooming_info}</p>}
            {guide.health_info   && <p><strong>Health:</strong> {guide.health_info}</p>}
          </article>
        ))}
      </section>
    </div>
  );
}

export default CareGuides;
