import { ComplianceStrategy, ComplianceResult } from './types.ts';

// United States: ACPE & State Boards of Pharmacy (Biennial 30 Contact Hours)
export class USAComplianceStrategy implements ComplianceStrategy {
  validateCPD(credits: number, hours: number, ethicsCredits: number = 0): ComplianceResult {
    const requiredCredits = 30;
    const ethicsRequired = 2; // Pharmacy Law & Patient Safety
    const isValid = credits >= requiredCredits && (ethicsCredits >= ethicsRequired || hours >= 15);

    const requirementsMet: string[] = [];
    if (credits >= requiredCredits) requirementsMet.push('ACPE_CONTACT_HOURS_30');
    if (ethicsCredits >= ethicsRequired) requirementsMet.push('PHARMACY_LAW_PATIENT_SAFETY_MET');
    if (hours >= 15) requirementsMet.push('LIVE_SEMINAR_INTERACTIVE_HOURS_MET');

    return {
      isValid,
      missingCredits: isValid ? 0 : Math.max(0, requiredCredits - credits),
      requirementsMet,
      jurisdiction: 'United States of America',
      regulatoryBody: 'Accreditation Council for Pharmacy Education (ACPE) & NABP',
      requiredCredits,
      ethicsRequired,
      complianceNotes: [
        `US State Board Biennial Requirement: ${requiredCredits} Contact Hours (minimum 2 hrs in Pharmacy Law/Ethics and 2 hrs in Patient Safety/Medication Errors).`,
        isValid ? 'Compliant for US Pharmacist License Renewal.' : `Shortfall of ${Math.max(0, requiredCredits - credits)} CE hours.`
      ]
    };
  }
}

// United Kingdom: General Pharmaceutical Council (GPhC) Revalidation
export class UKComplianceStrategy implements ComplianceStrategy {
  validateCPD(credits: number, hours: number): ComplianceResult {
    // GPhC requires 4 CPD entries (at least 2 planned), 1 peer discussion, 1 reflective account
    const requiredCredits = 30; // Equivalent learning units
    const isValid = credits >= 20 && hours >= 10;

    const requirementsMet: string[] = [];
    if (credits >= 20) requirementsMet.push('GPHC_CPD_ENTRIES_COMPLETED');
    if (hours >= 10) requirementsMet.push('PEER_DISCUSSION_AND_REFLECTIVE_ACCOUNT_MET');

    return {
      isValid,
      missingCredits: isValid ? 0 : Math.max(0, requiredCredits - credits),
      requirementsMet,
      jurisdiction: 'United Kingdom',
      regulatoryBody: 'General Pharmaceutical Council (GPhC) & Royal Pharmaceutical Society (RPS)',
      requiredCredits: 20,
      complianceNotes: [
        'UK GPhC Standard: Annual revalidation submission comprising 4 CPD records, 1 peer discussion record, and 1 reflective account.',
        isValid ? 'Compliant for UK GPhC Register maintenance.' : 'Action required: Complete outstanding peer discussion or CPD records.'
      ]
    };
  }
}

// Canada: National Association of Pharmacy Regulatory Authorities (NAPRA) & Provincial Colleges
export class CanadaComplianceStrategy implements ComplianceStrategy {
  validateCPD(credits: number, hours: number): ComplianceResult {
    const requiredCredits = 15;
    const isValid = credits >= requiredCredits;

    const requirementsMet: string[] = [];
    if (credits >= requiredCredits) requirementsMet.push('NAPRA_CEU_ANNUAL_MET');
    if (hours >= 10) requirementsMet.push('ACCREDITED_LEARNING_PORTFOLIO_MET');

    return {
      isValid,
      missingCredits: isValid ? 0 : Math.max(0, requiredCredits - credits),
      requirementsMet,
      jurisdiction: 'Canada',
      regulatoryBody: 'NAPRA & Canadian Council on Continuing Education in Pharmacy (CCCEP)',
      requiredCredits,
      complianceNotes: [
        `Canadian Provincial College Standard: ${requiredCredits} Continuing Education Units (CEUs) per annual cycle recorded in the Learning Portfolio.`,
        isValid ? 'Compliant for Canadian Pharmacist Annual Registration.' : `Shortfall of ${Math.max(0, requiredCredits - credits)} CEUs.`
      ]
    };
  }
}

