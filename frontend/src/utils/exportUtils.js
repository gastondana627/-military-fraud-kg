/**
 * Export fraud data as JSON
 */
export const exportAsJSON = (nodes, edges, filename = 'fraud-network.json') => {
  const data = {
    metadata: {
      exported: new Date().toISOString(),
      nodeCount: nodes.length,
      edgeCount: edges.length,
    },
    nodes,
    edges,
  };

  const jsonString = JSON.stringify(data, null, 2);
  downloadFile(jsonString, filename, 'application/json');
};

/**
 * Export fraud data as CSV
 */
export const exportAsCSV = (nodes, filename = 'fraud-cases.csv') => {
  const casesOnly = nodes.filter(n => n.shape === 'diamond');
  
  if (casesOnly.length === 0) {
    alert('No cases to export');
    return;
  }

  const headers = ['ID', 'Label', 'Type', 'Fraud Amount', 'Settlement', 'Year', 'Status'];
  const rows = casesOnly.map(node => [
    node.id,
    `"${node.label}"`,
    'Case',
    node.fraud_amount || 'N/A',
    node.settlement_amount || 'N/A',
    node.year || 'N/A',
    node.status || 'N/A',
  ]);

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  downloadFile(csv, filename, 'text/csv');
};

/**
 * Export as GraphML (network format)
 */
export const exportAsGraphML = (nodes, edges, filename = 'fraud-network.graphml') => {
  let graphml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  graphml += '<graphml xmlns="http://graphml.graphdrawing.org/xmlns">\n';
  graphml += '  <graph edgedefault="directed">\n';

  // Add nodes
  nodes.forEach(node => {
    graphml += `    <node id="${node.id}" label="${node.label}">\n`;
    graphml += `      <data key="type">${node.shape}</data>\n`;
    graphml += `      <data key="amount">${node.fraud_amount || 'N/A'}</data>\n`;
    graphml += `    </node>\n`;
  });

  // Add edges
  edges.forEach((edge, idx) => {
    graphml += `    <edge id="e${idx}" source="${edge.from}" target="${edge.to}" label="${edge.relationship || ''}" />\n`;
  });

  graphml += '  </graph>\n';
  graphml += '</graphml>';

  downloadFile(graphml, filename, 'application/xml');
};

/**
 * Generate PDF report (requires external library like jsPDF)
 */
export const exportAsPDF = (nodes, edges, stats) => {
  // This requires jsPDF library
  // Install with: npm install jspdf html2canvas
  
  alert('PDF export requires jsPDF library. Install with: npm install jspdf html2canvas');
  
  // Example implementation:
  /*
  import jsPDF from 'jspdf';
  import html2canvas from 'html2canvas';

  const pdf = new jsPDF('p', 'mm', 'a4');
  
  pdf.setFontSize(20);
  pdf.text('Fraud Investigation Report', 20, 20);
  
  pdf.setFontSize(12);
  pdf.text(`Total Cases: ${stats.totalCases}`, 20, 40);
  pdf.text(`Total Fraud Amount: $${(stats.totalFraudAmount / 1000000).toFixed(2)}M`, 20, 50);
  pdf.text(`Recovery Rate: ${stats.recoveryRate}%`, 20, 60);
  
  pdf.save('fraud-report.pdf');
  */
};

/**
 * Generate investigation summary
 */
export const generateSummary = (nodes, edges, stats) => {
  const summary = {
    title: 'US Military Fraud Investigation Summary',
    generated: new Date().toLocaleString(),
    statistics: {
      total_cases: stats.totalCases,
      total_fraud_amount: `$${(stats.totalFraudAmount / 1000000).toFixed(2)}M`,
      total_recovered: `$${(stats.totalRecovered / 1000000).toFixed(2)}M`,
      recovery_rate: `${stats.recoveryRate}%`,
      organizations: stats.organizationCount,
      fraud_types: stats.fraudTypeCount,
    },
    network: {
      nodes: nodes.length,
      connections: edges.length,
    },
  };

  return summary;
};

/**
 * Helper function to download files
 */
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};

/**
 * Print investigation summary
 */
export const printSummary = (nodes, edges, stats) => {
  const summary = generateSummary(nodes, edges, stats);
  const printWindow = window.open('', '_blank');
  
  printWindow.document.write(`
    <html>
      <head>
        <title>Fraud Investigation Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #1a472a; border-bottom: 2px solid #d4af37; padding-bottom: 10px; }
          h2 { color: #d4af37; margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #1a472a; color: white; }
          .footer { margin-top: 40px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>${summary.title}</h1>
        <p>Generated: ${summary.generated}</p>
        
        <h2>Key Statistics</h2>
        <table>
          <tr><th>Metric</th><th>Value</th></tr>
          <tr><td>Total Cases</td><td>${summary.statistics.total_cases}</td></tr>
          <tr><td>Total Fraud Amount</td><td>${summary.statistics.total_fraud_amount}</td></tr>
          <tr><td>Total Recovered</td><td>${summary.statistics.total_recovered}</td></tr>
          <tr><td>Recovery Rate</td><td>${summary.statistics.recovery_rate}</td></tr>
          <tr><td>Organizations Involved</td><td>${summary.statistics.organizations}</td></tr>
          <tr><td>Fraud Types Identified</td><td>${summary.statistics.fraud_types}</td></tr>
        </table>
        
        <h2>Network Analysis</h2>
        <table>
          <tr><th>Metric</th><th>Value</th></tr>
          <tr><td>Total Nodes</td><td>${summary.network.nodes}</td></tr>
          <tr><td>Total Connections</td><td>${summary.network.connections}</td></tr>
        </table>
        
        <div class="footer">
          <p>This is an official fraud investigation record. Unauthorized distribution is prohibited.</p>
        </div>
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.print();
};
