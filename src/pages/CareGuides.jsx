import { useEffect, useState } from 'react';
import { fetchCareGuides } from '../api';
import { useT } from '../i18n/LanguageContext';

function CareGuides() {
  const [guides, setGuides] = useState([]);
  const t = useT();

  useEffect(() => {
    fetchCareGuides().then(setGuides);
  }, []);

  return (
    <div className="container page-content">
      <section className="page-header-block">
        <p className="eyebrow">{t('guides.eyebrow')}</p>
        <h2>{t('guides.heading')}</h2>
        <p>{t('guides.description')}</p>
      </section>

      <section className="guides-grid">
        {guides.map((guide) => (
          <article key={guide.care_guide_id} className="card guide-card">
            <h3>{guide.title}</h3>
            {guide.feeding_info  && <p><strong>{t('guides.feeding')}</strong> {guide.feeding_info}</p>}
            {guide.exercise_info && <p><strong>{t('guides.exercise')}</strong> {guide.exercise_info}</p>}
            {guide.grooming_info && <p><strong>{t('guides.grooming')}</strong> {guide.grooming_info}</p>}
            {guide.health_info   && <p><strong>{t('guides.health')}</strong> {guide.health_info}</p>}
          </article>
        ))}
      </section>
    </div>
  );
}

export default CareGuides;