// Australia: Pharmacy Board of Australia (Ahpra) & Australian Pharmacy Council (APC)
export class AustraliaComplianceStrategy implements ComplianceStrategy {
  validateCPD(credits: number, hours: number): ComplianceResult {
    const requiredCredits = 40; // 40 CPD credits per year
    const isValid = credits >= requiredCredits;

    const requirementsMet: string[] = [];
    if (credits >= requiredCredits) requirementsMet.push('AHPRA_40_CPD_CREDITS_MET');
    if (hours >= 20) requirementsMet.push('GROUP_2_ASSESSED_LEARNING_MET');

    return {
      isValid,
      missingCredits: isValid ? 0 : Math.max(0, requiredCredits - credits),
      requirementsMet,
      jurisdiction: 'Australia',
      regulatoryBody: 'Pharmacy Board of Australia (Ahpra) & Australian Pharmacy Council (APC)',
      requiredCredits,
      complianceNotes: [
        `Australian Standard: Minimum of ${requiredCredits} CPD credits annually (including at least Group 2 assessed learning).`,
        isValid ? 'Compliant with Ahpra Registration Standard.' : `Shortfall of ${Math.max(0, requiredCredits - credits)} CPD credits.`
      ]
    };
  }
}

// UAE & Gulf States: Dubai Health Authority (DHA), MOHAP, Saudi SCFHS
export class UAEGulfComplianceStrategy implements ComplianceStrategy {
  validateCPD(credits: number, hours: number): ComplianceResult {
    const requiredCredits = 20; // 20 CME hours per year
    const isValid = credits >= requiredCredits;

    const requirementsMet: string[] = [];
    if (credits >= requiredCredits) requirementsMet.push('DHA_MOHAP_CME_MET');
    if (hours >= 10) requirementsMet.push('PATIENT_SAFETY_ACCREDITATION');

    return {
      isValid,
      missingCredits: isValid ? 0 : Math.max(0, requiredCredits - credits),
      requirementsMet,
      jurisdiction: 'United Arab Emirates & Gulf Cooperation Council (GCC)',
      regulatoryBody: 'Dubai Health Authority (DHA), MOHAP & Saudi Commission for Health Specialties (SCFHS)',
      requiredCredits,
      complianceNotes: [
        `Gulf Regional Requirement: Minimum ${requiredCredits} CME credits annually with mandatory patient safety and clinical therapeutics units.`,
        isValid ? 'Compliant for Gulf Health Authority Licensing.' : `Shortfall of ${Math.max(0, requiredCredits - credits)} CME hours.`
      ]
    };
  }
}

// Kenya: Pharmacy and Poisons Board (PPB)
export class KenyaComplianceStrategy implements ComplianceStrategy {
  validateCPD(credits: number, hours: number): ComplianceResult {
    const requiredCredits = 40; // 40 CPD points per annual retention
    const isValid = credits >= requiredCredits;

    const requirementsMet: string[] = [];
    if (credits >= requiredCredits) requirementsMet.push('PPB_40_CPD_POINTS_MET');

    return {
      isValid,
      missingCredits: isValid ? 0 : Math.max(0, requiredCredits - credits),
      requirementsMet,
      jurisdiction: 'Kenya',
      regulatoryBody: 'Pharmacy and Poisons Board (PPB) of Kenya',
      requiredCredits,
      complianceNotes: [
        `Kenya PPB Mandate: ${requiredCredits} CPD points annually for active retention on the Pharmacists & Pharmaceutical Technologists register.`,
        isValid ? 'Compliant for PPB Annual Practice License.' : `Shortfall of ${Math.max(0, requiredCredits - credits)} CPD points.`
      ]
    };
  }
}

// Nigeria: Pharmacists Council of Nigeria (PCN)
export class NigeriaComplianceStrategy implements ComplianceStrategy {
  validateCPD(credits: number, hours: number): ComplianceResult {
    const requiredCredits = 30; // 30 Mandatory Continuing Professional Development (MCPD) credits
    const isValid = credits >= requiredCredits;

    const requirementsMet: string[] = [];
    if (credits >= requiredCredits) requirementsMet.push('PCN_MCPD_CREDITS_MET');

    return {
      isValid,
      missingCredits: isValid ? 0 : Math.max(0, requiredCredits - credits),
      requirementsMet,
      jurisdiction: 'Nigeria',
      regulatoryBody: 'Pharmacy Council of Nigeria (PCN)',
      requiredCredits,
      complianceNotes: [
        `Nigeria PCN Mandate: Minimum ${requiredCredits} MCPD points per renewal cycle.`,
        isValid ? 'Compliant for PCN Annual Practicing License.' : `Shortfall of ${Math.max(0, requiredCredits - credits)} MCPD units.`
      ]
    };
  }
}
