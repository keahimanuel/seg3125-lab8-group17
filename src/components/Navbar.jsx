import { NavLink } from 'react-router-dom';
import { useLanguage, useT } from '../i18n/LanguageContext';

function Navbar() {
  const { lang, setLang } = useLanguage();
  const t = useT();

  return (
    <header className="site-header">
      <div className="container nav-bar">
        <NavLink to="/" className="brand-link">
          <span className="brand-mark">🐾</span>
          <div>
            <h1>Paws &amp; Home</h1>
            <p>{t('nav.tagline')}</p>
          </div>
        </NavLink>

        <nav className="nav-links">
          <NavLink to="/">{t('nav.home')}</NavLink>
          <NavLink to="/pets">{t('nav.browse')}</NavLink>
          <NavLink to="/guides">{t('nav.guides')}</NavLink>
          <NavLink to="/messages">{t('nav.messages')}</NavLink>
          <NavLink to="/faq">{t('nav.faq')}</NavLink>
          <button
            className="lang-toggle"
            onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
          >
            {lang === 'en' ? 'FR' : 'EN'}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
