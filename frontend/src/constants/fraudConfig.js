// Centralized configuration for fraud investigation system
export const SEVERITY_LEVELS = {
  critical: {
    label: 'CRITICAL',
    color: '#ff0000',
    glow: '#ff0000',
    pulse: true,
    size: 1.8,
    badge: '🔴',
  },
  high: {
    label: 'HIGH',
    color: '#ff6600',
    glow: '#ff6600',
    pulse: true,
    size: 1.5,
    badge: '🟠',
  },
  medium: {
    label: 'MEDIUM',
    color: '#ffcc00',
    glow: '#ffcc00',
    pulse: false,
    size: 1.2,
    badge: '🟡',
  },
  low: {
    label: 'LOW',
    color: '#44ff44',
    glow: '#44ff44',
    pulse: false,
    size: 0.9,
    badge: '🟢',
  },
};

export const COLOR_MAP = {
  organization: {
    background: '#00BCD4',
    border: '#0097A7',
    highlight: '#26C6DA',
    hover: '#26C6DA',
  },
  fraud_type: {
    background: '#F44336',
    border: '#C62828',
    highlight: '#FF5252',
    hover: '#FF5252',
  },
  case: {
    background: '#4CAF50',
    border: '#388E3C',
    highlight: '#81C784',
    hover: '#81C784',
  },
  statistic: {
    background: '#FF9800',
    border: '#F57C00',
    highlight: '#FFB74D',
    hover: '#FFB74D',
  },
  scheme: {
    background: '#9C27B0',
    border: '#7B1FA2',
    highlight: '#BA68C8',
    hover: '#BA68C8',
  },
};

export const INTELLIGENCE_THEME = {
  primary: '#1a472a',      // DoD green
  secondary: '#d4af37',    // Gold
  danger: '#ff4444',       // High alert red
  success: '#44ff44',      // Neon green
  bg: '#0a0e27',           // Deep navy
  card: 'rgba(26, 71, 42, 0.3)',
  text: '#e0e0e0',
  border: '#d4af37',
};

export const COMPLIANCE_BADGES = {
  verified: {
    icon: '✓',
    label: 'Verified Government Source',
    color: '#44ff44',
  },
  classified: {
    icon: '🔐',
    label: 'Classified Level: Secret',
    color: '#ff6600',
  },
  court: {
    icon: '📋',
    label: 'Court Record Reference',
    color: '#2196F3',
  },
  doj: {
    icon: '🏛️',
    label: 'DoJ Investigation',
    color: '#d4af37',
  },
};

export const EXPORT_FORMATS = {
  pdf: 'PDF Report',
  graphml: 'GraphML Network',
  json: 'JSON Data',
  csv: 'CSV Summary',
};

export const COMMANDS = [
  { id: 'show-biggest', label: 'Show biggest fraud cases', icon: '💰' },
  { id: 'show-recent', label: 'Show recent investigations', icon: '🆕' },
  { id: 'filter-dod', label: 'Filter by DoD involvement', icon: '🎖️' },
  { id: 'filter-contractor', label: 'Filter by contractors', icon: '🏢' },
  { id: 'export-pdf', label: 'Export as PDF report', icon: '📄' },
  { id: 'export-graphml', label: 'Export as GraphML', icon: '📊' },
  { id: 'show-timeline', label: 'Show timeline heatmap', icon: '📈' },
  { id: 'show-trends', label: 'Show fraud trends', icon: '📉' },
];
