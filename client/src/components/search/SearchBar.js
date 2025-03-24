// src/components/search/SearchBar.js
import React, { useState, useEffect, useRef } from 'react';
import './SearchBar.css';

function SearchBar({ products, navigate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const searchRef = useRef(null);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSuggestions([]);
      setIsResultsVisible(false);
      return;
    }

    // Filter products that match the search term
    const filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort by relevance (exact name match first, then partial name match, then description match)
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      const aNameMatch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
      const bNameMatch = b.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      
      return 0;
    });

    // Limit to top 5 suggestions
    setSuggestions(sortedProducts.slice(0, 5));
    setIsResultsVisible(true);
  }, [searchTerm, products]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsResultsVisible(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      // Navigate to products page with search filter
      navigate('products', { search: searchTerm });
      setIsResultsVisible(false);
      setIsSearchOpen(false);
    }
  };

  const handleSuggestionClick = (productId) => {
    // Navigate to product detail page (could be modified to navigate to products page with filter)
    // For now, we'll just alert since we don't have product detail pages
    alert(`Navigating to product ${productId}`);
    setIsResultsVisible(false);
    setSearchTerm('');
    setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Focus the search input when opening
      setTimeout(() => {
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.focus();
      }, 100);
    } else {
      // Clear search when closing
      setSearchTerm('');
      setSuggestions([]);
      setIsResultsVisible(false);
    }
  };

  return (
    <div className="search-container" ref={searchRef}>
      <button 
        className={`search-icon ${isSearchOpen ? 'active' : ''}`} 
        onClick={toggleSearch}
        aria-label="Search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
      
      <div className={`search-form-container ${isSearchOpen ? 'open' : ''}`}>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            id="search-input"
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label="Search products"
          />
          <button type="submit" className="search-submit" aria-label="Submit search">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>
        
        {isResultsVisible && suggestions.length > 0 && (
          <div className="search-suggestions">
            {suggestions.map(product => (
              <div 
                key={product.id}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(product.id)}
              >
                <div className="suggestion-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="suggestion-details">
                  <h4>{product.name}</h4>
                  <p className="suggestion-category">{product.category}</p>
                  <p className="suggestion-price">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchBar;