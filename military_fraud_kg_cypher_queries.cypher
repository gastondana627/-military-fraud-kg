
// ============================================
// MILITARY FRAUD KNOWLEDGE GRAPH - NEO4J CYPHER QUERIES
// ============================================
// These queries can be used to create and query the military fraud knowledge graph in Neo4j

// ============================================
// 1. CREATE NODES
// ============================================

// Create Organization Nodes
CREATE (dod:Organization {
  id: "org_dod",
  name: "Department of Defense",
  budget: "$893 billion (FY2025)",
  audit_status: "Failed 7 audits (2018-2025)"
})

CREATE (va:Organization {
  id: "org_va",
  name: "Veterans Affairs",
  program_size: "$193 billion",
  flagship_program: "VA Disability Program"
})

CREATE (dodig:Organization {
  id: "org_dodig",
  name: "DoD Office of Inspector General",
  role: "Criminal investigations and fraud detection"
})

CREATE (vaoig:Organization {
  id: "org_vaoig",
  name: "VA Office of Inspector General",
  avg_investigations_per_year: 63,
  claims_processed_annually: "2 million+"
})

// Create Fraud Type Nodes
CREATE (fraud_disability:FraudType {
  id: "fraud_disability",
  name: "VA Disability Fraud",
  category: "benefits_fraud",
  affected_program: "VA Disability Program",
  program_size: "$193 billion",
  detection_rate: "Low (63 investigations/year)"
})

CREATE (fraud_bah:FraudType {
  id: "fraud_bah",
  name: "Basic Allowance for Housing Fraud",
  category: "personnel_benefits_fraud"
})

CREATE (fraud_recruiting:FraudType {
  id: "fraud_recruiting",
  name: "Military Recruiting Fraud",
  category: "recruitment_fraud",
  estimated_cost: "$100 million"
})

CREATE (fraud_tricare:FraudType {
  id: "fraud_tricare",
  name: "TRICARE Healthcare Fraud",
  category: "healthcare_fraud"
})

CREATE (fraud_contractor:FraudType {
  id: "fraud_contractor",
  name: "Defense Contractor Fraud",
  category: "contract_fraud",
  fy2024_recoveries: "$3 billion"
})

// Create Case Nodes
CREATE (case_kinsley:Case {
  id: "case_kinsley_kilpatrick",
  name: "Kinsley Kilpatrick - Fake Paralysis",
  year: 2025,
  monthly_fraud: "$7,900 disability + $20,000 vehicle",
  evidence: "Surveillance video: backflips, dancing, ball pit diving",
  status: "Convicted"
})

CREATE (case_heimann:Case {
  id: "case_gregory_heimann",
  name: "Gregory P. Heimann Jr. - Wheelchair Fraud",
  claimed_condition: "Wheelchair-bound",
  total_defrauded: "$245,000",
  status: "Arrested"
})

CREATE (case_riedling:Case {
  id: "case_crystal_riedling",
  name: "Crystal Riedling - Arm Disability Fraud",
  monthly_fraud: "$4,000+",
  total_defrauded: "$300,000",
  status: "Convicted"
})

CREATE (case_ngarng:Case {
  id: "case_ngarng_scandal",
  name: "Army National Guard Recruiting Bonus Scandal",
  individuals_implicated: "1,200+",
  confirmed_fraud: "$29 million+",
  potential_cost: "$100 million",
  status: "Multiple convictions"
})

CREATE (case_raytheon:Case {
  id: "case_raytheon",
  name: "Raytheon Company Settlement",
  settlement_amount: "$950 million",
  violations: ["Defective pricing", "Foreign bribery", "Export violations"],
  year: 2024,
  status: "Settled"
})

// Create Statistic Nodes
CREATE (stat_dod_fraud:Statistic {
  id: "stat_dod_confirmed_fraud",
  metric: "DOD Confirmed Fraud",
  amount: "$10.8 billion",
  time_period: "2017-2024"
})

CREATE (stat_military_scam:Statistic {
  id: "stat_military_scam_loss_2024",
  metric: "Military-Connected Consumer Fraud",
  amount: "$584 million",
  year: 2024
})

CREATE (stat_identity_theft:Statistic {
  id: "stat_identity_theft_2024",
  metric: "Military Identity Theft",
  total_reports: 38000,
  credit_card_fraud: 11000,
  year: 2024
})

