export type SponsorTier = 
  | 'Platinum Clinical Partner' 
  | 'Gold Educational Sponsor' 
  | 'Silver Digital Innovation Sponsor' 
  | 'Platinum Non-Government Sponsor'
  | 'Gold Non-Government Sponsor'
  | 'Bronze Non-Government Sponsor'
  | 'Custom Strategic Partner';

export type LetterStatus = 'Draft' | 'Dispatched' | 'Under Review' | 'Meeting Scheduled' | 'Partnered' | 'Archived';

export type OrganizationCategory = 
  | 'Pharmaceutical Manufacturer' 
  | 'Financial Institution' 
  | 'Medical Equipment & Diagnostic' 
  | 'Health NGO / Donor' 
  | 'Non-Governmental Organization (NGO)'
  | 'Philanthropic Foundation'
  | 'International Health Partner'
  | 'Public Health Agency'
  | 'Private Clinical Network';

export interface NonGovComplianceRecord {
  complianceStatus: 'Compliant & Verified' | 'Pending Disclosure' | 'Under Audit';
  conflictOfInterestDeclared: boolean;
  efdaEthicalPromotionCertified: boolean;
  contentNeutralityPledgeSigned: boolean;
  neutralityAuditor: string;
  auditDate: string;
  transparencyAuditReportId: string;
}

export interface SponsorInvitationLetter {
  id: string;
  referenceNo: string;
  date: string;
  recipientName: string;
  recipientTitle: string;
  organization: string;
  organizationCategory: OrganizationCategory;
  city: string;
  country: string;
  recipientEmail?: string;
  recipientPhone?: string;
  sponsorTier: SponsorTier;
  contributionETB: number;
  contributionUSD: number;
  focusArea: string;
  customNotes?: string;
  dispatchedAt?: string;
  status: LetterStatus;
  signatoryName: string;
  signatoryTitle: string;
  lastUpdated?: string;
  compliance?: NonGovComplianceRecord;
}
