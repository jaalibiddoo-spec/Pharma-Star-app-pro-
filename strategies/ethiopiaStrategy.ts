import { ComplianceStrategy, ComplianceResult } from './types.ts';

export class EthiopiaComplianceStrategy implements ComplianceStrategy {
  validateCPD(credits: number, hours: number): ComplianceResult {
    // Example: Ethiopian MOH rules require 30 CEU credits
    const isValid = credits >= 30;
    return {
      isValid,
      missingCredits: isValid ? 0 : 30 - credits,
      requirementsMet: credits >= 30 ? ['MOH_CEU_MINIMUM'] : [],
    };
  }
}
