import { SEVERITY_LEVELS } from '../constants/fraudConfig';

/**
 * Calculate fraud severity based on amount and other factors
 */
export const calculateSeverity = (node) => {
  if (!node) return SEVERITY_LEVELS.low;

  const fraudAmount = parseFloat(node.fraud_amount?.toString().replace(/[^0-9.-]+/g, '') || 0);
  const recoveredAmount = parseFloat(node.settlement_amount?.toString().replace(/[^0-9.-]+/g, '') || 0);
  
  // Severity scoring algorithm
  let score = 0;
  
  // Amount factor (40% weight)
  if (fraudAmount > 1000000000) score += 40; // > $1B
  else if (fraudAmount > 500000000) score += 35; // > $500M
  else if (fraudAmount > 100000000) score += 30; // > $100M
  else if (fraudAmount > 50000000) score += 25; // > $50M
  else if (fraudAmount > 10000000) score += 20; // > $10M
  else if (fraudAmount > 1000000) score += 15; // > $1M
  else if (fraudAmount > 100000) score += 10; // > $100K
  else score += 5;

  // Recovery factor (30% weight) - lower recovery = higher severity
  const recoveryRate = fraudAmount > 0 ? recoveredAmount / fraudAmount : 0;
  if (recoveryRate < 0.2) score += 30;
  else if (recoveryRate < 0.4) score += 25;
  else if (recoveryRate < 0.6) score += 20;
  else if (recoveryRate < 0.8) score += 10;
  else score += 5;

  // Organizational impact (20% weight)
  if (node.shape === 'diamond') score += 15; // Cases have high impact
  if (node.label?.includes('DoD') || node.label?.includes('Defense')) score += 10;
  if (node.label?.includes('Military')) score += 10;

  // Recency factor (10% weight)
  if (node.year >= 2023) score += 10;
  else if (node.year >= 2020) score += 7;
  else if (node.year >= 2015) score += 5;

  // Determine severity level
  if (score >= 80) return SEVERITY_LEVELS.critical;
  if (score >= 60) return SEVERITY_LEVELS.high;
  if (score >= 40) return SEVERITY_LEVELS.medium;
  return SEVERITY_LEVELS.low;
};

/**
 * Get node size multiplier based on fraud amount
 */
export const getNodeSize = (node) => {
  const severity = calculateSeverity(node);
  const fraudAmount = parseFloat(node.fraud_amount?.toString().replace(/[^0-9.-]+/g, '') || 0);
  
  // Size based on fraud amount with severity multiplier
  let size = 1;
  if (fraudAmount > 1000000000) size = 2.5;
  else if (fraudAmount > 500000000) size = 2.2;
  else if (fraudAmount > 100000000) size = 2.0;
  else if (fraudAmount > 50000000) size = 1.8;
  else if (fraudAmount > 10000000) size = 1.6;
  else if (fraudAmount > 1000000) size = 1.4;
  else if (fraudAmount > 100000) size = 1.2;
  
  return size * (severity.size || 1);
};

/**
 * Get glow intensity based on severity
 */
export const getGlowIntensity = (severity) => {
  if (severity.pulse) return '0 0 20px rgba(255, 0, 0, 0.8)';
  return `0 0 10px ${severity.glow}40`;
};

/**
 * Format fraud amount for display
 */
export const formatAmount = (amount) => {
  if (!amount) return '$0';
  const num = parseFloat(amount.toString().replace(/[^0-9.-]+/g, ''));
  if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
};

/**
 * Get severity color (supports dark/light mode)
 */
export const getSeverityColor = (severity, darkMode = false) => {
  return severity.color;
};
