import { faqs } from '../data/faqs';

function FAQ() {
  return (
    <div className="container page-content">
      <section className="page-header-block">
        <p className="eyebrow">Support</p>
        <h2>Frequently Asked Questions</h2>
        <p>Answers to common questions about the adoption process and pet availability.</p>
      </section>

      <section className="faq-list">
        {faqs.map((item) => (
          <article key={item.question} className="card faq-item">
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export default FAQ;
