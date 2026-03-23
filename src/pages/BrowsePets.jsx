import { useMemo, useState } from 'react';
import PetCard from '../components/PetCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import { pets } from '../data/pets';

function BrowsePets() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ species: 'All', status: 'All', size: 'All' });
  const [sortValue, setSortValue] = useState('name');

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
  }, [searchTerm, filters, sortValue]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container page-content">
      <section className="page-header-block">
        <p className="eyebrow">Exploring</p>
        <h2>Browse Adoptable Pets</h2>
        <p>Search, filter, and compare pets to find a good match for your home and lifestyle.</p>
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
          <h3>No pets match your filters</h3>
          <p>Try changing the search term or selecting broader filter options.</p>
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
