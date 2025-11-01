import { useMemo } from 'react';
import {
  calculateFraudTrends,
  calculateStats,
  getTopCases,
  getFraudDistribution,
  detectHotspots,
} from '../utils/fraudAnalytics';

/**
 * Custom hook for fraud analytics
 */
export const useFraudAnalytics = (nodes, filteredNodes) => {
  const analytics = useMemo(() => {
    if (!nodes || nodes.length === 0) {
      return {
        stats: {},
        trends: {},
        topCases: [],
        distribution: {},
        hotspots: [],
      };
    }

    return {
      stats: calculateStats(nodes, filteredNodes),
      trends: calculateFraudTrends(filteredNodes),
      topCases: getTopCases(filteredNodes),
      distribution: getFraudDistribution(filteredNodes),
      hotspots: detectHotspots(filteredNodes),
    };
  }, [nodes, filteredNodes]);

  return analytics;
};