// Create Scheme Nodes
CREATE (scheme_false_injury:Scheme {
  id: "scheme_false_injury",
  name: "False Injury/Disability Claims",
  description: "Veterans claim injuries or disabilities they don't have"
})

CREATE (scheme_false_dependents:Scheme {
  id: "scheme_false_dependents",
  name: "False Dependent Claims",
  description: "Service members claim dependents they don't have"
})

CREATE (scheme_recruiting_kickback:Scheme {
  id: "scheme_recruiting_kickback",
  name: "Recruiting Bonus Kickback",
  description: "Ineligible recruiters use other's names for bonuses",
  bonus_per_recruit: "$7,500"
})

CREATE (scheme_false_pricing:Scheme {
  id: "scheme_false_pricing",
  name: "False Cost and Pricing Data",
  description: "Contractors provide false cost data on contract bids"
})

// ============================================
// 2. CREATE RELATIONSHIPS
// ============================================

// Organization relationships
MATCH (dod:Organization {id: "org_dod"}), (dodig:Organization {id: "org_dodig"})
CREATE (dodig)-[:INVESTIGATES]->(dod)

MATCH (va:Organization {id: "org_va"}), (vaoig:Organization {id: "org_vaoig"})
CREATE (vaoig)-[:INVESTIGATES]->(va)

// Fraud type to organization relationships
MATCH (dod:Organization {id: "org_dod"}), (fraud_contractor:FraudType {id: "fraud_contractor"})
CREATE (dod)-[:HAS_FRAUD_TYPE {severity: "high", fy2024_recovery: "$3 billion"}]->(fraud_contractor)

MATCH (va:Organization {id: "org_va"}), (fraud_disability:FraudType {id: "fraud_disability"})
CREATE (va)-[:HAS_FRAUD_TYPE {program_size: "$193 billion"}]->(fraud_disability)

// Fraud type to case relationships
MATCH (fraud_disability:FraudType {id: "fraud_disability"}), (case_kinsley:Case {id: "case_kinsley_kilpatrick"})
CREATE (fraud_disability)-[:EXAMPLE_CASE]->(case_kinsley)

MATCH (fraud_disability:FraudType {id: "fraud_disability"}), (case_heimann:Case {id: "case_gregory_heimann"})
CREATE (fraud_disability)-[:EXAMPLE_CASE]->(case_heimann)

MATCH (fraud_disability:FraudType {id: "fraud_disability"}), (case_riedling:Case {id: "case_crystal_riedling"})
CREATE (fraud_disability)-[:EXAMPLE_CASE]->(case_riedling)

MATCH (fraud_recruiting:FraudType {id: "fraud_recruiting"}), (case_ngarng:Case {id: "case_ngarng_scandal"})
CREATE (fraud_recruiting)-[:EXAMPLE_CASE]->(case_ngarng)

MATCH (fraud_contractor:FraudType {id: "fraud_contractor"}), (case_raytheon:Case {id: "case_raytheon"})
CREATE (fraud_contractor)-[:EXAMPLE_CASE]->(case_raytheon)

// Fraud type to scheme relationships
MATCH (fraud_disability:FraudType {id: "fraud_disability"}), (scheme_false_injury:Scheme {id: "scheme_false_injury"})
CREATE (fraud_disability)-[:USES_SCHEME]->(scheme_false_injury)

MATCH (fraud_bah:FraudType {id: "fraud_bah"}), (scheme_false_dependents:Scheme {id: "scheme_false_dependents"})
CREATE (fraud_bah)-[:USES_SCHEME]->(scheme_false_dependents)

MATCH (fraud_recruiting:FraudType {id: "fraud_recruiting"}), (scheme_recruiting_kickback:Scheme {id: "scheme_recruiting_kickback"})
CREATE (fraud_recruiting)-[:USES_SCHEME]->(scheme_recruiting_kickback)

MATCH (fraud_contractor:FraudType {id: "fraud_contractor"}), (scheme_false_pricing:Scheme {id: "scheme_false_pricing"})
CREATE (fraud_contractor)-[:USES_SCHEME]->(scheme_false_pricing)

// ============================================
// 3. QUERY EXAMPLES
// ============================================

// Query 1: Find all fraud types associated with an organization
MATCH (org:Organization {name: "Department of Defense"})-[:HAS_FRAUD_TYPE]->(fraud:FraudType)
RETURN fraud.name, fraud.category, fraud.estimated_cost

