export interface ComplianceResult {
  isValid: boolean;
  missingCredits: number;
  requirementsMet: string[];
}

export interface ComplianceStrategy {
  validateCPD(credits: number, hours: number): ComplianceResult;
}
