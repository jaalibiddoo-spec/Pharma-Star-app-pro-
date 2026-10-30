import { User, PaymentRecord } from '../types';

const STORAGE_KEY = 'pharmastar_registered_user';
const REMEMBERED_ACCOUNTS_KEY = 'pharmastar_remembered_accounts';
const PAYMENTS_KEY = 'pharmastar_payment_records';

const defaultDemoUser: User = {
  username: "Pharmastar",
  isPro: false,
  fullName: "Pharmastar Member",
  role: "pharmacist",
  registrationDate: "2026-10-26",
  offlineReady: true,
  rememberMe: true,
  payments: [
    {
      id: "pay-seed-1",
      transactionRef: "CBE-INIT-900367",
      paymentMethod: "CBE Birr",
      amountETB: 100,
      serviceName: "Platform Registration & Basic Access",
      serviceId: "registration",
      timestamp: "2026-10-26T09:00:00Z",
      status: "verified",
      payerName: "Pharmastar Member",
      notes: "Auto-verified initial registration fee"
    }
  ]
};

/**
 * Loads current active user, auto-restoring all previous payments
 */
export function getStoredUser(): User {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const user: User = JSON.parse(raw);
      // Merge with global payments if missing
      const globalPayments = getAllStoredPayments();
      const userPayments = user.payments || [];
      const mergedPayments = [...userPayments];

      globalPayments.forEach(p => {
        if (!mergedPayments.some(mp => mp.id === p.id || mp.transactionRef === p.transactionRef)) {
          mergedPayments.push(p);
        }
      });

      user.payments = mergedPayments;
      return user;
    }
  } catch (e) {
    console.error('Failed to parse stored user:', e);
  }
  return defaultDemoUser;
}

/**
 * Saves or updates user and records new payment to persistent storage
 */
export function saveUserAndPayment(user: User, newPayment?: PaymentRecord): User {
  try {
    let updatedPayments = [...(user.payments || [])];

    if (newPayment) {
      // Ensure unique payment ID
      const paymentWithId: PaymentRecord = {
        ...newPayment,
        id: newPayment.id || `pay-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: newPayment.timestamp || new Date().toISOString()
      };
      
      // Avoid duplicate transaction refs
      const exists = updatedPayments.some(p => p.transactionRef === paymentWithId.transactionRef && p.transactionRef !== '');
      if (!exists) {
        updatedPayments.unshift(paymentWithId);
      }

      // Also persist to global payment list
      savePaymentToGlobalList(paymentWithId);
    }

    const updatedUser: User = {
      ...user,
      payments: updatedPayments,
      rememberMe: true
    };

    // Store as active user
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

    // Update remembered accounts registry
    rememberAccount(updatedUser);

    // Dispatch broadcast event for cross-component sync
    window.dispatchEvent(new CustomEvent('pharmastar_auth_sync', { detail: updatedUser }));
    window.dispatchEvent(new CustomEvent('pharmastar_payment_recorded', { detail: newPayment }));

    return updatedUser;
  } catch (e) {
    console.error('Failed to save user and payment:', e);
    return user;
  }
}

/**
 * Global payment records across all transactions
 */
export function getAllStoredPayments(): PaymentRecord[] {
  try {
    const raw = localStorage.getItem(PAYMENTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return defaultDemoUser.payments || [];
}

function savePaymentToGlobalList(payment: PaymentRecord) {
  try {
    const list = getAllStoredPayments();
    if (!list.some(p => p.transactionRef === payment.transactionRef && p.transactionRef !== '')) {
      list.unshift(payment);
      localStorage.setItem(PAYMENTS_KEY, JSON.stringify(list));
    }
  } catch {
    // ignore
  }
}

/**
 * Remembers multiple user profiles for 1-click instant login/switching
 */
export function getRememberedAccounts(): User[] {
  try {
    const raw = localStorage.getItem(REMEMBERED_ACCOUNTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return [defaultDemoUser];
}

export function rememberAccount(user: User) {
  try {
    const list = getRememberedAccounts();
    const filtered = list.filter(u => u.username !== user.username);
    filtered.unshift(user);
    // Keep top 10 accounts
    localStorage.setItem(REMEMBERED_ACCOUNTS_KEY, JSON.stringify(filtered.slice(0, 10)));
  } catch {
    // ignore
  }
}

export function switchAccount(username: string): User | null {
  const list = getRememberedAccounts();
  const target = list.find(u => u.username === username);
  if (target) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(target));
    window.dispatchEvent(new CustomEvent('pharmastar_auth_sync', { detail: target }));
    return target;
  }
  return null;
}
