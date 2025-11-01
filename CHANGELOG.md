# Changelog

All notable changes documented here.

## [v2.0] - 2025-11-01 (CURRENT)

### Added
- Full production deployment (Vercel + Railway)
- REST API: /api/graph and /api/health endpoints
- CORS configuration for Vercel domains
- Interactive vis-network visualization
- GPLv3 licensing
- Production README documentation

### Fixed
- Flask app initialization order (app before CORS)
- CORS headers for cross-origin requests
- Environment variable configuration
- Backend root directory setup

### Changed
- Moved backend from /backend folder to root
- Updated CORS to allow both Vercel domains
- Restructured project for Railway deployment

### Technical
- Frontend: React with vis-network
- Backend: Flask running on port 4000
- Deployment: Vercel (frontend) + Railway (backend)
- Data: 89 nodes, 18+ relationships

---

## [v1.0] - 2025-10-31

### Initial Release
- Knowledge graph with 89 nodes
- 18+ relationships
- 5 format support:
  * JSON (universal)
  * Python classes (OOP)
  * Neo4j Cypher queries
  * GraphQL schema
  * RDF/Turtle (semantic web)
- Comprehensive documentation
- Multiple fraud types and cases

---

## [v2.1] - 2025-XX-XX (PLANNED)

### Planned Features
- Improved node visualization (custom colors/shapes)
- Entity type clustering
- Search functionality
- Filter by organization/fraud type
- Node detail panel on click
- Timeline view for fraud cases

---

## [v3.0] - 2025-XX-XX (PLANNED)

### Planned Features
- User authentication (JWT)
- PostgreSQL database integration
- Custom user annotations
- Saved searches and filters
- Real-time data sync
- Predictive fraud detection

---

## Template for Next Update

When you add new features, copy this:

## [vX.X] - YYYY-MM-DD

### Added
- Feature 1
- Feature 2

### Fixed
- Bug fix 1
- Bug fix 2

### Changed
- Change 1
- Change 2

### Technical
- Tech detail 1
- Tech detail 2

---

## Commit Prefix Key

- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Styling
- refactor: Code reorganization
- test: Tests added
- chore: Maintenance
