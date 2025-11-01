# kg_test.py (or whatever you want to call it)

from military_fraud_kg_implementation import MilitaryFraudKnowledgeGraph, Node, EntityType

# Initialize the knowledge graph
kg = MilitaryFraudKnowledgeGraph()

# Print summary
kg.print_summary()

# Example queries
print("\n" + "="*60)
print("EXAMPLE QUERIES")
print("="*60)

# Query 1: Get all fraud types
fraud_types = kg.get_nodes_by_type(EntityType.FRAUD_TYPE)
print(f"\nAll Fraud Types ({len(fraud_types)} total):")
for ft in fraud_types:
    print(f"  - {ft.name}")

# Query 2: Get organizations
orgs = kg.get_nodes_by_type(EntityType.ORGANIZATION)
print(f"\nAll Organizations ({len(orgs)} total):")
for org in orgs:
    print(f"  - {org.name}")

# Query 3: Search for specific nodes
print("\nSearch Results for 'disability':")
results = kg.search_nodes("disability")
for result in results:
    print(f"  - {result.name}")

# Query 4: Export to JSON
kg.to_json("military_fraud_kg_output.json")
print("\n✓ Exported to military_fraud_kg_output.json")
