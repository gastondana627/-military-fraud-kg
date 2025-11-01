import React, { useState } from 'react';

export default function AdvancedFilters({ onFilterChange, stats }) {
  const [activeFilters, setActiveFilters] = useState([]);

  const filterOptions = [
    { id: 'amount-1b', label: 'Fraud > $1B', icon: '💰' },
    { id: 'amount-100m', label: 'Fraud > $100M', icon: '💵' },
    { id: 'post-2020', label: 'Post-2020', icon: '📅' },
    { id: 'high-recovery', label: 'High Recovery', icon: '📈' },
    { id: 'dod-related', label: 'DoD Related', icon: '🎖️' },
    { id: 'contractor', label: 'Contractor Cases', icon: '🏢' },
    { id: 'critical', label: 'Critical Only', icon: '🔴' },
    { id: 'resolved', label: 'Resolved Cases', icon: '✓' },
  ];

  const toggleFilter = (filterId) => {
    let updatedFilters;
    if (activeFilters.includes(filterId)) {
      updatedFilters = activeFilters.filter(f => f !== filterId);
    } else {
      updatedFilters = [...activeFilters, filterId];
    }
    setActiveFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearAll = () => {
    setActiveFilters([]);
    onFilterChange([]);
  };

  return (
    <div style={{ padding: '16px', background: 'rgba(26, 71, 42, 0.2)', borderRadius: '8px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 style={{ margin: 0, color: '#d4af37', fontSize: '13px', fontWeight: 600 }}>
          🔍 ADVANCED FILTERS
        </h4>
        {activeFilters.length > 0 && (
          <button
            onClick={clearAll}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#d4af37',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              textDecoration: 'underline',
            }}
          >
            Clear All
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {filterOptions.map(filter => (
          <button
            key={filter.id}
            onClick={() => toggleFilter(filter.id)}
            className="filter-badge"
            style={{
              opacity: activeFilters.includes(filter.id) ? 1 : 0.6,
              border: activeFilters.includes(filter.id) ? '2px solid #d4af37' : '1px solid #d4af37',
            }}
          >
            <span>{filter.icon}</span>
            <span>{filter.label}</span>
          </button>
        ))}
      </div>

      {activeFilters.length > 0 && (
        <div style={{
          marginTop: '12px',
          padding: '10px',
          background: 'rgba(212, 175, 55, 0.1)',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#d4af37',
        }}>
          {activeFilters.length} filter{activeFilters.length !== 1 ? 's' : ''} active
        </div>
      )}
    </div>
  );
}
