import { useEffect, useMemo, useState } from 'react';
import { fetchPets } from '../api';
import { useT } from '../i18n/LanguageContext';
import PetCard from '../components/PetCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';

function BrowsePets() {
  const [pets, setPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ species: 'All', status: 'All', size: 'All' });
  const [sortValue, setSortValue] = useState('name');
  const t = useT();

  useEffect(() => {
    fetchPets().then(setPets);
  }, []);

  const filteredPets = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    const result = pets.filter((pet) => {
      const matchesSearch =
        pet.name.toLowerCase().includes(search) ||
        pet.species.toLowerCase().includes(search) ||
        pet.breed.toLowerCase().includes(search);

      const matchesSpecies = filters.species === 'All' || pet.species === filters.species;
      const matchesStatus = filters.status === 'All' || pet.status === filters.status;
      const matchesSize = filters.size === 'All' || pet.size === filters.size;

      return matchesSearch && matchesSpecies && matchesStatus && matchesSize;
    });

    return result.sort((a, b) => a[sortValue].localeCompare(b[sortValue]));
  }, [pets, searchTerm, filters, sortValue]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container page-content">
      <section className="page-header-block">
        <p className="eyebrow">{t('browse.eyebrow')}</p>
        <h2>{t('browse.heading')}</h2>
        <p>{t('browse.description')}</p>
      </section>

      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        sortValue={sortValue}
        onSortChange={setSortValue}
      />

      {filteredPets.length === 0 ? (
        <div className="empty-state">
          <h3>{t('browse.empty.heading')}</h3>
          <p>{t('browse.empty.body')}</p>
        </div>
      ) : (
        <div className="pet-grid">
          {filteredPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BrowsePets;
