import { useT } from '../i18n/LanguageContext';

function SearchBar({ value, onChange }) {
  const t = useT();
  return (
    <input
      className="search-input"
      type="text"
      placeholder={t('search.placeholder')}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default SearchBar;
