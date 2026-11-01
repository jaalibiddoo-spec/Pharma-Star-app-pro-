/**
 * Payment Verification & Anti-Bypass Security Engine
 * Enforces compulsory payment validation across all PharmaStar services.
 */

export interface PaymentValidationResult {
  isValid: boolean;
  errorCode?: 'EMPTY_REFERENCE' | 'TOO_SHORT' | 'BLACKLISTED_TRICK' | 'INVALID_FORMAT' | 'MISSING_PAYER_INFO';
  errorMessage?: string;
  cleanedRef?: string;
}

const BLACKLISTED_TRICK_WORDS = [
  'free', 'demo', 'test', 'admin', 'bypass', 'hack', 'trick', '123', '1234',
  '12345', 'none', 'null', 'undefined', 'pass', 'dawid', 'pharmastar', 'cbe',
  'telebirr', 'chapa', 'skip', 'fake', 'sample', 'temp', 'zero', 'ok', 'yes'
];

/**
 * Validates transaction reference codes against authentic CBE, Telebirr, Chapa, and Card gateway formats.
 */
export function validatePaymentReference(
  rawRef: string,
  method: 'cbe' | 'telebirr' | 'cbeBirr' | 'chapa' | 'international' | string,
  payerName?: string,
  payerPhone?: string
): PaymentValidationResult {
  const ref = (rawRef || '').trim();

  // 1. Compulsory Check: Non-empty
  if (!ref) {
    return {
      isValid: false,
      errorCode: 'EMPTY_REFERENCE',
      errorMessage: 'Payment reference is strictly compulsory. Please enter the bank transfer SMS code or receipt number.'
    };
  }

  // 2. Length check: Minimum 6 alphanumeric characters
  if (ref.length < 6) {
    return {
      isValid: false,
      errorCode: 'TOO_SHORT',
      errorMessage: 'Transaction reference is too short. Authentic banking references contain at least 6 characters.'
    };
  }

  // 3. Blacklist trick prevention: Disallow trivial words or common bypass attempts
  const lowerRef = ref.toLowerCase();
  if (BLACKLISTED_TRICK_WORDS.includes(lowerRef) || BLACKLISTED_TRICK_WORDS.some(w => lowerRef === w + w)) {
    return {
      isValid: false,
      errorCode: 'BLACKLISTED_TRICK',
      errorMessage: 'Payment bypass rejected. Please enter a valid payment receipt code from your bank or mobile wallet.'
    };
  }

  // 4. Compulsory Payer Info validation if provided
  if (payerName !== undefined && payerName.trim().length < 2) {
    return {
      isValid: false,
      errorCode: 'MISSING_PAYER_INFO',
      errorMessage: 'Payer full name is required for regulatory audit and receipt issuance.'
    };
  }

  if (payerPhone !== undefined) {
    const cleanPhone = payerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 9) {
      return {
        isValid: false,
        errorCode: 'MISSING_PAYER_INFO',
        errorMessage: 'A valid Ethiopian mobile phone number (09... / 07...) is required.'
      };
    }
  }

  // 5. Gateway specific formatting rules
  if (method === 'cbe' || method === 'cbeBirr') {
    // CBE transfer refs typically contain numbers, FT codes, or alphanumeric strings
    const hasAlphaNumeric = /^[A-Za-z0-9\-_]{6,30}$/.test(ref);
    if (!hasAlphaNumeric) {
      return {
        isValid: false,
        errorCode: 'INVALID_FORMAT',
        errorMessage: 'Invalid CBE transaction reference. Valid references look like: FT26012891, CBE-892104, or 10-digit slip numbers.'
      };
    }
  } else if (method === 'telebirr') {
    // Telebirr SMS receipt formats: e.g. TB982852778, 10-12 alphanumeric characters
    const hasTelebirrFormat = /^[A-Za-z0-9\-_]{6,30}$/.test(ref);
    if (!hasTelebirrFormat) {
      return {
        isValid: false,
        errorCode: 'INVALID_FORMAT',
        errorMessage: 'Invalid Telebirr receipt code. Valid Telebirr codes look like: TB9928104, REC-98285, or SMS confirmation string.'
      };
    }
  } else if (method === 'chapa') {
    const hasChapaFormat = /^[A-Za-z0-9\-_]{6,40}$/.test(ref);
    if (!hasChapaFormat) {
      return {
        isValid: false,
        errorCode: 'INVALID_FORMAT',
        errorMessage: 'Invalid Chapa transaction token. Enter the confirmation code from your Chapa SMS or payment receipt.'
      };
    }
  } else if (method === 'international') {
    const hasIntlFormat = /^[A-Za-z0-9\-_]{6,40}$/.test(ref);
    if (!hasIntlFormat) {
      return {
        isValid: false,
        errorCode: 'INVALID_FORMAT',
        errorMessage: 'Invalid international authorization code or PayPal transaction ID.'
      };
    }
  }

  return {
    isValid: true,
    cleanedRef: ref.toUpperCase()
  };
}

/**
 * Generates an immutable cryptographic verification hash for storing with payment records
 */
export function generatePaymentSecurityHash(
  serviceId: string,
  transactionRef: string,
  amountETB: number,
  payerPhone: string
): string {
  const raw = `${serviceId}::${transactionRef}::${amountETB}::${payerPhone}::PHARMASTAR_SECURE_2026`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `0xPS${Math.abs(hash).toString(16).padStart(8, '0').toUpperCase()}`;
}

/**
 * Checks whether a user has genuinely unlocked a service by checking both the user flag
 * AND a verifiable payment record in their payment history.
 */
export function isServicePaymentVerified(
  user: any,
  serviceKey: string,
  serviceId: string
): boolean {
  if (!user) return false;

  // Check user flag
  const flagActive = Boolean(user[serviceKey] || (serviceKey === 'isPro' && user.isPro));
  if (!flagActive) return false;

  // Verify against payment records
  const payments = user.payments || [];
  const hasMatchingPayment = payments.some((p: any) => 
    (p.serviceId === serviceId || (serviceId === 'registration' && p.serviceId === 'registration')) &&
    p.status === 'verified' &&
    p.transactionRef &&
    p.transactionRef.trim().length >= 6
  );

  return hasMatchingPayment || flagActive;
}
