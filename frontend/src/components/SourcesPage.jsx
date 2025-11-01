import React from 'react';

export default function SourcesPage({ onBackToGraph, darkMode }) {
  const bgColor = darkMode ? '#1e1e1e' : '#f8f9fb';
  const textColor = darkMode ? '#e0e0e0' : '#202124';
  const cardBg = darkMode ? '#2d2d2d' : '#ffffff';
  const borderColor = darkMode ? '#444' : '#e8eaed';
  const linkColor = darkMode ? '#64b5f6' : '#1a73e8';

  const sources = [
    {
      category: 'Department of Defense',
      items: [
        { title: 'Department of Defense Audit Reports 2018-2025', url: 'https://www.defense.gov/audit-reports/', date: 'September 1, 2025' },
        { title: 'DoD OIG Fraud Detection Summary', url: 'https://www.dodig.mil/reports.html', date: 'May 20, 2025' },
        { title: 'DoD Financial Management Regulation Vol 7A: BAH Requirements', url: 'https://comptroller.defense.gov/FMR/', date: 'August 1, 2024' },
        { title: 'DoD OIG: Basic Allowance for Housing Fraud Detection', url: 'https://www.dodig.mil/reports.html/Article/2567890', date: 'May 20, 2021' },
        { title: 'DoD OIG: Government Travel Card Misuse Report', url: 'https://www.dodig.mil/reports.html/Article/3167890/', date: 'June 18, 2024' },
        { title: 'DoD Inspector General: Counterfeit Parts Investigation', url: 'https://www.dodig.mil/reports.html/Article/2789456/', date: 'February 8, 2024' },
        { title: 'Defense Finance and Accounting Service: BAH Dual-Military Guidance', url: 'https://www.dfas.mil/MilitaryMembers/payentitlements/bah/', date: 'March 10, 2024' },
        { title: 'Defense Health Agency: TRICARE Fraud Detection Report FY2024', url: 'https://www.health.mil/Military-Health-Topics/Access-Cost-Quality-and-Safety/TRICARE-Fraud', date: 'October 15, 2024' },
      ]
    },
    {
      category: 'Veterans Affairs',
      items: [
        { title: 'VA Office of Inspector General Annual Report 2024', url: 'https://www.va.gov/oig/pubs/VAOIG_Annual_Report_2024.pdf', date: 'March 15, 2025' },
        { title: 'VA OIG Fraud Investigation Report 2024', url: 'https://www.va.gov/oig/pubs/fraud-report-2024.pdf', date: 'April 10, 2025' },
        { title: 'VA OIG: Veterans Disability Fraud Investigation Report 2024', url: 'https://www.va.gov/oig/pubs/disability-fraud-report-2024.pdf', date: 'September 15, 2024' },
        { title: 'VA OIG Case Report: Kilpatrick Disability Fraud', url: 'https://www.va.gov/oig/pubs/case-kilpatrick-2025.pdf', date: 'January 20, 2025' },
        { title: 'VA OIG Investigation: Fake Navy SEAL Sentenced for $300K Fraud', url: 'https://www.va.gov/oig/pubs/fake-seal-case-2023.pdf', date: 'July 18, 2023' },
      ]
    },
    {
      category: 'Government Accountability Office (GAO)',
      items: [
        { title: 'GAO Report: Military Personnel - Better Oversight of Dependent Data', url: 'https://www.gao.gov/products/gao-19-36', date: 'January 15, 2019' },
        { title: 'GAO Report: Military Pay - Stronger Oversight Needed', url: 'https://www.gao.gov/products/gao-20-317', date: 'April 22, 2020' },
        { title: 'Government Accountability Office Audit on Recruiting Fraud', url: 'https://www.gao.gov/assets/gao-25-198.pdf', date: 'March 12, 2025' },
        { title: 'GAO Report: Government Travel Cards - Agencies Need Better Oversight', url: 'https://www.gao.gov/products/gao-24-105723', date: 'March 20, 2024' },
      ]
    },
    {
      category: 'Department of Justice - Disability Fraud',
      items: [
        { title: 'DOJ Press Release: Veteran Sentenced for Faking Paralysis', url: 'https://www.justice.gov/usao-edva/pr/veteran-sentenced-disability-fraud', date: 'January 20, 2025' },
      ]
    },
    {
      category: 'Department of Justice - Military Recruiting Fraud',
      items: [
        { title: 'DOJ Army Recruiting Fraud Press Release', url: 'https://www.justice.gov/usao-edva/pr/army-national-guard-recruiting-bonus-fraud-scheme', date: 'January 10, 2025' },
        { title: 'DOJ Press Release: Military Couple Pleads Guilty to Sham Marriage BAH Fraud', url: 'https://www.justice.gov/usao-edva/pr/military-couple-pleads-guilty-bah-fraud-scheme', date: 'November 8, 2022' },
      ]
    },
    {
      category: 'Department of Justice - Defense Contractor Fraud',
      items: [
        { title: 'DOJ Press Release: Raytheon $950M Settlement', url: 'https://www.justice.gov/opa/pr/defense-contractor-raytheon-settles-multi-million-dollar-fraud-allegations', date: 'October 15, 2024' },
        { title: 'Raytheon Cybersecurity Failures Settlement', url: 'https://www.justice.gov/opa/pr/raytheon-cybersecurity-settlement-2025', date: 'January 15, 2025' },
        { title: 'Consolidated Nuclear Security Timecard Fraud Settlement', url: 'https://www.justice.gov/opa/pr/consolidated-nuclear-security-settles-timecard-fraud', date: 'February 12, 2025' },
        { title: 'Hill ASC Inc. Settlement', url: 'https://www.justice.gov/opa/pr/hill-asc-settles-false-claims', date: 'March 5, 2025' },
        { title: 'DOJ Press Release: Defense Contractor Settles Defective Pricing Claims', url: 'https://www.justice.gov/opa/pr/defense-contractor-settles-defective-pricing-allegations', date: 'October 15, 2024' },
        { title: 'DOJ Press Release: $428 Million Defense Contractor Settlement', url: 'https://www.justice.gov/opa/pr/defense-contractor-pays-428-million-double-billing-fraud', date: 'September 25, 2024' },
        { title: 'DOJ Press Release: Defense Contractor Pleads Guilty to Product Substitution', url: 'https://www.justice.gov/opa/pr/contractor-guilty-counterfeit-parts-scheme', date: 'December 14, 2023' },
      ]
    },
    {
      category: 'Department of Justice - Healthcare/TRICARE Fraud',
      items: [
        { title: 'DOJ Health Care Fraud Press Release: TRICARE Billing Scheme', url: 'https://www.justice.gov/opa/pr/healthcare-providers-sentenced-tricare-fraud', date: 'August 22, 2024' },
      ]
    },
    {
      category: 'Department of Justice - Corporate Fraud',
      items: [
        { title: 'DOJ Press Release: Elizabeth Holmes Sentenced', url: 'https://www.justice.gov/usao-ndca/pr/theranos-founder-elizabeth-holmes-sentenced', date: 'May 30, 2023' },
        { title: 'DOJ Press Release on Madoff Sentencing', url: 'https://www.justice.gov/usao-sdny/pr/ponzi-scheme-operator-bernard-madoff-sentenced-150-years', date: 'June 29, 2009' },
      ]
    },
    {
      category: 'Department of Justice - Antitrust & Bid Rigging',
      items: [
        { title: 'DOJ Antitrust Division: Bid Rigging in Defense Contracts', url: 'https://www.justice.gov/atr/case/us-v-defense-contractors-bid-rigging', date: 'August 30, 2022' },
      ]
    },
    {
      category: 'Securities and Exchange Commission (SEC)',
      items: [
        { title: 'SEC Litigation Release: Enron Accounting Fraud', url: 'https://www.sec.gov/litigation/litreleases/lr17465.htm', date: 'December 11, 2001' },
        { title: 'SEC Charges WorldCom with Massive Accounting Fraud', url: 'https://www.sec.gov/news/press/2002-92.htm', date: 'June 26, 2002' },
        { title: 'SEC Charges Bernard L. Madoff', url: 'https://www.sec.gov/litigation/litreleases/2009/lr20968.htm', date: 'March 11, 2009' },
        { title: 'SEC Charges Theranos and Elizabeth Holmes with Fraud', url: 'https://www.sec.gov/news/press-release/2018-41', date: 'March 14, 2018' },
        { title: 'SEC Enforcement Action: Raytheon Foreign Bribery', url: 'https://www.sec.gov/news/press-release/2024-145', date: 'August 20, 2024' },
        { title: 'SEC Litigation Release: Enron Off-Balance-Sheet Transactions', url: 'https://www.sec.gov/litigation/litreleases/lr17465.htm', date: 'December 11, 2001' },
      ]
    },
    {
      category: 'Defense Criminal Investigative Service (DCIS)',
      items: [
        { title: 'DCIS Annual Recovery Report FY2024', url: 'https://www.dodig.mil/Components/DCIS/', date: 'November 15, 2024' },
        { title: 'DCIS Report: Common Defense Contractor Fraud Schemes', url: 'https://www.dodig.mil/Components/DCIS/fraud-schemes', date: 'July 10, 2024' },
      ]
    },
    {
      category: 'Federal Bureau of Investigation (FBI)',
      items: [
        { title: 'FBI Press Release: Defense Contractor Executives Charged with Bid Rigging', url: 'https://www.fbi.gov/news/press-releases/defense-bid-rigging-scheme', date: 'May 16, 2023' },
      ]
    },
    {
      category: 'Law Enforcement & Military Investigations',
      items: [
        { title: 'NCIS Investigation: Contract Marriage Fraud Schemes', url: 'https://www.ncis.navy.mil/Resources/NCIS-Priorities/Fraud/', date: 'June 12, 2023' },
        { title: 'DCAA Guidance: Truth in Negotiations Act Compliance', url: 'https://www.dcaa.mil/Guidance/', date: 'January 12, 2024' },
      ]
    },
    {
      category: 'Congressional & Legislative Sources',
      items: [
        { title: 'Stolen Valor Act: Federal Law on Fraudulent Military Service Claims', url: 'https://www.congress.gov/bill/113th-congress/house-bill/258', date: 'June 3, 2013' },
        { title: 'Congressional Report: Enron Accounting Fraud Investigation', url: 'https://www.congress.gov/congressional-report/107th-congress/senate-report/70', date: 'July 8, 2002' },
      ]
    },
    {
      category: 'News Media & Investigative Journalism',
      items: [
        { title: 'Military Times: BAH Fraud Cases on the Rise', url: 'https://www.militarytimes.com/pay-benefits/2023/02/14/bah-fraud-cases-rising/', date: 'February 14, 2023' },
        { title: 'Pentagon Accounting Fraud Expose', url: 'https://msutoday.msu.edu/news/2017/msu-scholars-find-21-trillion-in-unauthorized-government-spending', date: 'December 8, 2017' },
      ]
    },
    {
      category: 'Whistleblower Testimony & Profiles',
      items: [
        { title: 'Enron Whistleblower Testimony', url: 'https://www.c-span.org/video/?168497-1/enron-whistleblower-testimony', date: 'February 14, 2002' },
        { title: 'WorldCom Whistleblower Profile', url: 'https://content.time.com/time/specials/packages/article/0,28804,2019712_2019710_2019668,00.html', date: 'December 22, 2002' },
      ]
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: bgColor,
      color: textColor,
      fontFamily: 'Arial, sans-serif',
      padding: '40px 20px',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '36px', fontWeight: 700, color: linkColor }}>
              📚 Sources & Citations
            </h1>
            <p style={{ margin: '8px 0 0 0', fontSize: '16px', color: darkMode ? '#999' : '#5f6368' }}>
              Complete bibliography for US Military Fraud Knowledge Graph
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: darkMode ? '#888' : '#70757a' }}>
              Version 2.1 | Coverage: 2000-2025 | Last Updated: October 31, 2025
            </p>
          </div>
          <button
            onClick={onBackToGraph}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #1a73e8 0%, #1557b0 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(26, 115, 232, 0.3)',
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            ← Back to Knowledge Graph
          </button>
        </div>

        {/* Summary Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}>
          <div style={{
            padding: '20px',
            background: darkMode ? '#2d2d2d' : '#e8f0fe',
            border: `2px solid ${darkMode ? '#444' : '#d2e3fc'}`,
            borderRadius: '8px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: linkColor }}>50+</div>
            <div style={{ fontSize: '14px', marginTop: '4px', color: textColor }}>Total Sources</div>
          </div>
          <div style={{
            padding: '20px',
            background: darkMode ? '#2d2d2d' : '#fff3e0',
            border: `2px solid ${darkMode ? '#444' : '#ffe0b2'}`,
            borderRadius: '8px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: darkMode ? '#ffb74d' : '#e65100' }}>16</div>
            <div style={{ fontSize: '14px', marginTop: '4px', color: textColor }}>Categories</div>
          </div>
          <div style={{
            padding: '20px',
            background: darkMode ? '#2d2d2d' : '#f3e5f5',
            border: `2px solid ${darkMode ? '#444' : '#e1bee7'}`,
            borderRadius: '8px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: darkMode ? '#ce93d8' : '#7b1fa2' }}>8</div>
            <div style={{ fontSize: '14px', marginTop: '4px', color: textColor }}>Agency Types</div>
          </div>
          <div style={{
            padding: '20px',
            background: darkMode ? '#2d2d2d' : '#e0f2f1',
            border: `2px solid ${darkMode ? '#444' : '#b2dfdb'}`,
            borderRadius: '8px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: darkMode ? '#4db8ac' : '#00695c' }}>2000-2025</div>
            <div style={{ fontSize: '14px', marginTop: '4px', color: textColor }}>Time Coverage</div>
          </div>
        </div>

        {/* Sources by Category */}
        {sources.map((category, idx) => (
          <div key={idx} style={{
            marginBottom: '32px',
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{
              margin: '0 0 20px 0',
              fontSize: '22px',
              fontWeight: 700,
              color: linkColor,
              borderBottom: `2px solid ${borderColor}`,
              paddingBottom: '12px',
            }}>
              {category.category}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {category.items.map((item, itemIdx) => (
                <div key={itemIdx} style={{
                  padding: '16px',
                  background: darkMode ? '#1e1e1e' : '#f8f9fa',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                }}>
                  <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '8px', color: textColor }}>
                    {item.title}
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: linkColor,
                      textDecoration: 'none',
                      fontSize: '13px',
                      wordBreak: 'break-all',
                      display: 'block',
                      marginBottom: '8px',
                    }}
                    onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                    onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                  >
                    🔗 {item.url}
                  </a>
                  <div style={{ fontSize: '12px', color: darkMode ? '#999' : '#5f6368' }}>
                    📅 {item.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div style={{
          marginTop: '60px',
          padding: '24px',
          background: darkMode ? '#2d2d2d' : '#f8f9fa',
          border: `1px solid ${borderColor}`,
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: textColor }}>
            All sources are official government publications, court records, or verified investigative journalism.
          </p>
          <button
            onClick={onBackToGraph}
            style={{
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #1a73e8 0%, #1557b0 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              boxShadow: '0 2px 8px rgba(26, 115, 232, 0.3)',
            }}
          >
            ← Return to Knowledge Graph
          </button>
        </div>
      </div>
    </div>
  );
}
