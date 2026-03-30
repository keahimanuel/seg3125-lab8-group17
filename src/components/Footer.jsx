import { useT } from '../i18n/LanguageContext';

function Footer() {
  const t = useT();
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <p>{t('footer.rights')}</p>
        <p>{t('footer.credit')}</p>
      </div>
    </footer>
  );
}

export default Footer;
