import React, { useState } from 'react';

export default function CollapsibleSidebar({ isOpen, onToggle, children, darkMode }) {
  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        onClick={onToggle}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 450,
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1a472a 0%, #0f2e1a 100%)',
          border: '3px solid #d4af37',
          color: '#d4af37',
          cursor: 'pointer',
          fontSize: '24px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
          transition: 'all 0.3s ease',
          animation: 'pulse 2s infinite',
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 6px 25px rgba(212, 175, 55, 0.6)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.4)';
        }}
        title={isOpen ? 'Hide Sidebar' : 'Show Sidebar'}
      >
        {isOpen ? '❌' : '☰'}
      </button>

      {/* Sidebar Overlay (when open) */}
      {isOpen && (
        <div
          onClick={onToggle}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 349,
          }}
        />
      )}

      {/* Collapsible Sidebar */}
      <div
        style={{
          position: 'fixed',
          right: 0,
          top: '70px',
          bottom: 0,
          width: '420px',
          background: darkMode ? 'linear-gradient(to bottom, #2d2d2d 0%, #1e1e1e 100%)' : 'linear-gradient(to bottom, #ffffff 0%, #f8f9fb 100%)',
          borderLeftColor: darkMode ? '#444' : '#e8eaed',
          borderLeft: `2px solid ${darkMode ? '#444' : '#e8eaed'}`,
          zIndex: 350,
          overflowY: 'auto',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          boxShadow: isOpen ? '-4px 0 20px rgba(0, 0, 0, 0.5)' : 'none',
        }}
      >
        {children}
      </div>
    </>
  );
}
