print(">>> RUNNING app.py <<<")

from flask import Flask, jsonify, request
from flask_cors import CORS
from military_fraud_kg_implementation import (
    MilitaryFraudKnowledgeGraph,
    EntityType,
    Node,
    Relationship,
    RelationshipType
)
import json

app = Flask(__name__)
CORS(app)

# Initialize KG
kg = MilitaryFraudKnowledgeGraph()

# Load JSON data and populate KG nodes/edges
try:
    with open('military_fraud_knowledge_graph.json', 'r') as f:
        kg_data = json.load(f)

    # Populate KG with nodes
    for org in kg_data.get("nodes", {}).get("organizations", []):
        kg.add_node(Node(
            id=org["id"],
            name=org["name"],
            entity_type=EntityType.ORGANIZATION,
            properties={k: v for k, v in org.items() if k not in ("id", "name", "type")}
        ))
    for ft in kg_data.get("nodes", {}).get("fraud_types", []):
        kg.add_node(Node(
            id=ft["id"],
            name=ft["name"],
            entity_type=EntityType.FRAUD_TYPE,
            properties={k: v for k, v in ft.items() if k not in ("id", "name")}
        ))
    for case in kg_data.get("nodes", {}).get("fraud_cases", []):
        kg.add_node(Node(
            id=case["id"],
            name=case["name"],
            entity_type=EntityType.CASE,
            properties={k: v for k, v in case.items() if k not in ("id", "name")}
        ))
    for stat in kg_data.get("nodes", {}).get("statistics", []):
        kg.add_node(Node(
            id=stat["id"],
            name=stat.get("metric", stat.get("id", "Unknown")),
            entity_type=EntityType.STATISTIC,
            properties=stat
        ))
    for scheme in kg_data.get("nodes", {}).get("fraud_schemes", []):
        kg.add_node(Node(
            id=scheme["id"],
            name=scheme["name"],
            entity_type=EntityType.SCHEME,
            properties={k: v for k, v in scheme.items() if k not in ("id", "name")}
        ))

    # Add relationships
    for rel in kg_data.get("relationships", []):
        try:
            kg.add_relationship(Relationship(
                source_id=rel["source"],
                target_id=rel["target"],
                relationship_type=RelationshipType(rel["relationship"]),
                properties=rel.get("properties", {})
            ))
        except Exception as e:
            print(f"Skipped relationship: {rel} due to error: {e}")

    print(f"✓ Knowledge Graph loaded with {len(kg.nodes)} nodes and {len(kg.relationships)} relationships")

except Exception as e:
    print(f"✗ Error loading KG: {e}")

# --------------------
# ALL ROUTE DECORATORS GO HERE,
# NOT inside any __main__ or function!
# --------------------

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"}), 200

@app.route('/api/graph', methods=['GET'])
def get_full_graph():
    """Construct nodes and edges from your current KG data for visualization"""
    nodes_list = []
    edges_list = []
    color_map = {
        'organization': '#4ECDC4',
        'fraud_type': '#FF6B6B',
        'case': '#95E1D3',
        'statistic': '#FFE66D',
        'scheme': '#F7DC6F',
    }
    shape_map = {
        'organization': 'ellipse',
        'fraud_type': 'box',
        'case': 'diamond',
        'statistic': 'dot',
        'scheme': 'box',
    }
    
    # UPDATED: Include ALL properties including sources
    for node in kg.nodes.values():
        node_type = node.entity_type.value
        
        # Build node object with all metadata
        node_obj = {
            'id': node.id,
            'label': node.name,
            'title': node.name,
            'color': color_map.get(node_type, '#999'),
            'shape': shape_map.get(node_type, 'ellipse'),
        }
        
        # Add all properties to the node (including sources)
        for key, value in node.properties.items():
            node_obj[key] = value
        
        nodes_list.append(node_obj)
    
    for rel in kg.relationships:
        edges_list.append({
            'from': rel.source_id,
            'to': rel.target_id,
            'label': rel.relationship_type.value,
            'arrows': 'to',
            'color': {'color': '#888', 'opacity': 0.6}
        })
    
    return jsonify({'nodes': nodes_list, 'edges': edges_list}), 200

# ... add your other API endpoints here (same way as above, OUTSIDE main) ...

if __name__ == '__main__':
    print("\n" + "="*60)
    print("MILITARY FRAUD KNOWLEDGE GRAPH - FLASK API")
    print("="*60)
    print("🚀 Backend running on http://localhost:4000")
    print("\n📝 Available endpoints:")
    print("   GET /api/health")
    print("   GET /api/graph (full graph for visualization)")
    print("="*60 + "\n")
    print("Registered routes:")
    for rule in app.url_map.iter_rules():
        print(f"{rule} -> {rule.endpoint}")
    app.run(debug=True, host='0.0.0.0', port=4000)