// Query 2: Find all cases of a specific fraud type with details
MATCH (fraud:FraudType {name: "VA Disability Fraud"})-[:EXAMPLE_CASE]->(case:Case)
RETURN case.name, case.total_defrauded, case.status, case.year

// Query 3: Find all schemes used in disability fraud
MATCH (fraud:FraudType {name: "VA Disability Fraud"})-[:USES_SCHEME]->(scheme:Scheme)
RETURN scheme.name, scheme.description

// Query 4: Find investigation oversight structure
MATCH (oig:Organization)-[:INVESTIGATES]->(org:Organization)
RETURN oig.name AS "Oversight Agency", org.name AS "Organization Investigated"

// Query 5: Total fraud value by type
MATCH (org:Organization)-[:HAS_FRAUD_TYPE]->(fraud:FraudType)
RETURN fraud.name, fraud.fy2024_recoveries, fraud.category
ORDER BY fraud.name

// Query 6: Find all cases with their fraud types
MATCH (fraud:FraudType)-[:EXAMPLE_CASE]->(case:Case)
RETURN fraud.name AS "Fraud Type", case.name AS "Case", case.status, case.year
ORDER BY case.year DESC

// Query 7: Complex query - Find fraud with schemes and cases
MATCH (fraud:FraudType)-[:USES_SCHEME]->(scheme:Scheme)
MATCH (fraud)-[:EXAMPLE_CASE]->(case:Case)
RETURN fraud.name, scheme.name, case.name, case.status

// Query 8: Find statistics by metric type
MATCH (stat:Statistic)
RETURN stat.metric, stat.amount, stat.year, stat.time_period
ORDER BY stat.year DESC

// Query 9: Find all connected information about VA Disability Fraud
MATCH (fraud:FraudType {name: "VA Disability Fraud"})<-[:HAS_FRAUD_TYPE]-(org:Organization)
MATCH (fraud)-[:EXAMPLE_CASE]->(cases:Case)
MATCH (fraud)-[:USES_SCHEME]->(schemes:Scheme)
RETURN 
  org.name AS Organization,
  fraud.name AS FraudType,
  fraud.program_size AS ProgramSize,
  fraud.detection_rate AS DetectionRate,
  COLLECT(DISTINCT cases.name) AS ExampleCases,
  COLLECT(DISTINCT schemes.name) AS CommonSchemes

// Query 10: Get fraud by severity level
MATCH (org:Organization)-[rel:HAS_FRAUD_TYPE]->(fraud:FraudType)
WHERE rel.severity = "high"
RETURN org.name, fraud.name, rel.fy2024_recovery

// ============================================
// 4. ANALYTICAL QUERIES
// ============================================

// Query: Count nodes by type
MATCH (n)
RETURN labels(n)[0] as NodeType, count(n) as Count

// Query: Find most common fraud types (by number of cases)
MATCH (fraud:FraudType)-[:EXAMPLE_CASE]->(case:Case)
RETURN fraud.name, COUNT(case) as NumberOfCases
ORDER BY NumberOfCases DESC

// Query: Find investigation relationships
MATCH (investigator:Organization)-[:INVESTIGATES]->(target:Organization)
RETURN investigator.name, target.name

// Query: Calculate total confirmed fraud
MATCH (stat:Statistic {metric: "DOD Confirmed Fraud"})
RETURN stat.amount, stat.time_period

// ============================================
// 5. DELETE/UPDATE OPERATIONS
// ============================================

// Delete a specific case (if needed)
// MATCH (case:Case {id: "case_kinsley_kilpatrick"})
// DETACH DELETE case

// Update case information
// MATCH (case:Case {id: "case_kinsley_kilpatrick"})
// SET case.status = "Sentenced"
// RETURN case

// Add new fraud type
// CREATE (new_fraud:FraudType {
//   id: "fraud_new",
//   name: "New Fraud Type",
//   category: "category_name"
// })

// ============================================
// 6. GRAPH STATISTICS
// ============================================

// Get overall graph statistics
MATCH (n)
WITH COUNT(n) as total_nodes
MATCH ()-[r]->()
RETURN total_nodes, COUNT(r) as total_relationships

// Get nodes by type with counts
MATCH (n)
RETURN labels(n)[0] as Type, COUNT(*) as Count
ORDER BY Count DESC

// Get relationship types with counts
MATCH ()-[r]->()
RETURN TYPE(r) as RelationType, COUNT(*) as Count
ORDER BY Count DESC
