export interface ComplianceResult {
  isValid: boolean;
  missingCredits: number;
  requirementsMet: string[];
  totalCreditsRequired: number;
  ethicsCreditsRequired: number;
  maxSingleCourseCap: number;
  complianceNotes: string[];
}

export interface ComplianceStrategy {
  validateCPD(credits: number, hours: number, ethicsCredits?: number, maxSingleCourse?: number): ComplianceResult;
}

// Ethiopian Ministry of Health (MoH) & EFDA Directive No. 49/2022 Strategy
export class EthiopiaComplianceStrategy implements ComplianceStrategy {
  validateCPD(credits: number, hours: number, ethicsCredits: number = 0, maxSingleCourse: number = 0): ComplianceResult {
    const totalRequired = 30;
    const ethicsRequired = 5;
    const singleCourseCap = 15;

    const meetsTotal = credits >= totalRequired;
    const meetsEthics = ethicsCredits >= ethicsRequired;
    const meetsCapRule = maxSingleCourse <= singleCourseCap;

    const requirementsMet: string[] = [];
    if (meetsTotal) requirementsMet.push('MOH_CEU_MINIMUM_30');
    if (meetsEthics) requirementsMet.push('MOH_ETHICS_MINIMUM_5');
    if (meetsCapRule) requirementsMet.push('EFDA_SINGLE_COURSE_CAP_SATISFIED');
    if (hours >= 20) requirementsMet.push('CLINICAL_PRACTICUM_HOURS_MET');

    const notes: string[] = [];
    if (!meetsTotal) {
      notes.push(`Shortfall of ${totalRequired - credits} CEU credits for Ethiopian MoH annual licensing renewal.`);
    }
    if (!meetsEthics) {
      notes.push(`Missing ${ethicsRequired - ethicsCredits} CEUs in mandatory Medical Ethics & Health Jurisprudence.`);
    }
    if (!meetsCapRule) {
      notes.push(`Violation of EFDA Directive: Single course exceeds maximum allowed ceiling of ${singleCourseCap} CEUs.`);
    }

    const isValid = meetsTotal && meetsEthics && meetsCapRule;

    return {
      isValid,
      missingCredits: isValid ? 0 : Math.max(0, totalRequired - credits),
      requirementsMet,
      totalCreditsRequired: totalRequired,
      ethicsCreditsRequired: ethicsRequired,
      maxSingleCourseCap: singleCourseCap,
      complianceNotes: notes
    };
  }
}

// Generic Global International Baseline Strategy (e.g., FIP / ACPE / WHO guidelines)
export class GenericGlobalStrategy implements ComplianceStrategy {
  validateCPD(credits: number, hours: number, ethicsCredits: number = 0): ComplianceResult {
    const totalRequired = 15;
    const hoursRequired = 10;
    const isValid = credits >= totalRequired && hours >= hoursRequired;

    const requirementsMet: string[] = [];
    if (credits >= totalRequired) requirementsMet.push('CREDITS_MET');
    if (hours >= hoursRequired) requirementsMet.push('HOURS_MET');
    if (ethicsCredits >= 2) requirementsMet.push('GLOBAL_ETHICS_AWARENESS');

    const notes: string[] = [];
    if (credits < totalRequired) {
      notes.push(`Global baseline shortfall of ${totalRequired - credits} credits.`);
    }
    if (hours < hoursRequired) {
      notes.push(`Practicum shortfall of ${hoursRequired - hours} hours.`);
    }

    return {
      isValid,
      missingCredits: isValid ? 0 : Math.max(0, totalRequired - credits),
      requirementsMet,
      totalCreditsRequired: totalRequired,
      ethicsCreditsRequired: 2,
      maxSingleCourseCap: 20,
      complianceNotes: notes
    };
  }
}

// Compliance Factory
export class ComplianceFactory {
  static getStrategy(countryCode: string): ComplianceStrategy {
    switch (countryCode?.toUpperCase()) {
      case 'ET':
      case 'ETH':
      case 'ETHIOPIA':
        return new EthiopiaComplianceStrategy();
      default:
        return new GenericGlobalStrategy();
    }
  }
}
