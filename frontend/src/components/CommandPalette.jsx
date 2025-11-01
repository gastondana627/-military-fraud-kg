import React, { useState, useEffect } from 'react';
import { fuzzySearch } from '../hooks/useCommandPalette';
import { COMMANDS } from '../constants/fraudConfig';

export default function CommandPalette({ isOpen, onClose, onCommandSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = fuzzySearch(searchQuery, COMMANDS, 'label');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          onCommandSelect(filteredCommands[selectedIndex]);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose, onCommandSelect]);

  if (!isOpen) return null;

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div className="command-palette" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          className="command-palette-input"
          placeholder="Type a command... (Cmd+K)"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedIndex(0);
          }}
          autoFocus
        />
        
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {filteredCommands.length > 0 ? (
            filteredCommands.map((command, idx) => (
              <div
                key={command.id}
                className="command-item"
                style={{
                  background: idx === selectedIndex ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                  borderLeft: idx === selectedIndex ? '3px solid #d4af37' : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => {
                  onCommandSelect(command);
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <span className="command-item-icon">{command.icon}</span>
                <span className="command-item-label">{command.label}</span>
              </div>
            ))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '14px' }}>
              No commands found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
