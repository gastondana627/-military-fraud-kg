/**
 * Calculate fraud trends over time
 */
export const calculateFraudTrends = (nodes) => {
  const yearlyStats = {};

  nodes.forEach(node => {
    const year = node.year || node.discovered_year || node.conviction_year;
    if (!year) return;

    if (!yearlyStats[year]) {
      yearlyStats[year] = {
        cases: 0,
        totalAmount: 0,
        avgAmount: 0,
        types: new Set(),
      };
    }

    yearlyStats[year].cases += 1;
    
    const amount = parseFloat(node.fraud_amount?.toString().replace(/[^0-9.-]+/g, '') || 0);
    yearlyStats[year].totalAmount += amount;
    
    if (node.entity_type) yearlyStats[year].types.add(node.entity_type);
  });

  // Calculate averages
  Object.keys(yearlyStats).forEach(year => {
    yearlyStats[year].avgAmount = 
      yearlyStats[year].totalAmount / yearlyStats[year].cases;
    yearlyStats[year].typeCount = yearlyStats[year].types.size;
  });

  return yearlyStats;
};

/**
 * Calculate enhancement statistics
 */
export const calculateStats = (nodes, filteredNodes) => {
  const stats = {
    totalCases: 0,
    totalFraudAmount: 0,
    totalRecovered: 0,
    organizationCount: 0,
    fraudTypeCount: 0,
    recoveryRate: 0,
    avgCaseValue: 0,
    criticalCases: 0,
  };

  filteredNodes.forEach(node => {
    if (node.shape === 'diamond') stats.totalCases++;
    if (node.shape === 'box') stats.fraudTypeCount++;
    if (node.shape === 'ellipse') stats.organizationCount++;

    const fraudAmount = parseFloat(node.fraud_amount?.toString().replace(/[^0-9.-]+/g, '') || 0);
    const recoveredAmount = parseFloat(node.settlement_amount?.toString().replace(/[^0-9.-]+/g, '') || 0);

    stats.totalFraudAmount += fraudAmount;
    stats.totalRecovered += recoveredAmount;

    if (fraudAmount > 100000000) stats.criticalCases++;
  });

  stats.recoveryRate = stats.totalFraudAmount > 0 
    ? (stats.totalRecovered / stats.totalFraudAmount * 100).toFixed(1)
    : 0;

  stats.avgCaseValue = stats.totalCases > 0 
    ? stats.totalFraudAmount / stats.totalCases
    : 0;

  return stats;
};

/**
 * Calculate trend indicators (↑ ↓ →)
 */
export const calculateTrendIndicator = (current, previous) => {
  if (current > previous) return { symbol: '↑', color: '#ff4444', direction: 'up' };
  if (current < previous) return { symbol: '↓', color: '#44ff44', direction: 'down' };
  return { symbol: '→', color: '#ffcc00', direction: 'stable' };
};

/**
 * Get top fraud cases by amount
 */
export const getTopCases = (nodes, limit = 10) => {
  return nodes
    .filter(n => n.shape === 'diamond' && n.fraud_amount)
    .sort((a, b) => {
      const amountA = parseFloat(a.fraud_amount?.toString().replace(/[^0-9.-]+/g, '') || 0);
      const amountB = parseFloat(b.fraud_amount?.toString().replace(/[^0-9.-]+/g, '') || 0);
      return amountB - amountA;
    })
    .slice(0, limit);
};

/**
 * Get fraud distribution by type
 */
export const getFraudDistribution = (nodes) => {
  const distribution = {};

  nodes.forEach(node => {
    if (node.shape === 'box') {
      const type = node.label || 'Unknown';
      distribution[type] = (distribution[type] || 0) + 1;
    }
  });

  return distribution;
};

/**
 * Detect fraud hotspots (years with unusual activity)
 */
export const detectHotspots = (nodes) => {
  const yearlyStats = calculateFraudTrends(nodes);
  const years = Object.keys(yearlyStats).map(y => parseInt(y));
  
  if (years.length < 2) return [];

  const caseAvg = Object.values(yearlyStats).reduce((sum, y) => sum + y.cases, 0) / years.length;
  const hotspots = [];

  Object.keys(yearlyStats).forEach(year => {
    if (yearlyStats[year].cases > caseAvg * 1.5) {
      hotspots.push({
        year: parseInt(year),
        cases: yearlyStats[year].cases,
        anomaly: ((yearlyStats[year].cases / caseAvg - 1) * 100).toFixed(1),
      });
    }
  });

  return hotspots.sort((a, b) => b.anomaly - a.anomaly);
};
