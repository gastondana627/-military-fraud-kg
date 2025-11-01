# Military Fraud Knowledge Graph - Complete Documentation

## Overview

This is a comprehensive knowledge graph implementation modeling US Military fraud, including fraud types, cases, statistics, schemes, and organizational relationships. The knowledge graph is available in multiple formats for different use cases and platforms.

## Files Included

### 1. **military_fraud_knowledge_graph.json**
- **Format:** JSON
- **Use Case:** Universal data exchange, API backends, web applications
- **Structure:** Organized nodes (organizations, fraud types, cases, statistics, schemes) with relationships
- **Size:** 57 total nodes, 13+ relationships
- **Best For:** REST APIs, NoSQL databases, GraphQL backends

### 2. **military_fraud_kg_implementation.py**
- **Format:** Python class-based OOP implementation
- **Use Case:** Python-based applications, data analysis, research
- **Features:**
  - `MilitaryFraudKnowledgeGraph` class with full CRUD operations
  - Query methods (by type, property, connections)
  - Search functionality
  - Export to JSON
  - Summary statistics
  - Node relationship traversal
- **Dependencies:** Python 3.7+
- **Usage:**
  ```python
  from military_fraud_kg_implementation import MilitaryFraudKnowledgeGraph
  kg = MilitaryFraudKnowledgeGraph()
  # Add nodes and build graph
  ```

### 3. **military_fraud_kg_cypher_queries.cypher**
- **Format:** Neo4j Cypher Query Language
- **Use Case:** Neo4j graph database implementation
- **Contents:**
  - 37 CREATE statements for populating the graph
  - 10+ analytical query examples
  - Relationship definitions
  - CRUD operations
- **Best For:** Large-scale graph analytics, relationship querying
- **Prerequisites:** Neo4j database instance

### 4. **military_fraud_kg_graphql_schema.graphql**
- **Format:** GraphQL schema definition
- **Use Case:** GraphQL API endpoints, web applications
- **Features:**
  - 18 custom types (Organization, FraudType, Case, etc.)
  - Complex query types with nesting
  - Mutations for data modification
  - Subscriptions for real-time updates
  - Input types for mutations
- **Best For:** Modern web APIs, frontend applications

### 5. **military_fraud_kg_graphql_queries.graphql**
- **Format:** GraphQL query examples
- **Contents:**
  - 10 query examples
  - 4 mutation examples
  - 2 subscription examples
  - Complex nested queries
  - Filtering and sorting examples
- **Use:** Reference implementation, testing GraphQL schema

### 6. **military_fraud_kg.ttl**
- **Format:** RDF/Turtle (Semantic Web)
- **Use Case:** RDF graph databases, semantic web applications
- **Contents:**
  - Class definitions using RDFS
  - Property definitions
  - Instance data
  - Linked data with external vocabularies (FOAF, DCAT, DCTerms)
- **Best For:** Semantic web systems, SPARQL queries, linked data

## Data Structure

### Entity Types

#### Organizations
- Department of Defense (DoD)
- Veterans Affairs (VA)
- Investigation agencies (DoD-IG, VA-IG, DCIS, AFOSI)
- Defense Health Agency

#### Fraud Types
1. **VA Disability Fraud** - False disability claims
2. **Basic Allowance for Housing (BAH) Fraud** - False housing allowances
3. **Military Recruiting Fraud** - False recruitment bonuses
4. **TRICARE Healthcare Fraud** - Fraudulent medical billing
5. **Defense Contractor Fraud** - Contract violations
6. **Government Travel Card (GTCC) Fraud** - Travel card misuse
7. **Payroll Fraud** - False compensation claims
8. **GI Bill Fraud** - Education benefits fraud
9. **Identity Theft** - Theft of military identities

#### Fraud Cases (Notable Examples)
- Kinsley Kilpatrick ($189k disability fraud)
- Gregory Heimann ($245k wheelchair fraud)
- Army National Guard Recruiting Scandal ($100m+)
- Raytheon ($950m contractor fraud)
- TRICARE $65 million scheme

#### Statistics
- $10.8 billion DOD confirmed fraud (2017-2024)
- $584 million military consumer fraud loss (2024)
- $193 billion VA Disability Program
- 38,000 identity theft reports (2024)

## Implementation Guides

### Using Python Implementation

```python
from military_fraud_kg_implementation import MilitaryFraudKnowledgeGraph, Node, Relationship, EntityType, RelationshipType

# Create knowledge graph
kg = MilitaryFraudKnowledgeGraph()

# Add nodes
node = Node(
    id="fraud_new",
    name="New Fraud Type",
    entity_type=EntityType.FRAUD_TYPE,
    properties={"category": "fraud_category"}
)
kg.add_node(node)

# Query nodes
fraud_types = kg.get_nodes_by_type(EntityType.FRAUD_TYPE)
disability_cases = kg.get_fraud_cases_by_type("fraud_disability")

# Export
kg.to_json("output.json")
kg.print_summary()
```

### Using Neo4j (Cypher)

