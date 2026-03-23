import { guides } from '../data/guides';

function CareGuides() {
  return (
    <div className="container page-content">
      <section className="page-header-block">
        <p className="eyebrow">Preparation</p>
        <h2>Care Guides</h2>
        <p>Helpful resources to prepare adopters for a smooth transition at home.</p>
      </section>

      <section className="guides-grid">
        {guides.map((guide) => (
          <article key={guide.id} className="card guide-card">
            <h3>{guide.title}</h3>
            <p>{guide.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export default CareGuides;
