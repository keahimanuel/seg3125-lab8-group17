function FilterPanel({ filters, onFilterChange, sortValue, onSortChange }) {
  return (
    <section className="filter-panel">
      <div>
        <label>Species</label>
        <select value={filters.species} onChange={(e) => onFilterChange('species', e.target.value)}>
          <option value="All">All</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Rabbit">Rabbit</option>
        </select>
      </div>

      <div>
        <label>Status</label>
        <select value={filters.status} onChange={(e) => onFilterChange('status', e.target.value)}>
          <option value="All">All</option>
          <option value="Available">Available</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <div>
        <label>Size</label>
        <select value={filters.size} onChange={(e) => onFilterChange('size', e.target.value)}>
          <option value="All">All</option>
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
        </select>
      </div>

      <div>
        <label>Sort by</label>
        <select value={sortValue} onChange={(e) => onSortChange(e.target.value)}>
          <option value="name">Name</option>
          <option value="species">Species</option>
          <option value="status">Status</option>
        </select>
      </div>
    </section>
  );
}

export default FilterPanel;