1. Install Neo4j desktop or set up Neo4j instance
2. Open Neo4j browser (typically http://localhost:7474)
3. Copy CREATE statements from `military_fraud_kg_cypher_queries.cypher`
4. Run queries to populate database
5. Use MATCH queries for analysis

Example query:
```cypher
MATCH (fraud:FraudType)-[:EXAMPLE_CASE]->(case:Case)
RETURN fraud.name, COUNT(case) as CaseCount
ORDER BY CaseCount DESC
```

### Using GraphQL

1. Set up GraphQL server (Apollo Server, GraphQL Yoga, etc.)
2. Import schema from `military_fraud_kg_graphql_schema.graphql`
3. Implement resolvers
4. Use queries from `military_fraud_kg_graphql_queries.graphql`

Example setup (Apollo Server):
```javascript
import { ApolloServer } = require('apollo-server');
const typeDefs = require('./military_fraud_kg_graphql_schema.graphql');
// Implement resolvers
const server = new ApolloServer({ typeDefs, resolvers });
```

### Using RDF/SPARQL

1. Load TTL file into RDF triple store (Jena, Virtuoso, Blazegraph)
2. Query using SPARQL

Example SPARQL query:
```sparql
PREFIX mfkg: <http://military-fraud-kg.org/>
SELECT ?fraudType ?caseCount
WHERE {
  ?fraudType mfkg:hasExampleCase ?case
}
GROUP BY ?fraudType
ORDER BY DESC(?caseCount)
```

## Key Statistics

### Confirmed Fraud
- **DOD Confirmed Fraud:** $10.8 billion (2017-2024)
- **False Claims Act Settlements (FY2024):** $2.9 billion
- **Military Consumer Fraud (2024):** $584 million

### Detection & Enforcement
- **VA Disability Investigations/Year:** ~63 (out of 2M+ claims)
- **DCIS Recovery (6 months):** $3 billion
- **AFOSI Recovery (FY2024):** $623 million
- **DoD-OIG Criminal Recovery (FY2024):** $1.496 billion

### Major Scandals
- Army National Guard Recruiting: $100 million
- Philadelphia VA Claims: $2.2 million improper payments
- TRICARE $65 million scheme
- Raytheon Settlement: $950 million

## Querying Examples

### JSON (Node.js)
```javascript
const data = require('./military_fraud_knowledge_graph.json');
const fraudTypes = data.nodes.fraud_types;
const contracts = data.nodes.fraud_cases.filter(c => c.fraud_type === 'fraud_contractor');
```

### Python
```python
kg = MilitaryFraudKnowledgeGraph()
disability_fraud = kg.get_node("fraud_disability")
cases = kg.get_fraud_cases_by_type("fraud_disability")
schemes = kg.get_fraud_schemes_by_type("fraud_disability")
```

### Neo4j (Cypher)
```cypher
MATCH (org:Organization)-[:HAS_FRAUD_TYPE]->(fraud:FraudType)
-[:EXAMPLE_CASE]->(case:Case)
RETURN org.name, fraud.name, case.name, case.totalDefrauded
```

### GraphQL
```graphql
query {
  fraudTypeWithDetails(id: "fraud_disability") {
    fraudType { name category }
    cases { name status totalDefrauded }
    schemes { name }
  }
}
```

## Data Sources

All data in this knowledge graph is sourced from:
- DOD Office of Inspector General reports
- VA Office of Inspector General documents
- Department of Justice announcements
- Federal Trade Commission data
- Government Accountability Office (GAO) reports
- Public news reports and court records

## Use Cases

1. **Fraud Analysis:** Identify fraud patterns and trends
2. **Risk Assessment:** Evaluate fraud risk in military programs
3. **Resource Allocation:** Determine investigation priorities
4. **Training:** Train personnel on fraud detection
5. **Compliance:** Support compliance and oversight
6. **Research:** Academic research on military fraud
7. **Visualization:** Create interactive dashboards
8. **API Development:** Build fraud reporting systems

## Extending the Knowledge Graph

### Adding New Nodes
```python
new_case = Node(
    id="case_new",
    name="New Fraud Case",
    entity_type=EntityType.CASE,
    properties={"year": 2025, "status": "Convicted"}
)
kg.add_node(new_case)
```

### Adding New Relationships
```python
relationship = Relationship(
    source_id="fraud_type_id",
    target_id="case_id",
    relationship_type=RelationshipType.EXAMPLE_CASE
)
kg.add_relationship(relationship)
```

### Adding New Fraud Types
- Define new fraud type node
- Link to organizations
- Add example cases
- Document schemes used
- Add statistics

## Integration with Existing Systems

- **REST APIs:** Use JSON format
- **GraphQL APIs:** Use GraphQL schema
- **Graph Databases:** Use Cypher for Neo4j
- **RDF/Semantic Web:** Use Turtle format
- **Python Applications:** Use class-based implementation
- **Data Warehouses:** Use JSON for ETL

## Performance Considerations

- **JSON:** Best for small to medium datasets
- **Neo4j:** Best for complex relationship queries
- **GraphQL:** Best for API integration
- **RDF:** Best for semantic web applications
- **Python Classes:** Best for programmatic access

## Version History

- **v1.0** (2025-10-31): Initial release with 57 nodes, 13+ relationships

## License & Attribution

This knowledge graph is based on publicly available information from government agencies and public records. No personal or sensitive information is included.

## Future Enhancements

- Additional fraud cases
- Real-time data integration
- Predictive analytics
- Automated fraud detection patterns
- Integration with government databases
- Enhanced visualization tools
- Mobile application support

## Support & Questions

For questions or issues regarding this knowledge graph:
- Review the specific format documentation
- Consult format-specific resources (Neo4j, GraphQL, RDF documentation)
- Check query examples in respective files

---

**Created:** October 31, 2025  
**Format Compatibility:** JSON, Python 3.7+, Neo4j, GraphQL, RDF/SPARQL  
**Total Entities:** 57 nodes, 13+ relationships  
**Status:** Complete and ready for deployment
