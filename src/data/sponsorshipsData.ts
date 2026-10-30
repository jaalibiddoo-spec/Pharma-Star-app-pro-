import { SponsorshipPartner } from '../types';

export const sponsorshipsData: SponsorshipPartner[] = [
  {
    id: "sp-epharm",
    companyName: "Ethiopian Pharmaceuticals Manufacturing S.C. (EPHARM)",
    category: "Pharmaceutical Manufacturer",
    tier: "Platinum Clinical Partner",
    sponsoredArea: "Industrial Pharmacy & cGMP Tablet Defect Control (IND-302)",
    logoText: "EPHARM ETHIOPIA",
    originCountry: "Addis Ababa, Ethiopia",
    description: "Ethiopia's pioneer pharmaceutical manufacturing plant producing essential oral solids, syrups, and injectables conforming to EFDA cGMP standards.",
    accreditedSince: "2024",
    verifiedStatus: true
  },
  {
    id: "sp-cadila",
    companyName: "Cadila Pharmaceuticals Ethiopia PLC",
    category: "Pharmaceutical Manufacturer",
    tier: "Gold Educational Sponsor",
    sponsoredArea: "Clinical Pharmacotherapy & GDMT Cardiovascular Guidelines (PHARM-401)",
    logoText: "CADILA PHARMA ETHIOPIA",
    originCountry: "Gelang / Addis Ababa, Ethiopia",
    description: "Leading WHO-prequalified formulations manufacturer providing affordable high-potency antibiotics, cardiovascular GDMT, and anti-diabetic therapeutics.",
    accreditedSince: "2025",
    verifiedStatus: true
  },
  {
    id: "sp-julphar",
    companyName: "Julphar Pharmaceuticals Ethiopia",
    category: "Pharmaceutical Manufacturer",
    tier: "Gold Educational Sponsor",
    sponsoredArea: "Integrated Physical Pharmaceutics & Colloid Delivery Systems (PHYS-201)",
    logoText: "JULPHAR ETHIOPIA",
    originCountry: "Bole Lemi Industrial Park, Addis Ababa",
    description: "State-of-the-art manufacturing facility in Addis Ababa producing sterile ophthalmic products, cephalosporin antibiotics, and oral suspensions.",
    accreditedSince: "2025",
    verifiedStatus: true
  },
  {
    id: "sp-moh-amr",
    companyName: "Ethiopian MoH & WHO Antimicrobial Stewardship Alliance",
    category: "Health NGO / Healthcare Group",
    tier: "Platinum Clinical Partner",
    sponsoredArea: "WHO AWaRe Antibiotic Protocols & Hospital Internship Practice (INTERN-501)",
    logoText: "EFDA / MoH STEWARDSHIP",
    originCountry: "Federal Democratic Republic of Ethiopia",
    description: "National consortium driving responsible antimicrobial consumption, AWaRe classification adherence, and nosocomial infection reduction across Ethiopian tertiary hospitals.",
    accreditedSince: "2024",
    verifiedStatus: true
  }
];

export interface SponsorshipTierPackage {
  tierName: string;
  badgeColor: string;
  priceETB: number;
  priceUSD: number;
  benefits: string[];
  recommendedFor: string;
}

export const sponsorshipPackages: SponsorshipTierPackage[] = [
  {
    tierName: "Silver Module Sponsor",
    badgeColor: "border-slate-500 text-slate-300 bg-slate-800/40",
    priceETB: 5000,
    priceUSD: 100,
    benefits: [
      "Official co-branding on 1 Academic Course Module",
      "Listed in App Sponsors Directory across Ethiopia & East Africa",
      "Educational product monograph link in clinical guidelines",
      "Quarterly pharmacy practitioner engagement reports"
    ],
    recommendedFor: "Local pharmaceutical distributors & specialized clinics"
  },
  {
    tierName: "Gold Educational Sponsor",
    badgeColor: "border-amber-500/50 text-amber-300 bg-amber-500/10",
    priceETB: 15000,
    priceUSD: 300,
    benefits: [
      "Co-branding on 3 Core CPD Modules (e.g., Pharmacotherapy, Toxicology)",
      "Direct link to official medical affairs / clinical trials",
      "Push banner in Pharmacist Live Chat educational alerts",
      "Logo printed on accredited EFDA CPD Certificates of Completion",
      "Monthly analytical impression dashboard"
    ],
    recommendedFor: "Major domestic pharmaceutical manufacturers & international labs"
  },
  {
    tierName: "Platinum Clinical Partner",
    badgeColor: "border-teal-500/60 text-teal-300 bg-teal-500/15",
    priceETB: 30000,
    priceUSD: 600,
    benefits: [
      "Exclusive Title Partner of Pharmastar Clinical Pharmacy Suite",
      "Permanent top-banner placement across all 10 courses and 3D visualizers",
      "Custom accredited 15-CEU webinar module authored with Pharm. Dawid Aliyi",
      "Featured employer portal for hiring clinical pharmacists and interns",
      "VIP invitation to Ethiopian Annual Pharmaceutical Society Symposium"
    ],
    recommendedFor: "Industry leaders, healthcare conglomerates & government institutions"
  }
];
