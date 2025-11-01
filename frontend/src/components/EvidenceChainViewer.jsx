import React, { useState } from 'react';

export default function EvidenceChainViewer({ isOpen, onClose, selectedNode }) {
  const [expandedCards, setExpandedCards] = useState({});

  if (!isOpen || !selectedNode) return null;

  const toggleExpanded = (key) => {
    setExpandedCards(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const evidenceItems = [
    {
      id: 1,
      title: 'Initial Discovery',
      content: `Case identified on ${selectedNode.discovered_year || selectedNode.year || 'Unknown'}.`,
      date: selectedNode.discovered_year || selectedNode.year || 'N/A',
    },
    {
      id: 2,
      title: 'Investigation',
      content: selectedNode.fraud_period || selectedNode.time_period || 'Investigation period under review.',
      date: selectedNode.year || 'N/A',
    },
    {
      id: 3,
      title: 'Settlement/Conviction',
      content: `Settlement: ${selectedNode.settlement_amount || 'Pending'} | Sentence: ${selectedNode.sentence || 'Pending'}`,
      date: selectedNode.conviction_year || 'Pending',
    },
    {
      id: 4,
      title: 'Current Status',
      content: selectedNode.status || 'Investigation ongoing.',
      date: new Date().getFullYear(),
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">📋 Evidence Chain: {selectedNode.label}</div>
          <span className="modal-close" onClick={onClose}>✕</span>
        </div>

        <div className="modal-content">
          <div className="evidence-chain">
            {evidenceItems.map((item) => (
              <div key={item.id} className="evidence-card">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => toggleExpanded(item.id)}
                >
                  <div className="evidence-title">
                    {expandedCards[item.id] ? '▼' : '▶'} {item.title}
                  </div>
                  <div className="evidence-date">{item.date}</div>
                </div>

                {expandedCards[item.id] && (
                  <div className="evidence-content">
                    {item.content}
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedNode.sources && selectedNode.sources.length > 0 && (
            <div style={{
              marginTop: '20px',
              padding: '16px',
              background: 'rgba(212, 175, 55, 0.1)',
              borderRadius: '8px',
              borderLeft: '3px solid #d4af37',
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#d4af37' }}>📚 Associated Sources</h4>
              {selectedNode.sources.map((source, idx) => (
                <div key={idx} style={{ marginBottom: '10px', fontSize: '12px', color: '#e0e0e0' }}>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>{source.title}</div>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#2196F3', textDecoration: 'none', fontSize: '11px' }}
                  >
                    🔗 View Source
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
