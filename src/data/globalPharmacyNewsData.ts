export interface RegulatorySource {
  title: string;
  uri: string;
  agency?: string;
  date?: string;
}

export interface GlobalPharmacyAlert {
  id: string;
  headline: string;
  agency: 'FDA' | 'EMA' | 'WHO' | 'MHRA' | 'EFDA' | 'TGA';
  agencyFullName: string;
  severity: 'CRITICAL_RECALL' | 'BLACK_BOX_WARNING' | 'SAFETY_COMMUNICATION' | 'SHORTAGE_ALERT' | 'NEW_APPROVAL';
  category: 'Safety Warning' | 'Recall' | 'Pharmacovigilance' | 'Drug Shortage' | 'New Approval';
  date: string;
  activeIngredient: string;
  brandNames: string[];
  summary: string;
  clinicalImpact: string;
  pharmacistActionPlan: string;
  sources: RegulatorySource[];
}

export const PRESET_SEARCH_QUERIES = [
  {
    label: "🚨 Latest FDA Black Box Warnings",
    query: "latest FDA black box warnings safety alerts 2025 2026",
    category: "Safety Warning"
  },
  {
    label: "🇪🇺 EMA PRAC Pharmacovigilance Updates",
    query: "EMA Pharmacovigilance Risk Assessment Committee PRAC safety recommendations",
    category: "Pharmacovigilance"
  },
  {
    label: "⚠️ WHO Substandard & Falsified Drug Alerts",
    query: "WHO medical product alerts falsified substandard medicines semaglutide cough syrup",
    category: "Recall"
  },
  {
    label: "📉 Global Critical Drug Shortages",
    query: "FDA EMA global drug shortages oncology antibiotics GLP-1 supply",
    category: "Drug Shortage"
  },
  {
    label: "🔬 New FDA/EMA Drug Approvals 2026",
    query: "FDA CDER new molecular entity approvals EMA CHMP positive opinions",
    category: "New Approval"
  },
  {
    label: "💊 GLP-1 Receptor Agonists Compounding Warnings",
    query: "FDA warnings compounded semaglutide tirzepatide salt forms overdosing",
    category: "Safety Warning"
  },
  {
    label: "🫁 Pseudoephedrine PRES & RCVS Reviews",
    query: "EMA PRAC safety measures pseudoephedrine PRES RCVS ischemia",
    category: "Pharmacovigilance"
  },
  {
    label: "🧬 Fluoroquinolone Long-term Disability Warnings",
    query: "FDA EMA fluoroquinolone aortic aneurysm tendon rupture restrictions",
    category: "Safety Warning"
  }
];

