export type SponsorTier = 'Platinum Clinical Partner' | 'Gold Educational Sponsor' | 'Silver Digital Innovation Sponsor' | 'Custom Strategic Partner';

export type LetterStatus = 'Draft' | 'Dispatched' | 'Under Review' | 'Meeting Scheduled' | 'Partnered' | 'Archived';

export interface SponsorInvitationLetter {
  id: string;
  referenceNo: string;
  date: string;
  recipientName: string;
  recipientTitle: string;
  organization: string;
  organizationCategory: 'Pharmaceutical Manufacturer' | 'Financial Institution' | 'Medical Equipment & Diagnostic' | 'Health NGO / Donor' | 'Public Health Agency';
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
}
