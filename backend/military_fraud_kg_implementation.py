
"""
Military Fraud Knowledge Graph Implementation
Comprehensive mapping of fraud types, statistics, cases, and relationships
Author: Research Assistant
Date: 2025-10-31
"""

from typing import Dict, List, Optional, Set
from dataclasses import dataclass, field
from enum import Enum
import json


class EntityType(Enum):
    """Enumeration of entity types in the knowledge graph"""
    ORGANIZATION = "organization"
    FRAUD_TYPE = "fraud_type"
    CASE = "case"
    STATISTIC = "statistic"
    SCHEME = "scheme"


class RelationshipType(Enum):
    """Enumeration of relationship types"""
    HAS_FRAUD_TYPE = "HAS_FRAUD_TYPE"
    INVESTIGATES = "INVESTIGATES"
    EXAMPLE_CASE = "EXAMPLE_CASE"
    USES_SCHEME = "USES_SCHEME"
    ENFORCES = "ENFORCES"
    PARENT_ORG = "PARENT_ORG"


@dataclass
class Node:
    """Base class for knowledge graph nodes"""
    id: str
    name: str
    entity_type: EntityType
    properties: Dict[str, any] = field(default_factory=dict)

    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "name": self.name,
            "type": self.entity_type.value,
            "properties": self.properties
        }


@dataclass
class Relationship:
    """Represents a relationship between two nodes"""
    source_id: str
    target_id: str
    relationship_type: RelationshipType
    properties: Dict[str, any] = field(default_factory=dict)

    def to_dict(self) -> Dict:
        return {
            "source": self.source_id,
            "target": self.target_id,
            "relationship": self.relationship_type.value,
            "properties": self.properties
        }


class MilitaryFraudKnowledgeGraph:
    """
    Knowledge graph for US Military Fraud

    Features:
    - Add/remove nodes and relationships
    - Query nodes by type or properties
    - Find connected nodes
    - Export to various formats
    - Analyze fraud patterns
    """

    def __init__(self, title: str = "US Military Fraud Knowledge Graph"):
        self.title = title
        self.nodes: Dict[str, Node] = {}
        self.relationships: List[Relationship] = []
        self.metadata = {
            "title": title,
            "version": "1.0",
            "last_updated": "2025-10-31"
        }

    def add_node(self, node: Node) -> None:
        """Add a node to the knowledge graph"""
        if node.id in self.nodes:
            print(f"Warning: Node {node.id} already exists. Updating.")
        self.nodes[node.id] = node

    def add_relationship(self, relationship: Relationship) -> None:
        """Add a relationship to the knowledge graph"""
        # Verify nodes exist
        if relationship.source_id not in self.nodes:
            raise ValueError(f"Source node {relationship.source_id} not found")
        if relationship.target_id not in self.nodes:
            raise ValueError(f"Target node {relationship.target_id} not found")
        self.relationships.append(relationship)

    def get_node(self, node_id: str) -> Optional[Node]:
        """Retrieve a node by ID"""
        return self.nodes.get(node_id)

    def get_nodes_by_type(self, entity_type: EntityType) -> List[Node]:
        """Get all nodes of a specific type"""
        return [node for node in self.nodes.values() 
                if node.entity_type == entity_type]

    def get_nodes_by_property(self, key: str, value: any) -> List[Node]:
        """Get nodes matching a property value"""
        return [node for node in self.nodes.values() 
                if key in node.properties and node.properties[key] == value]

    def get_connected_nodes(self, node_id: str, 
                           direction: str = "both") -> List[Node]:
        """
        Get nodes connected to a given node
        direction: 'in', 'out', or 'both'
        """
        connected_ids = set()
        for rel in self.relationships:
            if direction in ['out', 'both'] and rel.source_id == node_id:
                connected_ids.add(rel.target_id)
            if direction in ['in', 'both'] and rel.target_id == node_id:
                connected_ids.add(rel.source_id)

        return [self.nodes[nid] for nid in connected_ids]

    def get_relationships(self, source_id: Optional[str] = None,
                         target_id: Optional[str] = None,
                         rel_type: Optional[RelationshipType] = None) -> List[Relationship]:
        """Query relationships by source, target, or type"""
        results = self.relationships
        if source_id:
            results = [r for r in results if r.source_id == source_id]
        if target_id:
            results = [r for r in results if r.target_id == target_id]
        if rel_type:
            results = [r for r in results if r.relationship_type == rel_type]
        return results

    def get_fraud_cases_by_type(self, fraud_type_id: str) -> List[Node]:
        """Get all cases associated with a fraud type"""
        rels = self.get_relationships(source_id=fraud_type_id,
                                     rel_type=RelationshipType.EXAMPLE_CASE)
        return [self.get_node(rel.target_id) for rel in rels]

    def get_fraud_schemes_by_type(self, fraud_type_id: str) -> List[Node]:
        """Get all schemes used in a fraud type"""
        rels = self.get_relationships(source_id=fraud_type_id,
                                     rel_type=RelationshipType.USES_SCHEME)
        return [self.get_node(rel.target_id) for rel in rels]

    def get_organization_oversight(self, org_id: str) -> List[Node]:
        """Get oversight agencies for an organization"""
        rels = self.get_relationships(target_id=org_id,
                                     rel_type=RelationshipType.INVESTIGATES)
        return [self.get_node(rel.source_id) for rel in rels]

    def search_nodes(self, query: str) -> List[Node]:
        """Search nodes by name or properties"""
        results = []
        query_lower = query.lower()
        for node in self.nodes.values():
            if query_lower in node.name.lower():
                results.append(node)
            else:
                for key, val in node.properties.items():
                    if isinstance(val, str) and query_lower in val.lower():
                        results.append(node)
                        break
        return results

    def to_dict(self) -> Dict:
        """Export knowledge graph to dictionary"""
        return {
            "metadata": self.metadata,
            "nodes": [node.to_dict() for node in self.nodes.values()],
            "relationships": [rel.to_dict() for rel in self.relationships],
            "statistics": {
                "total_nodes": len(self.nodes),
                "total_relationships": len(self.relationships),
                "nodes_by_type": {
                    et.value: len(self.get_nodes_by_type(et))
                    for et in EntityType
                }
            }
        }

    def to_json(self, filepath: str) -> None:
        """Export knowledge graph to JSON file"""
        with open(filepath, 'w') as f:
            json.dump(self.to_dict(), f, indent=2)
        print(f"Knowledge graph exported to {filepath}")

    def print_summary(self) -> None:
        """Print a summary of the knowledge graph"""
        print(f"\n{'='*60}")
        print(f"  {self.title}")
        print(f"{'='*60}")
        print(f"Total Nodes: {len(self.nodes)}")
        print(f"Total Relationships: {len(self.relationships)}")
        print(f"\nNodes by Type:")
        for et in EntityType:
            count = len(self.get_nodes_by_type(et))
            if count > 0:
                print(f"  - {et.value}: {count}")
        print(f"\nRelationships by Type:")
        rel_types = {}
        for rel in self.relationships:
            rel_type = rel.relationship_type.value
            rel_types[rel_type] = rel_types.get(rel_type, 0) + 1
        for rel_type, count in sorted(rel_types.items()):
            print(f"  - {rel_type}: {count}")
        print(f"{'='*60}\n")