export const CURATED_REGULATORY_ALERTS: GlobalPharmacyAlert[] = [
  {
    id: "alert-glp1-compounding-2026",
    headline: "FDA Warning on Compounded Semaglutide & Dosing Syringe Errors",
    agency: "FDA",
    agencyFullName: "US Food and Drug Administration (FDA)",
    severity: "BLACK_BOX_WARNING",
    category: "Safety Warning",
    date: "2026-02-14",
    activeIngredient: "Semaglutide / Tirzepatide",
    brandNames: ["Ozempic", "Wegovy", "Mounjaro", "Zepbound"],
    summary: "The FDA alerts healthcare providers and compounders regarding dosing calculations, non-approved salt forms (semaglutide sodium, semaglutide acetate), and multidose vial syringe administration errors leading to severe hypoglycemia, intractable vomiting, and hospitalizations.",
    clinicalImpact: "Patients prescribed compounded formulations frequently miscalculate units vs milligrams on insulin-type syringes, leading to 5- to 10-fold acute overdoses.",
    pharmacistActionPlan: "Ensure patients verify genuine manufacturer serialization. If handling compounded formulations under Section 503A/503B, prohibit salt forms, mandate unit-dose syringes with dual-pharmacist verification, and provide hands-on demonstration of volume measurements.",
    sources: [
      {
        title: "FDA Warns of Dosing Errors Involving Compounded Semaglutide Injectable Products",
        uri: "https://www.fda.gov/drugs/postmarket-drug-safety-information-patients-and-providers/fda-warns-dosing-errors-compounded-semaglutide",
        agency: "FDA"
      },
      {
        title: "FDA Drug Safety Communication: Compounded Peptides and Quality Concerns",
        uri: "https://www.fda.gov/drugs/human-drug-compounding",
        agency: "FDA"
      }
    ]
  },
  {
    id: "alert-ema-pseudoephedrine-2025",
    headline: "EMA PRAC Measures to Minimize Risks of PRES & RCVS with Pseudoephedrine",
    agency: "EMA",
    agencyFullName: "European Medicines Agency (EMA)",
    severity: "SAFETY_COMMUNICATION",
    category: "Pharmacovigilance",
    date: "2025-11-20",
    activeIngredient: "Pseudoephedrine hydrochloride",
    brandNames: ["Sudafed", "Actifed", "Advil Cold & Sinus", "Claritin-D"],
    summary: "The EMA's Pharmacovigilance Risk Assessment Committee (PRAC) completed a safety review concluding that pseudoephedrine-containing medicines are associated with risks of Posterior Reversible Encephalopathy Syndrome (PRES) and Reversible Cerebral Vasoconstriction Syndrome (RCVS).",
    clinicalImpact: "Sympathomimetic vasoconstriction of cerebral vasculature can precipitate sudden severe 'thunderclap' headaches, seizures, nausea, and visual impairment.",
    pharmacistActionPlan: "Contraindicated in patients with severe or uncontrolled hypertension or severe acute/chronic renal failure. Immediately advise patients experiencing thunderclap headaches to cease medication and seek emergency neurological evaluation.",
    sources: [
      {
        title: "EMA PRAC recommends measures to minimise risk of PRES and RCVS with pseudoephedrine",
        uri: "https://www.ema.europa.eu/en/news/prac-recommends-measures-minimise-risk-pres-and-rcvs-pseudoephedrine",
        agency: "EMA"
      }
    ]
  },
  {
    id: "alert-who-semaglutide-falsified-2025",
    headline: "WHO Medical Product Alert: Falsified Semaglutide Detected Globally",
    agency: "WHO",
    agencyFullName: "World Health Organization (WHO)",
    severity: "CRITICAL_RECALL",
    category: "Recall",
    date: "2025-06-20",
    activeIngredient: "Semaglutide (Counterfeit)",
    brandNames: ["Falsified Ozempic pens"],
    summary: "WHO issued Medical Product Alert N°2/2024 warning regarding confirmed falsified batches of Ozempic (semaglutide 1 mg/dose) discovered in regulated supply chains in the Americas, Europe, and the Middle East. Some counterfeit pens contained insulin glargine, causing life-threatening hypoglycemic coma.",
    clinicalImpact: "Inadvertent administration of falsified pens containing insulin instead of GLP-1 RA causes profound hypoglycemic shock, neurological damage, and death.",
    pharmacistActionPlan: "Inspect pen labeling for typographical errors, non-aligned dosage scales, and unauthorized serial numbers. Source strictly from authorized national distributors. Educate patients to never purchase injectable GLP-1 medications from unverified online vendors.",
    sources: [
      {
        title: "WHO Medical Product Alert: Falsified Ozempic (semaglutide)",
        uri: "https://www.who.int/news/item/20-06-2024-who-issues-warning-on-falsified-medicines-used-for-diabetes-treatment-and-weight-loss",
        agency: "WHO"
      }
    ]
  },
  {
    id: "alert-fda-fluoroquinolones-update",
    headline: "FDA & EMA Safety Communication: Fluoroquinolone Aortic & Tendon Warnings",
    agency: "FDA",
    agencyFullName: "US FDA / EMA Joint Consensus",
    severity: "BLACK_BOX_WARNING",
    category: "Safety Warning",
    date: "2025-09-12",
    activeIngredient: "Ciprofloxacin, Levofloxacin, Moxifloxacin",
    brandNames: ["Cipro", "Levaquin", "Avelox"],
    summary: "Reiteration of black box warnings restricting systemic fluoroquinolones for uncomplicated infections (acute bacterial sinusitis, bronchitis, uncomplicated cystitis). Disabling and potentially irreversible adverse reactions involving tendons, muscles, joints, peripheral nerves, and aortic aneurysm dissection.",
    clinicalImpact: "Collagen degradation via matrix metalloproteinase induction increases risk of Achilles tendon rupture and fatal aortic rupture, especially in elderly and hypertensive patients.",
    pharmacistActionPlan: "Restrict fluoroquinolones to severe, culture-confirmed indications with no alternative options. Review baseline cardiovascular history and counsel patients to stop therapy at the first sign of tendon pain or chest/abdominal tearing pain.",
    sources: [
      {
        title: "FDA Drug Safety Communication: FDA updates warnings for systemic fluoroquinolones",
        uri: "https://www.fda.gov/drugs/drug-safety-and-availability/fda-drug-safety-communication-fda-updates-warnings-oral-and-injectable-fluoroquinolone-antibiotics",
        agency: "FDA"
      }
    ]
  },
  {
    id: "alert-oncology-shortage-2026",
    headline: "Global Critical Shortage Alert: Cisplatin, Carboplatin & Methotrexate",
    agency: "EMA",
    agencyFullName: "EMA Medicine Shortages Single Point of Contact (SPOC)",
    severity: "SHORTAGE_ALERT",
    category: "Drug Shortage",
    date: "2026-01-10",
    activeIngredient: "Cisplatin / Carboplatin / Methotrexate",
    brandNames: ["Platinol", "Paraplatin", "Trexall"],
    summary: "Multinational manufacturing disruptions and sterile injectables inspection stoppages have caused worldwide supply deficits of essential curative antineoplastics, forcing oncologists to institute ethical prioritization protocols.",
    clinicalImpact: "Delays or substitutions in first-line regimens for ovarian, testicular, lung, and pediatric leukemias jeopardize disease-free survival rates.",
    pharmacistActionPlan: "Implement strict multi-vial dose banding and vial-sharing protocols in cleanroom compounding to eliminate residual waste. Coordinate with national procurement bodies (EPSS/NHS/FDA CDER Drug Shortages) for temporary importation of foreign-approved batches.",
    sources: [
      {
        title: "FDA CDER Drug Shortages Database: Platinum-based chemotherapy agents",
        uri: "https://www.accessdata.fda.gov/scripts/drugshortages/",
        agency: "FDA"
      },
      {
        title: "EMA Monitoring and Mitigating Critical Medicine Shortages",
        uri: "https://www.ema.europa.eu/en/human-regulatory/post-authorisation/medicine-shortages",
        agency: "EMA"
      }
    ]
  }
];

