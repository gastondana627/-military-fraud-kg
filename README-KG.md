# Military Fraud Knowledge Graph - Production Web Application

**Status:** ✅ **Live in Production**  
**Frontend:** https://military-fraud-kg.vercel.app  
**Backend API:** https://military-fraud-kg-production.up.railway.app  
**License:** GPLv3

## Overview

A comprehensive, interactive knowledge graph modeling US Military fraud cases, fraud types, organizational relationships, and statistical insights. Now deployed as a full-stack web application with real-time visualization.

### Key Features
- ✅ Interactive Knowledge Graph - Visualize 89 nodes and 18+ relationships
- ✅ Live Production Deployment - Vercel (frontend) + Railway (backend)
- ✅ REST API - /api/graph and /api/health endpoints
- ✅ CORS-Enabled - Secure cross-origin requests
- ✅ Multiple Format Support - JSON, Python, Neo4j Cypher, GraphQL, RDF/Turtle

## Quick Start

### View Live Application
Frontend: https://military-fraud-kg.vercel.app
Backend API: https://military-fraud-kg-production.up.railway.app/api/health

### Local Development

Frontend:
cd frontend
npm install
REACT_APP_API_URL=http://localhost:4000 npm start

Backend:
pip install -r requirements.txt
python app.py

## Project Structure

Fraud_Cases/
├── app.py (Flask backend - production)
├── requirements.txt (Python dependencies)
├── military_fraud_kg_implementation.py (Knowledge graph class)
├── military_fraud_knowledge_graph.json (KG data - 89 nodes)
├── frontend/ (React app - Vercel)
│   ├── src/components/KnowledgeGraphVisualizer.jsx
│   ├── .env.local (Local API config)
│   └── package.json
├── military_fraud_kg.ttl (RDF/Turtle format)
├── military_fraud_kg_cypher_queries.cypher (Neo4j queries)
├── military_fraud_kg_graphql_schema.graphql (GraphQL schema)
└── README.md (This file)

## Data Structure

### Entity Types (89 Total Nodes)

Organizations (8): DoD, VA, FBI, SEC, GAO, DCIS, AFOSI, DHA
Fraud Types (9): VA Disability, BAH, Recruiting, TRICARE, Contractor, GTCC, Payroll, GI Bill, Identity Theft
Fraud Cases (25+): Kinsley Kilpatrick, Gregory Heimann, Raytheon, TRICARE Scheme, Pentagon Accounting
Fraud Schemes (20+): False Claims, Overbilling, Ghost Employees, Kickbacks
Statistics (17): $10.8B confirmed fraud, $584M consumer fraud, 38K identity theft reports

## API Endpoints

### Health Check
GET /api/health
Response: {"status": "healthy"}

### Get Full Knowledge Graph
GET /api/graph
Response: { "nodes": [...], "edges": [...] }

## Implementation Formats

1. JSON (Universal)
   File: military_fraud_knowledge_graph.json
   Use: REST APIs, web apps, data exchange

2. Python Classes (OOP)
   File: military_fraud_kg_implementation.py
   Use: Data analysis, research, backend logic

3. Neo4j Cypher (Graph DB)
   File: military_fraud_kg_cypher_queries.cypher
   Use: Complex relationship analysis

4. GraphQL (Modern APIs)
   File: military_fraud_kg_graphql_schema.graphql
   Use: Frontend APIs, Apollo Server

5. RDF/Turtle (Semantic Web)
   File: military_fraud_kg.ttl
   Use: SPARQL queries, linked data

## Deployment

### Frontend (Vercel)
Automatic deployment on push to main
Environment Variables:
REACT_APP_API_URL=https://military-fraud-kg-production.up.railway.app

### Backend (Railway)
Automatic deployment on push to main
Runs: python app.py
Port: 4000
Health: GET /api/health

### Environment Configuration

Local Development (.env.local - not committed):
REACT_APP_API_URL=http://localhost:4000

Production (Vercel Settings → Environment Variables):
REACT_APP_API_URL=https://military-fraud-kg-production.up.railway.app

## License & Legal

GNU General Public License v3.0 (GPLv3)

What This Means:
- ✅ Free to use, modify, distribute for open-source projects
- ✅ Any derivative work must also be open-source under GPLv3
- ❌ Cannot hide source code if you modify it commercially
- ❌ Bad actors must be transparent if they modify it
- ✅ You have legal protection if misused

Why GPLv3?
This knowledge graph is for research, education, and transparency into military fraud. GPLv3 ensures:
1. Bad actors can't create closed-source malicious versions
2. Any improvements stay open for the community
3. Legal accountability if misused

Disclaimer:
This knowledge graph contains publicly available information from government agencies and public records only. No classified, sensitive, or personal information is included.

## Statistics & Impact

