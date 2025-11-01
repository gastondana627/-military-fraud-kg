import React, { useState } from 'react';
import {
  exportAsJSON,
  exportAsCSV,
  exportAsGraphML,
  printSummary,
  generateSummary,
} from '../utils/exportUtils';

export default function ExportReporting({ isOpen, onClose, nodes, edges, stats }) {
  const [exporting, setExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async (format) => {
    setExporting(true);
    try {
      switch (format) {
        case 'json':
          exportAsJSON(nodes, edges);
          break;
        case 'csv':
          exportAsCSV(nodes);
          break;
        case 'graphml':
          exportAsGraphML(nodes, edges);
          break;
        case 'pdf':
          alert('PDF export requires jsPDF library. Install with: npm install jspdf html2canvas');
          break;
        case 'print':
          printSummary(nodes, edges, stats);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error('Export error:', err);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const summary = generateSummary(nodes, edges, stats);

  const exportOptions = [
    { id: 'json', label: 'JSON Network', icon: '📄', desc: 'Complete node/edge data' },
    { id: 'csv', label: 'CSV Report', icon: '📊', desc: 'Cases as spreadsheet' },
    { id: 'graphml', label: 'GraphML Network', icon: '🕸️', desc: 'Network analysis format' },
    { id: 'pdf', label: 'PDF Report', icon: '📋', desc: 'Formatted investigation report' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">📤 Export & Reporting</div>
          <span className="modal-close" onClick={onClose}>✕</span>
        </div>

        <div className="modal-content">
          {/* Summary Section */}
          <div style={{
            background: 'rgba(26, 71, 42, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
            borderLeft: '3px solid #d4af37',
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#d4af37' }}>Investigation Summary</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
              <div>
                <span style={{ color: '#999' }}>Total Cases:</span>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#e0e0e0' }}>
                  {summary.statistics.total_cases}
                </div>
              </div>
              <div>
                <span style={{ color: '#999' }}>Total Fraud:</span>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#e0e0e0' }}>
                  {summary.statistics.total_fraud_amount}
                </div>
              </div>
              <div>
                <span style={{ color: '#999' }}>Total Recovered:</span>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#e0e0e0' }}>
                  {summary.statistics.total_recovered}
                </div>
              </div>
              <div>
                <span style={{ color: '#999' }}>Recovery Rate:</span>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#44ff44' }}>
                  {summary.statistics.recovery_rate}%
                </div>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <h4 style={{ margin: '0 0 12px 0', color: '#d4af37' }}>Export Formats</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {exportOptions.map(option => (
              <button
                key={option.id}
                onClick={() => handleExport(option.id)}
                disabled={exporting}
                style={{
                  padding: '14px',
                  background: 'linear-gradient(135deg, rgba(26, 71, 42, 0.3), rgba(30, 60, 40, 0.2))',
                  border: '1px solid #d4af37',
                  borderRadius: '8px',
                  color: '#e0e0e0',
                  cursor: exporting ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.3s ease',
                  opacity: exporting ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!exporting) e.target.style.background = 'rgba(212, 175, 55, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, rgba(26, 71, 42, 0.3), rgba(30, 60, 40, 0.2))';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>{option.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{option.label}</div>
                    <div style={{ fontSize: '11px', color: '#999' }}>{option.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Print Option */}
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#d4af37' }}>Other Options</h4>
            <button
              onClick={() => handleExport('print')}
              disabled={exporting}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, rgba(26, 71, 42, 0.3), rgba(30, 60, 40, 0.2))',
                border: '1px solid #d4af37',
                borderRadius: '8px',
                color: '#e0e0e0',
                cursor: exporting ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                transition: 'all 0.3s ease',
              }}
            >
              🖨️ Print Summary Report
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