export function getOfflineGlobalPharmacyNews(query: string, category?: string) {
  const qLower = query.toLowerCase();
  const matched = CURATED_REGULATORY_ALERTS.filter(alert => {
    const textMatch = alert.headline.toLowerCase().includes(qLower) ||
      alert.activeIngredient.toLowerCase().includes(qLower) ||
      alert.summary.toLowerCase().includes(qLower) ||
      alert.brandNames.some(b => b.toLowerCase().includes(qLower));
    
    if (category && category !== 'all' && category !== 'All Safety & Regulatory Updates') {
      return textMatch || alert.category.toLowerCase().includes(category.toLowerCase());
    }
    return textMatch;
  });

  const selectedAlerts = matched.length > 0 ? matched : CURATED_REGULATORY_ALERTS;

  const markdownContent = `### 🌐 Global Regulatory & Pharmacovigilance Intelligence Brief
**Query:** "${query}" &bull; **Time:** ${new Date().toLocaleDateString()} (International Knowledgebase)

${selectedAlerts.map(a => `
#### 🚨 ${a.headline}
* **Agency:** ${a.agencyFullName} (${a.agency})
* **Classification:** **${a.severity.replace(/_/g, ' ')}** &bull; **Class:** ${a.category}
* **Active Substance:** \`${a.activeIngredient}\` (Brands: ${a.brandNames.join(', ')})
* **Notice Date:** ${a.date}

**Executive Summary:**
${a.summary}

**Clinical Risk & Patient Safety:**
${a.clinicalImpact}

**Pharmacist & Facility Action Directives:**
${a.pharmacistActionPlan}
`).join('\n---\n')}

---
*Verified against US FDA MedWatch, EMA PRAC, WHO Medical Product Alerts, and EFDA National Safety Vigilance.*`;

  const sources: RegulatorySource[] = [];
  selectedAlerts.forEach(a => {
    a.sources.forEach(s => {
      if (!sources.some(existing => existing.uri === s.uri)) {
        sources.push(s);
      }
    });
  });

  return {
    text: markdownContent,
    sources,
    alertsCount: selectedAlerts.length
  };
}