Confirmed Military Fraud Data:
DOD Confirmed Fraud (2017-2024): $10.8 billion
False Claims Act Settlements (FY2024): $2.9 billion
Military Consumer Fraud (2024): $584 million
DCIS Recovery (6 months): $3 billion
AFOSI Recovery (FY2024): $623 million
DoD-OIG Criminal Recovery (FY2024): $1.496 billion

Notable Cases:
- Army National Guard Recruiting: $100M+ fraud
- Philadelphia VA Claims: $2.2M improper payments
- TRICARE Scheme: $65M healthcare fraud
- Raytheon Settlement: $950M contractor fraud
- Kinsley Kilpatrick: $189K disability fraud

## Roadmap & Future Enhancements

### Phase 2 (Next Updates)
- Better Node Visualization - Custom shapes, colors, clustering by fraud type
- Interactive Filtering - Filter by organization, fraud type, date range
- Search Functionality - Full-text search across all nodes
- Node Details Panel - Click node → see full metadata, sources, related cases
- Timeline View - Chronological fraud case timeline

### Phase 3 (Future)
- User Authentication - Login system for custom annotations
- Database Integration - PostgreSQL for persistent data
- Real-time Updates - Auto-sync with government agency APIs
- Predictive Analytics - ML model to detect fraud patterns
- Mobile App - React Native version
- AI Chat - Natural language queries on graph
- Export Features - PDF reports, CSV export

### Where to Add New Features

Visualization Improvements:
frontend/src/components/KnowledgeGraphVisualizer.jsx
- Modify: color_map, shape_map for node design
- Add: Filtering logic, search bar, detail panel

Backend Enhancements:
app.py
- Add: @app.route('/api/search', methods=['GET'])
- Add: @app.route('/api/node/<id>', methods=['GET'])
- Add: @app.route('/api/timeline', methods=['GET'])

Data Additions:
military_fraud_knowledge_graph.json
- Add new nodes in: nodes.fraud_cases, nodes.fraud_types
- Add new relationships in: relationships array

Styling/UX:
frontend/src/App.css
- Customize node colors, edges, animations
- Add dark mode support
- Improve responsive design

## Local Development Setup

Prerequisites:
- Node.js 16+
- Python 3.8+
- Git

Step 1: Clone & Install
git clone <your-repo>
cd Fraud_Cases

cd frontend
npm install
cd ..

pip install -r requirements.txt

Step 2: Run Locally
Terminal 1: Backend
python app.py
(Runs on http://localhost:4000)

Terminal 2: Frontend
cd frontend
npm start
(Runs on http://localhost:3000)

Step 3: Test API
curl http://localhost:4000/api/health
curl http://localhost:4000/api/graph

## Integration Examples

Python Backend:
from military_fraud_kg_implementation import MilitaryFraudKnowledgeGraph
kg = MilitaryFraudKnowledgeGraph()
kg.load_from_json('military_fraud_knowledge_graph.json')
disability_fraud = kg.get_node('fraud_disability')

React Frontend:
const API_URL = process.env.REACT_APP_API_URL;
useEffect(() => {
  fetch(`${API_URL}/api/graph`)
    .then(res => res.json())
    .then(data => {
      setNodes(data.nodes);
      setEdges(data.edges);
    });
}, []);

## Troubleshooting

CORS Error: Backend CORS misconfigured - check app.py allowed origins
Graph won't load: Check /api/health endpoint; verify Railway backend is running
Localhost API fails: Ensure REACT_APP_API_URL=http://localhost:4000 in .env.local
Data not rendering: Check browser DevTools → Network tab; confirm API returns valid JSON
Deploy fails on Vercel: Check env var REACT_APP_API_URL is set correctly in Settings
Deploy fails on Railway: Check logs; ensure requirements.txt has all dependencies

## Version History

v2.0 (2025-11-01): Full production deployment (Vercel + Railway), live API, CORS configured
v1.0 (2025-10-31): Initial release: 89 nodes, 18+ relationships, 5 format support

## Author & Credits

Built by: Gaston Dana
Stack: React + Flask + vis-network + Railway + Vercel
Data Sources: DOD-OIG, VA-OIG, DOJ, GAO, FTC, public records

## Support & Questions

Bug Reports: GitHub Issues
Feature Requests: GitHub Discussions
API Questions: Check /api/health and example queries
Deployment Help: See "Troubleshooting" section

## What's Working
✅ Frontend deployed to Vercel
✅ Backend deployed to Railway
✅ CORS-enabled for cross-origin requests
✅ Interactive knowledge graph visualization (89 nodes)
✅ REST API (/api/graph, /api/health)
✅ GPLv3 licensing for protection

## Next Session Checklist
- Improve node design (colors, shapes, clustering)
- Add search/filter functionality
- Add node detail panel on click
- Build timeline view for fraud cases
- Add export features (PDF, CSV)
- Implement user authentication

Last Updated: November 1, 2025
Status: 🟢 LIVE IN PRODUCTION
License: GPLv3

