export interface ComplianceResult {
  isValid: boolean;
  missingCredits: number;
  requirementsMet: string[];
  jurisdiction?: string;
  regulatoryBody?: string;
  requiredCredits?: number;
  ethicsRequired?: number;
  complianceNotes?: string[];
}

export interface ComplianceStrategy {
  validateCPD(credits: number, hours: number, ethicsCredits?: number, maxSingleCourse?: number): ComplianceResult;
}

