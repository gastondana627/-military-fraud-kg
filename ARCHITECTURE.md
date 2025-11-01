# System Architecture

## High-Level Overview

Frontend (React/Vercel)
    ↓ (HTTPS requests)
    ↓
Backend API (Flask/Railway)
    ↓ (reads)
    ↓
Knowledge Graph (JSON file)

## Components

### Frontend Layer (Vercel)
- React single-page app
- vis-network for visualization
- Environment variable: REACT_APP_API_URL
- Hosted at: https://military-fraud-kg.vercel.app

### API Layer (Railway)
- Flask REST API
- 2 endpoints: /api/health, /api/graph
- CORS enabled for Vercel domains
- Hosted at: https://military-fraud-kg-production.up.railway.app
- Port: 4000

### Data Layer (GitHub)
- military_fraud_knowledge_graph.json (89 nodes)
- military_fraud_kg_implementation.py (graph class)
- Multiple format support (Neo4j, GraphQL, RDF)

## Data Flow

1. User visits https://military-fraud-kg.vercel.app
2. React app loads
3. useEffect calls fetch(`${API_URL}/api/graph`)
4. Backend receives request, queries KG
5. Returns JSON with 89 nodes + 18 edges
6. Frontend renders vis-network visualization
7. User can interact with graph

## Deployment Pipeline

GitHub → Vercel (auto-deploy on push)
     ↓
     Triggers build: npm install && npm run build
     ↓
     Deploys to vercel.com CDN

GitHub → Railway (auto-deploy on push)
     ↓
     Triggers build: pip install -r requirements.txt
     ↓
     Starts: python app.py
     ↓
     Runs on railway.app

## File Organization

/Fraud_Cases
├── Root Level Files (Backend runs here)
│   ├── app.py (main Flask app)
│   ├── military_fraud_kg_implementation.py (graph class)
│   ├── military_fraud_knowledge_graph.json (data)
│   ├── requirements.txt (Python dependencies)
│
├── /frontend (React app - deployed to Vercel)
│   ├── src/
│   │   ├── components/KnowledgeGraphVisualizer.jsx
│   │   ├── App.js
│   │   └── App.css
│   ├── package.json
│   └── .env.local (local API URL)
│
└── Documentation
    ├── README.md (main docs)
    ├── ROADMAP.md (future features)
    ├── DEVELOPMENT.md (dev guide - THIS FILE)
    └── ARCHITECTURE.md (system design - THIS FILE)

## API Contract

GET /api/health
Response: {"status": "healthy"}
Status: 200 OK

GET /api/graph
Response: {
  "nodes": [
    {
      "id": "org_dod",
      "label": "Department of Defense",
      "color": "#4ECDC4",
      "shape": "ellipse",
      ...
    }
  ],
  "edges": [
    {
      "from": "org_dod",
      "to": "fraud_disability",
      "label": "HAS_FRAUD_TYPE",
      ...
    }
  ]
}
Status: 200 OK

Error Response:
{"error": "Knowledge graph not loaded"}
Status: 500 Internal Server Error

## CORS Configuration

Allowed Origins:
- https://military-fraud-kg.vercel.app (production)
- https://military-fraud-7a8qo3wow-gastondana627s-projects.vercel.app (staging)
- http://localhost:3000 (local dev)

Methods: GET, POST, OPTIONS
Headers: Content-Type

## Environment Variables

Local (.env.local - not committed):
REACT_APP_API_URL=http://localhost:4000

Production (Vercel Settings):
REACT_APP_API_URL=https://military-fraud-kg-production.up.railway.app

## Scaling Considerations

Current Setup:
- JSON file in repo (89 nodes)
- Real-time reads only
- No database

Future Scaling:
- Replace JSON with PostgreSQL
- Add caching with Redis
- Split backend into microservices
- Add GraphQL layer

## Security

- GPLv3 licensed
- Public data only
- CORS restricted to known domains
- No authentication required (yet)
- No sensitive information stored
