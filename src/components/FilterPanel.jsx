import { useT } from '../i18n/LanguageContext';

function FilterPanel({ filters, onFilterChange, sortValue, onSortChange }) {
  const t = useT();
  return (
    <section className="filter-panel">
      <div>
        <label>{t('filter.species')}</label>
        <select value={filters.species} onChange={(e) => onFilterChange('species', e.target.value)}>
          <option value="All">{t('filter.all')}</option>
          <option value="Dog">{t('filter.dog')}</option>
          <option value="Cat">{t('filter.cat')}</option>
          <option value="Rabbit">{t('filter.rabbit')}</option>
        </select>
      </div>

      <div>
        <label>{t('filter.status')}</label>
        <select value={filters.status} onChange={(e) => onFilterChange('status', e.target.value)}>
          <option value="All">{t('filter.all')}</option>
          <option value="Available">{t('filter.available')}</option>
          <option value="Pending">{t('filter.pending')}</option>
        </select>
      </div>

      <div>
        <label>{t('filter.size')}</label>
        <select value={filters.size} onChange={(e) => onFilterChange('size', e.target.value)}>
          <option value="All">{t('filter.all')}</option>
          <option value="Small">{t('filter.small')}</option>
          <option value="Medium">{t('filter.medium')}</option>
          <option value="Large">{t('filter.large')}</option>
        </select>
      </div>

      <div>
        <label>{t('filter.sortBy')}</label>
        <select value={sortValue} onChange={(e) => onSortChange(e.target.value)}>
          <option value="name">{t('filter.byName')}</option>
          <option value="species">{t('filter.bySpecies')}</option>
          <option value="status">{t('filter.byStatus')}</option>
        </select>
      </div>
    </section>
  );
}

export default FilterPanel;
