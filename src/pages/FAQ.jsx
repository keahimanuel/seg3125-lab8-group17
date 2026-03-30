import { useT } from '../i18n/LanguageContext';

function FAQ() {
  const t = useT();

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
  ];

  return (
    <div className="container page-content">
      <section className="page-header-block">
        <p className="eyebrow">{t('faq.eyebrow')}</p>
        <h2>{t('faq.heading')}</h2>
        <p>{t('faq.description')}</p>
      </section>

      <section className="faq-list">
        {faqs.map((item) => (
          <article key={item.q} className="card faq-item">
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export default FAQ;
