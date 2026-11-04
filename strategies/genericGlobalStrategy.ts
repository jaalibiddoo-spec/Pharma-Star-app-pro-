import { ComplianceStrategy, ComplianceResult } from './types.ts';

export class GenericGlobalStrategy implements ComplianceStrategy {
  validateCPD(credits: number, hours: number): ComplianceResult {
    // Default baseline requirement
    const isValid = credits >= 15 && hours >= 10;
    return {
      isValid,
      missingCredits: isValid ? 0 : 15 - credits,
      requirementsMet: [...(credits >= 15 ? ['CREDITS_MET'] : []), ...(hours >= 10 ? ['HOURS_MET'] : [])],
    };
  }
}
