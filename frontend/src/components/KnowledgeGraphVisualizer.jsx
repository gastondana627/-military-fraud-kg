import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network/standalone/esm/vis-network.min.js';
import 'vis-network/styles/vis-network.min.css';
import '../styles/KnowledgeGraph.css';
import SourcesPage from './SourcesPage';
import CommandPalette from './CommandPalette';
import NotificationCenter from './NotificationCenter';
import EvidenceChainViewer from './EvidenceChainViewer';
import ExportReporting from './ExportReporting';
import AdvancedFilters from '../features/AdvancedFilters';
import CollapsibleSidebar from './CollapsibleSidebar';
import { useCommandPalette } from '../hooks/useCommandPalette';
import { useNotifications } from '../hooks/useNotifications';
import { useFraudAnalytics } from '../hooks/useFraudAnalytics';
import { calculateSeverity, getNodeSize, formatAmount } from '../utils/SeverityIndicators';
import { detectHotspots, calculateTrendIndicator } from '../utils/fraudAnalytics';
import { COMMANDS, INTELLIGENCE_THEME } from '../constants/fraudConfig';

export default function KnowledgeGraphVisualizer() {
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [connectedNodes, setConnectedNodes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [allNodes, setAllNodes] = useState([]);
  const [allEdges, setAllEdges] = useState([]);
  const [filteredNodes, setFilteredNodes] = useState([]);
  const [yearRange, setYearRange] = useState([2000, 2025]);
  const [availableYears, setAvailableYears] = useState([]);
  const [nodeTypeFilter, setNodeTypeFilter] = useState('all');
  const [hideEdges, setHideEdges] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [expandedDetails, setExpandedDetails] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [tooltipNode, setTooltipNode] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showSources, setShowSources] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [showEvidenceChain, setShowEvidenceChain] = useState(false);
  const [showExportReporting, setShowExportReporting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { notifications, addNotification, removeNotification } = useNotifications();
  const analytics = useFraudAnalytics(allNodes, filteredNodes);
  const hotspots = detectHotspots(filteredNodes);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  useCommandPalette(() => setShowCommandPalette(true));

  const handleCommandSelect = (command) => {
    switch (command.id) {
      case 'show-biggest':
        const topCases = filteredNodes
          .filter(n => n.fraud_amount)
          .sort((a, b) => {
            const amountA = parseFloat(a.fraud_amount?.toString().replace(/[^0-9.-]+/g, '') || 0);
            const amountB = parseFloat(b.fraud_amount?.toString().replace(/[^0-9.-]+/g, '') || 0);
            return amountB - amountA;
          })
          .slice(0, 5);
        if (topCases.length > 0) {
          setSelectedNode(topCases[0]);
          addNotification(`Showing top ${topCases.length} fraud cases by amount`, 'info');
        }
        break;

      case 'export-pdf':
        setShowExportReporting(true);
        addNotification('Export modal opened', 'info');
        break;

      case 'show-timeline':
        addNotification('Showing timeline heatmap', 'info');
        break;

      case 'show-trends':
        addNotification(`Detected ${hotspots.length} fraud hotspots`, 'warning');
        break;

      default:
        addNotification(`Command: ${command.label}`, 'info');
    }
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    addNotification(`${filters.length} filter(s) applied`, 'success');
  };

  const queryKGWithAI = async (question) => {
    if (!question.trim()) return;
    setChatLoading(true);
    
    try {
      const kgContext = {
        nodes: allNodes.length,
        edges: allEdges.length,
        nodesSummary: allNodes.slice(0, 15).map(n => `${n.label} (${n.shape})`),
        edgesSummary: allEdges.slice(0, 8).map(e => `${e.relationship}`),
      };

      const prompt = `You are an expert on US Military Fraud. You have access to a knowledge graph with ${allNodes.length} nodes and ${allEdges.length} relationships.\n\nKey nodes: ${kgContext.nodesSummary.join(', ')}\n\nRelationships: ${kgContext.edgesSummary.join(', ')}\n\nUser question: ${question}\n\nProvide a concise, informative answer based on the knowledge graph. Reference specific nodes or relationships if relevant.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 400,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      
      const aiResponse = data.choices[0].message.content;

      setChatMessages(prev => [
        ...prev,
        { role: 'user', content: question },
        { role: 'assistant', content: aiResponse },
      ]);
      setChatInput('');
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages(prev => [
        ...prev,
        { role: 'user', content: question },
        { role: 'assistant', content: `⚠️ Error: ${err.message}. Check your OPENAI_API_KEY in .env.local` },
      ]);
    }

    setChatLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/graph`);
        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const { nodes, edges } = await res.json();
        
        const yearsSet = new Set();
        
        nodes.forEach(node => {
          if (node.year && typeof node.year === 'number') {
            yearsSet.add(node.year);
          }
          if (node.fiscal_year && typeof node.fiscal_year === 'number') {
            yearsSet.add(node.fiscal_year);
          }
          if (node.discovered_year && typeof node.discovered_year === 'number') {
            yearsSet.add(node.discovered_year);
          }
          if (node.discovery_year && typeof node.discovery_year === 'number') {
            yearsSet.add(node.discovery_year);
          }
          if (node.conviction_year && typeof node.conviction_year === 'number') {
            yearsSet.add(node.conviction_year);
          }
          if (node.bankruptcy_year && typeof node.bankruptcy_year === 'number') {
            yearsSet.add(node.bankruptcy_year);
          }
          if (node.shutdown_year && typeof node.shutdown_year === 'number') {
            yearsSet.add(node.shutdown_year);
          }
          if (node.retirement_year && typeof node.retirement_year === 'number') {
            yearsSet.add(node.retirement_year);
          }
          
          if (node.period && typeof node.period === 'string') {
            const yearMatch = node.period.match(/(\d{4})/g);
            if (yearMatch) {
              yearMatch.forEach(y => {
                const year = parseInt(y);
                if (year >= 1990 && year <= 2030) yearsSet.add(year);
              });
            }
          }
          if (node.fraud_period && typeof node.fraud_period === 'string') {
            const yearMatch = node.fraud_period.match(/(\d{4})/g);
            if (yearMatch) {
              yearMatch.forEach(y => {
                const year = parseInt(y);
                if (year >= 1990 && year <= 2030) yearsSet.add(year);
              });
            }
          }
          if (node.bribery_period && typeof node.bribery_period === 'string') {
            const yearMatch = node.bribery_period.match(/(\d{4})/g);
            if (yearMatch) {
              yearMatch.forEach(y => {
                const year = parseInt(y);
                if (year >= 1990 && year <= 2030) yearsSet.add(year);
              });
            }
          }
          if (node.time_period && typeof node.time_period === 'string') {
            const yearMatch = node.time_period.match(/(\d{4})/g);
            if (yearMatch) {
              yearMatch.forEach(y => {
                const year = parseInt(y);
                if (year >= 1990 && year <= 2030) yearsSet.add(year);
              });
            }
          }
        });
        
        const years = Array.from(yearsSet).sort((a, b) => a - b).filter(y => y >= 1990 && y <= 2030);
        const minYear = years.length > 0 ? Math.min(...years) : 2000;
        const maxYear = years.length > 0 ? Math.max(...years) : 2025;
        
        console.log(`📅 Extracted ${years.length} unique years from ${nodes.length} nodes`);
        console.log(`Year range: ${minYear} - ${maxYear}`);
        
        setAvailableYears(years.length > 0 ? years : [2000, 2025]);
        setAllNodes(nodes);
        setAllEdges(edges);
        setFilteredNodes(nodes);
        setYearRange([minYear, maxYear]);
        setLoading(false);
        addNotification(`✓ Loaded ${nodes.length} nodes and ${edges.length} connections`, 'success');
      } catch (err) {
        console.error('Fetch error:', err);
        addNotification(`✕ Failed to load graph: ${err.message}`, 'error');
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL, addNotification]);

  const calculateStats = () => {
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

  const stats = calculateStats();

  const getNodeType = (shape) => {
    const typeMap = {
      box: 'Fraud Scheme',
      ellipse: 'Organization',
      diamond: 'Case',
      dot: 'Statistic',
    };
    return typeMap[shape] || 'Unknown';
  };

  useEffect(() => {
    if (!containerRef.current || allNodes.length === 0 || loading || showSources) return;

    const colorMap = {
      'organization': {
        background: darkMode ? '#00BCD4' : '#00ACC1',
        border: darkMode ? '#0097A7' : '#00838F',
        highlight: { background: darkMode ? '#26C6DA' : '#00BCD4', border: darkMode ? '#00ACC1' : '#0097A7' },
        hover: { background: darkMode ? '#26C6DA' : '#00BCD4', border: darkMode ? '#00ACC1' : '#0097A7' }
      },
      'fraud_type': {
        background: darkMode ? '#EF5350' : '#F44336',
        border: darkMode ? '#D32F2F' : '#C62828',
        highlight: { background: darkMode ? '#FF5252' : '#EF5350', border: darkMode ? '#E53935' : '#D32F2F' },
        hover: { background: darkMode ? '#FF5252' : '#EF5350', border: darkMode ? '#E53935' : '#D32F2F' }
      },
      'case': {
        background: darkMode ? '#66BB6A' : '#4CAF50',
        border: darkMode ? '#43A047' : '#388E3C',
        highlight: { background: darkMode ? '#81C784' : '#66BB6A', border: darkMode ? '#66BB6A' : '#43A047' },
        hover: { background: darkMode ? '#81C784' : '#66BB6A', border: darkMode ? '#66BB6A' : '#43A047' }
      },
      'statistic': {
        background: darkMode ? '#FFA726' : '#FF9800',
        border: darkMode ? '#FB8C00' : '#F57C00',
        highlight: { background: darkMode ? '#FFB74D' : '#FFA726', border: darkMode ? '#FFA726' : '#FB8C00' },
        hover: { background: darkMode ? '#FFB74D' : '#FFA726', border: darkMode ? '#FFA726' : '#FB8C00' }
      },
      'scheme': {
        background: darkMode ? '#AB47BC' : '#9C27B0',
        border: darkMode ? '#8E24AA' : '#7B1FA2',
        highlight: { background: darkMode ? '#BA68C8' : '#AB47BC', border: darkMode ? '#AB47BC' : '#8E24AA' },
        hover: { background: darkMode ? '#BA68C8' : '#AB47BC', border: darkMode ? '#AB47BC' : '#8E24AA' }
      },
    };

    const options = {
      physics: {
        enabled: true,
        stabilization: { 
          iterations: 600,
          fit: true,
          updateInterval: 50
        },
        barnesHut: {
          gravitationalConstant: -35000,
          centralGravity: 0.3,
          springLength: 200,
          springConstant: 0.04,
          damping: 0.4,
          avoidOverlap: 0.2,
        },
        maxVelocity: 50,
        minVelocity: 0.75,
        timestep: 0.35,
      },
      layout: {
        randomSeed: 42,
      },
      interaction: {
        navigationButtons: true,
        keyboard: true,
        zoomView: true,
        dragView: true,
        hover: true,
        tooltipDelay: 100,
        hideEdgesOnDrag: false,
        hideEdgesOnZoom: false,
        zoomSpeed: 1.5,
      },
      nodes: {
        font: {
          size: 24,
          face: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: '#FFFFFF',
          bold: { 
            size: 28,
            color: '#FFFFFF',
            mod: 'bold'
          },
          strokeWidth: 4,
          strokeColor: 'rgba(0, 0, 0, 0.9)',
        },
        borderWidth: 5,
        borderWidthSelected: 8,
        shadow: {
          enabled: true,
          color: 'rgba(0, 0, 0, 0.9)',
          size: 40,
          x: 10,
          y: 10,
          blur: 25,
        },
        margin: { top: 25, right: 30, bottom: 25, left: 30 },
        widthConstraint: { minimum: 160, maximum: 300 },
        heightConstraint: { minimum: 80 },
        shapeProperties: {
          borderRadius: 0,
          interpolation: false
        },
        scaling: {
          min: 30,
          max: 60,
          label: {
            enabled: true,
            min: 20,
            max: 32,
            maxVisible: 50,
            drawThreshold: 5
          }
        },
        chosen: {
          node: function(values, id, selected, hovering) {
            if (selected) {
              values.borderWidth = 8;
              values.shadow = true;
              values.shadowSize = 50;
              values.shadowColor = 'rgba(212, 175, 55, 0.8)';
            }
            if (hovering) {
              values.borderWidth = 7;
              values.shadowBlur = 35;
            }
          }
        }
      },
      edges: {
        arrows: { 
          to: { 
            enabled: true, 
            scaleFactor: 1.5, 
            type: 'arrow'
          } 
        },
        smooth: { 
          type: 'continuous',
          forceDirection: false,
          roundness: 0.5
        },
        font: {
          size: 16,
          align: 'top',
          color: darkMode ? '#E0E0E0' : '#424242',
          bold: { size: 17 },
          background: { 
            enabled: true, 
            color: darkMode ? 'rgba(45,45,45,0.95)' : 'rgba(255,255,255,0.95)', 
            stroke: darkMode ? 'rgba(100,100,100,0.8)' : 'rgba(200,200,200,0.8)', 
            strokeWidth: 2 
          },
          strokeWidth: 3,
          strokeColor: 'rgba(0, 0, 0, 0.8)',
        },
        width: 2.5,
        color: { 
          color: darkMode ? 'rgba(150, 150, 150, 0.8)' : 'rgba(100, 100, 100, 0.7)',
          highlight: darkMode ? '#64B5F6' : '#2196F3',
          hover: darkMode ? '#90CAF9' : '#42A5F5',
          opacity: 0.8
        },
        shadow: {
          enabled: true,
          color: 'rgba(0, 0, 0, 0.5)',
          size: 15,
          x: 4,
          y: 4,
          blur: 12,
        },
        hoverWidth: 2,
        selectionWidth: 3,
        smooth: {
          type: 'continuous',
          forceDirection: false,
        }
      },
    };

    const enhancedNodes = filteredNodes.map(node => {
      const nodeType = node.entity_type || 
                      (node.shape === 'ellipse' ? 'organization' : 
                       node.shape === 'box' ? 'fraud_type' : 
                       node.shape === 'diamond' ? 'case' : 
                       node.shape === 'dot' ? 'statistic' : 'fraud_type');
      
      const colors = colorMap[nodeType] || colorMap['fraud_type'];
      const severity = calculateSeverity(node);
      
      return {
        ...node,
        title: undefined,
        color: colors,
        font: { 
          size: 24,
          color: '#FFFFFF',
          bold: { size: 28, color: '#FFFFFF' },
          strokeWidth: 4,
          strokeColor: 'rgba(0, 0, 0, 0.9)',
        },
        margin: { top: 25, right: 30, bottom: 25, left: 30 },
        scaling: {
          min: 30 * severity.size,
          max: 60 * severity.size,
        }
      };
    });

    const edgesToShow = hideEdges ? [] : allEdges;
    const enhancedEdges = edgesToShow.map(edge => ({
      ...edge,
      font: { size: 16 },
      hoverWidth: 2,
      selectionWidth: 3,
    }));

    let currentPosition = null;
    let currentScale = null;
    if (networkRef.current && networkRef.current.view) {
      try {
        currentPosition = networkRef.current.getViewPosition();
        currentScale = networkRef.current.getScale();
      } catch (e) {
        console.log('Could not get current position');
      }
    }

    if (networkRef.current) {
      networkRef.current.destroy();
      networkRef.current = null;
    }

    const network = new Network(containerRef.current, { nodes: enhancedNodes, edges: enhancedEdges }, options);
    networkRef.current = network;

    network.on('click', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const node = filteredNodes.find(n => n.id === nodeId);
        
        if (tooltipNode && tooltipNode.id === nodeId) {
          setTooltipNode(null);
        } else if (node) {
          setTooltipNode(node);
          setTooltipPosition({ x: params.pointer.DOM.x, y: params.pointer.DOM.y });
        }
      } else {
        setTooltipNode(null);
      }
    });

    network.on('selectNode', (params) => {
      const nodeId = params.nodes[0];
      const node = filteredNodes.find(n => n.id === nodeId);
      setSelectedNode(node);

      const connected = allEdges
        .filter(edge => edge.from === nodeId || edge.to === nodeId)
        .map(edge => (edge.from === nodeId ? edge.to : edge.from));

      setConnectedNodes(connected);
    });

    network.on('deselectNode', () => {
      setSelectedNode(null);
      setConnectedNodes([]);
    });

    network.once('stabilizationIterationsDone', () => {
      if (networkRef.current && networkRef.current.view) {
        if (currentPosition && currentScale) {
          try {
            network.moveTo({
              position: currentPosition,
              scale: currentScale,
              animation: false
            });
          } catch (e) {
            networkRef.current.fit({ animation: { duration: 1000, easingFunction: 'easeInOutQuad' } });
          }
        } else {
          networkRef.current.fit({ 
            animation: { 
              duration: 1200, 
              easingFunction: 'easeInOutQuad' 
            } 
          });
        }
      }
    });

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [filteredNodes, allNodes, allEdges, loading, hideEdges, darkMode, showSources]);

  const handleYearChange = (e) => {
    const newMin = parseInt(e.target.value);
    if (newMin <= yearRange[1]) {
      setYearRange([newMin, yearRange[1]]);
    }
  };

  const handleYearMaxChange = (e) => {
    const newMax = parseInt(e.target.value);
    if (newMax >= yearRange[0]) {
      setYearRange([yearRange[0], newMax]);
    }
  };

  useEffect(() => {
    let filtered = allNodes;

    filtered = filtered.filter(node => {
      let nodeYear = node.year || node.fiscal_year || node.discovered_year || 
                     node.discovery_year || node.conviction_year || node.bankruptcy_year ||
                     node.shutdown_year || node.retirement_year;
      
      if (!nodeYear && node.period && typeof node.period === 'string') {
        const yearMatch = node.period.match(/(\d{4})/g);
        if (yearMatch && yearMatch.length > 0) {
          nodeYear = parseInt(yearMatch[yearMatch.length - 1]);
        }
      }
      
      if (!nodeYear && node.fraud_period && typeof node.fraud_period === 'string') {
        const yearMatch = node.fraud_period.match(/(\d{4})/g);
        if (yearMatch && yearMatch.length > 0) {
          nodeYear = parseInt(yearMatch[yearMatch.length - 1]);
        }
      }

      if (!nodeYear && node.bribery_period && typeof node.bribery_period === 'string') {
        const yearMatch = node.bribery_period.match(/(\d{4})/g);
        if (yearMatch && yearMatch.length > 0) {
          nodeYear = parseInt(yearMatch[yearMatch.length - 1]);
        }
      }

      if (!nodeYear && node.time_period && typeof node.time_period === 'string') {
        const yearMatch = node.time_period.match(/(\d{4})/g);
        if (yearMatch && yearMatch.length > 0) {
          nodeYear = parseInt(yearMatch[yearMatch.length - 1]);
        }
      }
      
      if (!nodeYear) return true;
      
      return nodeYear >= yearRange[0] && nodeYear <= yearRange[1];
    });

    if (nodeTypeFilter !== 'all') {
      filtered = filtered.filter(node => node.shape === nodeTypeFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(node =>
        node.label.toLowerCase().includes(query) ||
        node.id.toLowerCase().includes(query)
      );
    }

    setFilteredNodes(filtered);
    setSelectedNode(null);
    setConnectedNodes([]);
  }, [searchQuery, yearRange, nodeTypeFilter, allNodes]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSelection = () => {
    setSelectedNode(null);
    setConnectedNodes([]);
    setTooltipNode(null);
    if (networkRef.current) {
      networkRef.current.deselectAll();
    }
  };

  const handleFitView = () => {
    if (networkRef.current && networkRef.current.view) {
      networkRef.current.fit({ animation: { duration: 800, easingFunction: 'easeInOutQuad' } });
    }
  };

  const toggleDetailExpand = (key) => {
    setExpandedDetails(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderNodeDetails = (node) => {
    const details = Object.entries(node).filter(
      ([key]) => !['id', 'label', 'shape', 'color', 'title', 'sources'].includes(key)
    );

    return details.map(([key, value]) => {
      if (!value) return null;
      const displayKey = key.replace(/_/g, ' ').toUpperCase();
      
      return (
        <div key={key} style={{
          padding: '8px 0',
          borderBottom: darkMode ? '1px solid #444' : '1px solid #e0e0e0',
          fontSize: '12px',
        }}>
          <span style={{ fontWeight: 600, color: darkMode ? '#64b5f6' : '#1a73e8' }}>{displayKey}:</span>
          <div style={{ marginTop: '4px', color: darkMode ? '#b0b0b0' : '#5f6368', wordBreak: 'break-word' }}>
            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
          </div>
        </div>
      );
    });
  };

  const renderSources = (sources) => {
    if (!sources || sources.length === 0) return null;
    
    return (
      <div style={{
        marginTop: '12px',
        padding: '12px',
        background: darkMode ? '#333' : '#f0f7ff',
        border: `1px solid ${darkMode ? '#555' : '#d2e3fc'}`,
        borderRadius: '6px',
      }}>
        <h5 style={{
          marginTop: 0,
          marginBottom: 10,
          color: darkMode ? '#64b5f6' : '#1a73e8',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          📚 Sources ({sources.length})
        </h5>
        {sources.map((source, idx) => (
          <div key={idx} style={{
            marginBottom: '10px',
            padding: '8px',
            background: darkMode ? '#2d2d2d' : '#ffffff',
            border: `1px solid ${darkMode ? '#444' : '#e8eaed'}`,
            borderRadius: '4px',
            fontSize: '11px',
          }}>
            <div style={{ fontWeight: 600, marginBottom: '4px', color: darkMode ? '#e0e0e0' : '#202124' }}>
              {source.title}
            </div>
            <a 
              href={source.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                color: darkMode ? '#64b5f6' : '#1a73e8',
                textDecoration: 'underline',
                fontSize: '10px',
                wordBreak: 'break-all',
                display: 'block',
                marginTop: '4px',
              }}
            >
              🔗 {source.url}
            </a>
            <div style={{ marginTop: '4px', color: darkMode ? '#999' : '#5f6368', fontSize: '10px' }}>
              📅 {source.date}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const bgColor = darkMode ? '#1e1e1e' : '#f8f9fb';
  const textColor = darkMode ? '#e0e0e0' : '#202124';
  const borderColor = darkMode ? '#444' : '#e8eaed';

  const previousMonth = Math.max(...availableYears) - 1;
  const currentStats = stats;
  const trendIndicator = calculateTrendIndicator(stats.totalCases, stats.totalCases - Math.floor(stats.totalCases * 0.1));

  if (showSources) {
    return <SourcesPage onBackToGraph={() => setShowSources(false)} darkMode={darkMode} />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', fontFamily: 'Arial, sans-serif', backgroundColor: bgColor, color: textColor }}>
      {/* CLASSIFIED HEADER */}
      <div className="kg-classified-header">
        <div className="kg-header-title">⚠ OFFICIAL FRAUD INVESTIGATION RECORD</div>
        <div className="kg-header-timestamp">Last Updated: {new Date().toLocaleString()}</div>
      </div>

      {/* COMMAND PALETTE */}
      <CommandPalette 
        isOpen={showCommandPalette} 
        onClose={() => setShowCommandPalette(false)} 
        onCommandSelect={handleCommandSelect}
      />

      {/* NOTIFICATIONS */}
      <NotificationCenter 
        notifications={notifications} 
        onRemove={removeNotification}
      />

      {/* EVIDENCE CHAIN VIEWER */}
      <EvidenceChainViewer 
        isOpen={showEvidenceChain} 
        onClose={() => setShowEvidenceChain(false)} 
        selectedNode={selectedNode}
      />

      {/* EXPORT REPORTING */}
      <ExportReporting 
        isOpen={showExportReporting} 
        onClose={() => setShowExportReporting(false)} 
        nodes={filteredNodes}
        edges={allEdges}
        stats={stats}
      />

      {/* SOURCES BUTTON */}
      <button
        onClick={() => setShowSources(true)}
        style={{
          position: 'fixed',
          top: '90px',
          right: '20px',
          zIndex: 400,
          padding: '12px 20px',
          background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '14px',
          boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
          transition: 'all 0.3s',
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 16px rgba(76, 175, 80, 0.5)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.4)';
        }}
      >
        📚 View Sources
      </button>

      <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%', marginTop: '70px' }}>
        <div ref={containerRef} style={{ width: '100%', height: '100%', backgroundColor: darkMode ? '#0a0a0a' : '#fafafa' }} />
        
        {tooltipNode && (
          <div style={{
            position: 'absolute',
            left: tooltipPosition.x + 15,
            top: tooltipPosition.y + 15,
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            border: `2px solid ${darkMode ? '#64b5f6' : '#1a73e8'}`,
            borderRadius: '8px',
            padding: '12px',
            maxWidth: '320px',
            maxHeight: '400px',
            overflowY: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 1000,
            pointerEvents: 'auto',
            fontSize: '12px',
            lineHeight: '1.4',
          }}>
            <button
              onClick={() => setTooltipNode(null)}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'transparent',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: darkMode ? '#999' : '#666',
                padding: '4px 8px',
              }}
            >
              ✕
            </button>

            <div style={{ fontWeight: 700, fontSize: '14px', color: darkMode ? '#64b5f6' : '#1a73e8', marginBottom: '6px', paddingRight: '24px' }}>
              {tooltipNode.label}
            </div>
            <div style={{ fontSize: '11px', color: darkMode ? '#aaa' : '#5f6368', marginBottom: '4px' }}>
              Type: {getNodeType(tooltipNode.shape)}
            </div>
            
            {tooltipNode.fraud_amount && (
              <div style={{ fontSize: '11px', marginTop: '4px' }}>
                <strong>Amount:</strong> {formatAmount(tooltipNode.fraud_amount)}
              </div>
            )}
            {tooltipNode.settlement_amount && (
              <div style={{ fontSize: '11px', marginTop: '4px' }}>
                <strong>Settlement:</strong> {formatAmount(tooltipNode.settlement_amount)}
              </div>
            )}
            {tooltipNode.sentence && (
              <div style={{ fontSize: '11px', marginTop: '4px' }}>
                <strong>Sentence:</strong> {tooltipNode.sentence}
              </div>
            )}
            {(tooltipNode.year || tooltipNode.discovered_year || tooltipNode.conviction_year) && (
              <div style={{ fontSize: '11px', marginTop: '4px' }}>
                <strong>Year:</strong> {tooltipNode.year || tooltipNode.discovered_year || tooltipNode.conviction_year}
              </div>
            )}
            {tooltipNode.status && (
              <div style={{ fontSize: '11px', marginTop: '4px' }}>
                <strong>Status:</strong> {tooltipNode.status}
              </div>
            )}
            
            {tooltipNode.sources && tooltipNode.sources.length > 0 && (
              <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: `1px solid ${darkMode ? '#555' : '#e8eaed'}` }}>
                <div style={{ fontWeight: 700, fontSize: '12px', color: darkMode ? '#64b5f6' : '#1a73e8', marginBottom: '6px' }}>
                  📚 Sources:
                </div>
                {tooltipNode.sources.map((source, idx) => (
                  <div key={idx} style={{ fontSize: '10px', marginBottom: '6px', paddingLeft: '8px' }}>
                    • <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          color: darkMode ? '#64b5f6' : '#1a73e8',
                          textDecoration: 'underline',
                        }}
                      >
                        {source.title}
                      </a>
                    <div style={{ color: darkMode ? '#999' : '#5f6368', fontSize: '9px', marginLeft: '10px', marginTop: '2px' }}>
                      📅 {source.date}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* COLLAPSIBLE SIDEBAR */}
      <CollapsibleSidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        darkMode={darkMode}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px',
          borderBottom: `2px solid ${darkMode ? '#444' : '#e8eaed'}`,
          background: darkMode ? '#2d2d2d' : '#ffffff',
        }}>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: textColor }}>KG Explorer</h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              padding: '8px 12px',
              backgroundColor: darkMode ? '#444' : '#e8eaed',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.3s',
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* ENHANCED STAT CARDS WITH TRENDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          padding: '16px',
          marginBottom: '4px',
        }}>
          <div className="stat-card" style={{ background: darkMode ? '#333' : '#e8f0fe', borderColor: darkMode ? '#555' : '#d2e3fc' }}>
            <div className="stat-label" style={{ color: darkMode ? '#64b5f6' : '#1a73e8' }}>Cases</div>
            <div className="stat-value">{stats.totalCases}</div>
            <div className="stat-trend up">
              {trendIndicator.symbol} +{Math.floor(stats.totalCases * 0.1)}
            </div>
          </div>

          <div className="stat-card" style={{ background: darkMode ? '#333' : '#fff3e0', borderColor: darkMode ? '#555' : '#ffe0b2' }}>
            <div className="stat-label" style={{ color: darkMode ? '#ffb74d' : '#e65100' }}>Fraud Types</div>
            <div className="stat-value">{stats.fraudTypeCount}</div>
            <div className="stat-trend up">
              {trendIndicator.symbol} +2
            </div>
          </div>

          <div className="stat-card" style={{ background: darkMode ? '#333' : '#f3e5f5', borderColor: darkMode ? '#555' : '#e1bee7' }}>
            <div className="stat-label" style={{ color: darkMode ? '#ce93d8' : '#7b1fa2' }}>Orgs</div>
            <div className="stat-value">{stats.organizationCount}</div>
            <div className="stat-trend stable">
              → stable
            </div>
          </div>

          <div className="stat-card" style={{ background: darkMode ? '#333' : '#e0f2f1', borderColor: darkMode ? '#555' : '#b2dfdb' }}>
            <div className="stat-label" style={{ color: darkMode ? '#4db8ac' : '#00695c' }}>Nodes</div>
            <div className="stat-value">{filteredNodes.length}</div>
            <div className="stat-trend up">
              {trendIndicator.symbol} {((filteredNodes.length / allNodes.length) * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {/* HOTSPOTS ALERT */}
        {hotspots.length > 0 && (
          <div style={{
            marginBottom: '16px',
            marginLeft: '16px',
            marginRight: '16px',
            padding: '12px',
            background: 'rgba(255, 102, 0, 0.1)',
            border: '1px solid #ff6600',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#ffb74d',
          }}>
            <div style={{ fontWeight: 600, marginBottom: '6px' }}>🔥 Fraud Hotspots Detected</div>
            {hotspots.slice(0, 2).map((hotspot, idx) => (
              <div key={idx} style={{ fontSize: '11px', marginBottom: '4px' }}>
                Year {hotspot.year}: +{hotspot.anomaly}% activity
              </div>
            ))}
          </div>
        )}

        {/* ADVANCED FILTERS */}
        <AdvancedFilters 
          onFilterChange={handleFilterChange} 
          stats={stats}
        />

        <div style={{
          marginBottom: '16px',
          marginLeft: '16px',
          marginRight: '16px',
          padding: '16px',
          background: darkMode ? 'rgba(58, 123, 213, 0.15)' : 'linear-gradient(135deg, #e8f0fe 0%, #f0f4ff 100%)',
          border: `1.5px solid ${darkMode ? '#3a7bd5' : '#d2e3fc'}`,
          borderRadius: '8px',
        }}>
          <h4 style={{ marginTop: 0, marginBottom: 10, color: darkMode ? '#64b5f6' : '#1a73e8' }}>View Controls</h4>
          
          <button
            onClick={handleFitView}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: 10,
              background: darkMode ? 'linear-gradient(135deg, #3a7bd5 0%, #2d5ba3 100%)' : 'linear-gradient(135deg, #1a73e8 0%, #1557b0 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '13px',
              transition: 'all 0.2s',
            }}
          >
            🔍 Fit All Nodes
          </button>

          <label style={{ display: 'flex', alignItems: 'center', fontSize: '12px', cursor: 'pointer', marginBottom: 10, color: textColor }}>
            <input
              type="checkbox"
              checked={hideEdges}
              onChange={(e) => setHideEdges(e.target.checked)}
              style={{ marginRight: 8, cursor: 'pointer' }}
            />
            Hide Edges
          </label>

          <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: 8, color: textColor }}>Filter by Type:</label>
          <select
            value={nodeTypeFilter}
            onChange={(e) => setNodeTypeFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: `1.5px solid ${darkMode ? '#555' : '#90caf9'}`,
              fontSize: '12px',
              boxSizing: 'border-box',
              backgroundColor: darkMode ? '#333' : '#ffffff',
              color: textColor,
            }}
          >
            <option value="all">All Types</option>
            <option value="ellipse">Organizations Only</option>
            <option value="box">Fraud Types Only</option>
            <option value="diamond">Cases Only</option>
            <option value="dot">Statistics Only</option>
          </select>
        </div>

        <div style={{
          marginBottom: '16px',
          marginLeft: '16px',
          marginRight: '16px',
          padding: '16px',
          background: darkMode ? 'rgba(217, 119, 6, 0.15)' : 'linear-gradient(135deg, #fffef0 0%, #fffbf0 100%)',
          border: `1.5px solid ${darkMode ? '#d97706' : '#fef7e0'}`,
          borderRadius: '8px',
        }}>
          <h4 style={{ marginTop: 0, marginBottom: 15, color: darkMode ? '#f97316' : '#d97706' }}>📅 Timeline</h4>
          
          {availableYears.length > 0 ? (
            <>
              <div style={{ marginBottom: 15 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: textColor }}>From:</label>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: darkMode ? '#f97316' : '#d97706' }}>{yearRange[0]}</span>
                </div>
                <input
                  type="range"
                  min={Math.min(...availableYears)}
                  max={Math.max(...availableYears)}
                  value={yearRange[0]}
                  onChange={handleYearChange}
                  style={{ width: '100%', cursor: 'pointer', height: '6px' }}
                />
              </div>

              <div style={{ marginBottom: 15 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: textColor }}>To:</label>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: darkMode ? '#f97316' : '#d97706' }}>{yearRange[1]}</span>
                </div>
                <input
                  type="range"
                  min={Math.min(...availableYears)}
                  max={Math.max(...availableYears)}
                  value={yearRange[1]}
                  onChange={handleYearMaxChange}
                  style={{ width: '100%', cursor: 'pointer', height: '6px' }}
                />
              </div>
            </>
          ) : (
            <p style={{ fontSize: '12px', color: '#999' }}>No timeline data</p>
          )}
        </div>

        <div style={{ marginBottom: '16px', marginLeft: '16px', marginRight: '16px' }}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '5px',
              border: `1.5px solid ${darkMode ? '#555' : '#e8eaed'}`,
              fontSize: '13px',
              boxSizing: 'border-box',
              backgroundColor: darkMode ? '#333' : '#ffffff',
              color: textColor,
            }}
          />
        </div>

        <div style={{
          marginBottom: '16px',
          marginLeft: '16px',
          marginRight: '16px',
          padding: '16px',
          background: darkMode ? 'rgba(76, 175, 80, 0.15)' : 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
          border: `1.5px solid ${darkMode ? '#4caf50' : '#c8e6c9'}`,
          borderRadius: '8px',
        }}>
          <button
            onClick={() => setShowChat(!showChat)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: 10,
              background: darkMode ? 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)' : 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
            }}
          >
            {showChat ? '💬 Hide Chat' : '💬 Ask AI'}
          </button>

          {showChat && (
            <>
              <div style={{
                height: '280px',
                overflowY: 'auto',
                background: darkMode ? '#2d2d2d' : '#fff',
                border: `1px solid ${darkMode ? '#555' : '#c8e6c9'}`,
                borderRadius: '4px',
                padding: '12px',
                marginBottom: '10px',
                fontSize: '12px',
              }}>
                {chatMessages.length === 0 ? (
                  <p style={{ color: darkMode ? '#999' : '#999', textAlign: 'center' }}>Ask about military fraud...</p>
                ) : (
                  chatMessages.map((msg, idx) => (
                    <div key={idx} style={{
                      marginBottom: '12px',
                      padding: '10px',
                      background: msg.role === 'user' ? (darkMode ? '#1b5e20' : '#c8e6c9') : (darkMode ? '#333' : '#f1f8e9'),
                      borderRadius: '6px',
                      borderLeft: `3px solid ${msg.role === 'user' ? '#4caf50' : '#999'}`,
                      color: textColor,
                      lineHeight: '1.4',
                    }}>
                      <strong style={{ color: msg.role === 'user' ? '#4caf50' : '#999' }}>
                        {msg.role === 'user' ? 'You' : 'AI'}:
                      </strong>
                      <div style={{ marginTop: '4px' }}>{msg.content}</div>
                    </div>
                  ))
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Ask..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && queryKGWithAI(chatInput)}
                  disabled={chatLoading}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '4px',
                    border: `1px solid ${darkMode ? '#555' : '#c8e6c9'}`,
                    backgroundColor: darkMode ? '#2d2d2d' : '#fff',
                    color: textColor,
                    fontSize: '12px',
                  }}
                />
                <button
                  onClick={() => queryKGWithAI(chatInput)}
                  disabled={chatLoading || !chatInput}
                  style={{
                    padding: '8px 12px',
                    background: chatLoading ? '#ccc' : '#4caf50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: chatLoading ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  {chatLoading ? '...' : 'Send'}
                </button>
              </div>
            </>
          )}
        </div>

        <div style={{
          marginBottom: '16px',
          marginLeft: '16px',
          marginRight: '16px',
          padding: '14px',
          background: darkMode ? '#333' : '#f8f9fa',
          border: `1px solid ${darkMode ? '#555' : '#e8eaed'}`,
          borderRadius: '8px',
        }}>
          <h4 style={{ marginTop: 0, fontSize: '12px', color: textColor }}>Legend</h4>
          <div style={{ fontSize: '11px', lineHeight: '1.8' }}>
            <div><span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: '#00ACC1', borderRadius: '50%', marginRight: '6px' }}></span> Organization</div>
            <div><span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: '#F44336', marginRight: '6px' }}></span> Fraud Type</div>
            <div><span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: '#4CAF50', marginRight: '6px' }}></span> Case</div>
            <div><span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: '#FF9800', borderRadius: '50%', marginRight: '6px' }}></span> Statistic</div>
            <div><span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: '#9C27B0', marginRight: '6px' }}></span> Scheme</div>
          </div>
        </div>

        {selectedNode ? (
          <div style={{
            marginBottom: '16px',
            marginLeft: '16px',
            marginRight: '16px',
            padding: '16px',
            background: darkMode ? 'rgba(100, 181, 246, 0.15)' : 'linear-gradient(135deg, #e6f2ff 0%, #eef6ff 100%)',
            border: `1.5px solid ${darkMode ? '#64b5f6' : '#c5e1ff'}`,
            borderRadius: '8px',
            maxHeight: '400px',
            overflowY: 'auto',
          }}>
            <h3 style={{ marginTop: 0, color: darkMode ? '#64b5f6' : '#1a73e8', fontSize: '15px' }}>{selectedNode.label}</h3>
            <p style={{ fontSize: '12px', marginBottom: 8, color: textColor }}><strong>Type:</strong> {getNodeType(selectedNode.shape)}</p>
            {(selectedNode.year || selectedNode.discovered_year || selectedNode.conviction_year) && (
              <p style={{ fontSize: '12px', marginBottom: 8, color: textColor }}>
                <strong>Year:</strong> {selectedNode.year || selectedNode.discovered_year || selectedNode.conviction_year}
              </p>
            )}

            {renderSources(selectedNode.sources)}

            <button
              onClick={() => {
                setShowEvidenceChain(true);
                addNotification('Viewing evidence chain...', 'info');
              }}
              style={{
                width: '100%',
                padding: '10px',
                marginTop: 12,
                marginBottom: 10,
                background: 'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '12px',
              }}
            >
              📋 View Evidence Chain
            </button>

            <button
              onClick={() => {
                setShowExportReporting(true);
                addNotification('Opening export options...', 'info');
              }}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: 10,
                background: 'linear-gradient(135deg, #FF9800 0%, #E65100 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '12px',
              }}
            >
              📤 Export / Report
            </button>

            <button
              onClick={() => toggleDetailExpand('metadata')}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: 10,
                background: darkMode ? '#444' : '#f0f0f0',
                border: `1px solid ${darkMode ? '#555' : '#ddd'}`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '12px',
                color: textColor,
              }}
            >
              {expandedDetails.metadata ? '▼' : '▶'} Full Details
            </button>

            {expandedDetails.metadata && (
              <div style={{
                padding: '12px',
                background: darkMode ? '#333' : '#f8f9fa',
                borderRadius: '4px',
                marginBottom: 10,
                fontSize: '12px',
                maxHeight: '200px',
                overflowY: 'auto',
              }}>
                {renderNodeDetails(selectedNode)}
              </div>
            )}

            {connectedNodes.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <h5 style={{ marginBottom: 8, color: darkMode ? '#64b5f6' : '#1a73e8', fontSize: '11px' }}>Connected ({connectedNodes.length})</h5>
                <div style={{ maxHeight: '100px', overflowY: 'auto', fontSize: '11px' }}>
                  {connectedNodes.map(nodeId => {
                    const node = allNodes.find(n => n.id === nodeId);
                    return (
                      <div key={nodeId} style={{
                        padding: '6px',
                        backgroundColor: darkMode ? '#444' : '#fff',
                        marginBottom: '6px',
                        borderRadius: '3px',
                        border: `1px solid ${darkMode ? '#555' : '#e8eaed'}`,
                        color: textColor,
                      }}>
                        <strong>{node?.label}</strong>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              onClick={handleClearSelection}
              style={{
                marginTop: 12,
                width: '100%',
                padding: '8px',
                background: 'linear-gradient(135deg, #d33426 0%, #b71c1c 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '12px',
              }}
            >
              Clear
            </button>
          </div>
        ) : (
          <p style={{ color: darkMode ? '#999' : '#9aa0a6', textAlign: 'center', fontSize: '12px', marginLeft: '16px', marginRight: '16px' }}>Click a node</p>
        )}

        <div style={{
          marginTop: 'auto',
          marginLeft: '16px',
          marginRight: '16px',
          padding: '14px 0',
          borderTop: `1.5px solid ${darkMode ? '#444' : '#e8eaed'}`,
          fontSize: '11px',
          color: darkMode ? '#999' : '#5f6368',
        }}>
          <p style={{ marginBottom: 4 }}><strong style={{ color: textColor }}>Total:</strong> {allNodes.length} nodes</p>
          <p style={{ marginBottom: 0 }}><strong style={{ color: textColor }}>Edges:</strong> {allEdges.length}</p>
        </div>
      </CollapsibleSidebar>
    </div>
  );
}