# Example usage and initialization
def create_military_fraud_kg() -> MilitaryFraudKnowledgeGraph:
    """Create and populate the military fraud knowledge graph"""
    kg = MilitaryFraudKnowledgeGraph()

    # Add Organizations
    org_dod = Node(
        id="org_dod",
        name="Department of Defense",
        entity_type=EntityType.ORGANIZATION,
        properties={
            "budget": "$893 billion (FY2025)",
            "audit_status": "Failed 7 audits (2018-2025)",
            "type": "government_agency"
        }
    )
    kg.add_node(org_dod)

    org_va = Node(
        id="org_va",
        name="Veterans Affairs",
        entity_type=EntityType.ORGANIZATION,
        properties={
            "program_size": "$193 billion",
            "flagship_program": "VA Disability Program",
            "type": "government_agency"
        }
    )
    kg.add_node(org_va)

    # Add Fraud Types
    fraud_disability = Node(
        id="fraud_disability",
        name="VA Disability Fraud",
        entity_type=EntityType.FRAUD_TYPE,
        properties={
            "category": "benefits_fraud",
            "affected_program": "VA",
            "program_size": "$193 billion",
            "detection_rate": "Low (63 investigations/year)"
        }
    )
    kg.add_node(fraud_disability)

    fraud_contractor = Node(
        id="fraud_contractor",
        name="Defense Contractor Procurement Fraud",
        entity_type=EntityType.FRAUD_TYPE,
        properties={
            "category": "contract_fraud",
            "fy2024_recoveries": "$3 billion",
            "legal_basis": "False Claims Act"
        }
    )
    kg.add_node(fraud_contractor)

    # Add Cases
    case_kinsley = Node(
        id="case_kinsley_kilpatrick",
        name="Kinsley Kilpatrick - Fake Paralysis",
        entity_type=EntityType.CASE,
        properties={
            "year": 2025,
            "fraud_type": "fraud_disability",
            "monthly_fraud": "$7,900 disability + $20,000 vehicle",
            "evidence": "Surveillance: backflips, dancing, ball pits"
        }
    )
    kg.add_node(case_kinsley)

    # Add Statistics
    stat_total_fraud = Node(
        id="stat_dod_confirmed_fraud",
        name="Total DOD Confirmed Fraud",
        entity_type=EntityType.STATISTIC,
        properties={
            "amount": "$10.8 billion",
            "time_period": "2017-2024",
            "note": "Only confirmed cases"
        }
    )
    kg.add_node(stat_total_fraud)

    # Add Relationships
    kg.add_relationship(Relationship(
        source_id="fraud_disability",
        target_id="case_kinsley_kilpatrick",
        relationship_type=RelationshipType.EXAMPLE_CASE
    ))

    kg.add_relationship(Relationship(
        source_id="org_dod",
        target_id="fraud_contractor",
        relationship_type=RelationshipType.HAS_FRAUD_TYPE,
        properties={"severity": "high"}
    ))

    return kg


if __name__ == "__main__":
    # Create and display the knowledge graph
    kg = create_military_fraud_kg()
    kg.print_summary()

    # Example queries
    print("\nExample Queries:")
    print("===============")

    # Query 1: Get all fraud types
    fraud_types = kg.get_nodes_by_type(EntityType.FRAUD_TYPE)
    print(f"\n1. All Fraud Types ({len(fraud_types)} total):")
    for ft in fraud_types:
        print(f"   - {ft.name}")

    # Query 2: Get cases related to disability fraud
    disability_cases = kg.get_fraud_cases_by_type("fraud_disability")
    print(f"\n2. Disability Fraud Cases ({len(disability_cases)} total):")
    for case in disability_cases:
        print(f"   - {case.name}")

    # Query 3: Get organizations with fraud
    orgs_with_fraud = kg.get_nodes_by_type(EntityType.ORGANIZATION)
    print(f"\n3. Organizations with Fraud ({len(orgs_with_fraud)} total):")
    for org in orgs_with_fraud:
        print(f"   - {org.name}")
