import React from 'react';

function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="search-wrapper">
      <span className="search-icon">⌕</span>
      <input
        className="search-input"
        type="text"
        placeholder="SEARCH INTEL / DIRECTIVES..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
