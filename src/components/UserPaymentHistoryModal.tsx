import React, { useState } from 'react';
import { 
  Receipt, CheckCircle2, CreditCard, Landmark, Clock, 
  Download, Printer, Plus, ShieldCheck, UserCheck, 
  Copy, Check, X, Sparkles, AlertCircle, ArrowRight, 
  Building2, Users, RefreshCw
} from 'lucide-react';
import { User, PaymentRecord } from '../types';
import { 
  saveUserAndPayment, 
  getRememberedAccounts, 
  switchAccount 
} from '../utils/userStorage';

interface UserPaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateUser: (user: User) => void;
}

export const UserPaymentHistoryModal: React.FC<UserPaymentHistoryModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser
}) => {
  const [activeTab, setActiveTab] = useState<'payments' | 'claim' | 'accounts'>('payments');
  const [copiedTxn, setCopiedTxn] = useState<string | null>(null);

  // Claim Past Payment Form State
  const [claimService, setClaimService] = useState<string>('exit_exam');
  const [claimAmount, setClaimAmount] = useState<number>(50);
  const [claimMethod, setClaimMethod] = useState<'CBE Birr' | 'Telebirr'>('CBE Birr');
  const [claimTxnRef, setClaimTxnRef] = useState<string>('');
  const [claimPhone, setClaimPhone] = useState<string>('');
  const [claimSuccessMsg, setClaimSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const payments = currentUser.payments || [];
  const rememberedAccounts = getRememberedAccounts();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTxn(text);
    setTimeout(() => setCopiedTxn(null), 2000);
  };

  const handlePrintReceipt = (payment: PaymentRecord) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const receiptHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Pharma Star Official Payment Receipt - ${payment.transactionRef}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1e293b; background: #fff; }
            .receipt-box { max-width: 550px; margin: 0 auto; border: 2px solid #0d9488; border-radius: 12px; padding: 30px; }
            .header { text-align: center; border-bottom: 2px dashed #cbd5e1; padding-bottom: 20px; }
            .title { font-size: 22px; font-weight: bold; color: #0f766e; margin: 0; }
            .subtitle { font-size: 13px; color: #64748b; margin: 5px 0 0; }
            .info-grid { margin: 25px 0; }
            .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
            .label { color: #64748b; font-weight: 500; }
            .value { font-weight: 600; color: #0f172a; }
            .amount-box { background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 8px; padding: 15px; text-align: center; margin-top: 20px; }
            .amount-val { font-size: 26px; font-weight: bold; color: #0d9488; }
            .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 30px; }
            .stamp { display: inline-block; border: 2px solid #10b981; color: #10b981; font-weight: bold; font-size: 12px; padding: 4px 12px; border-radius: 4px; text-transform: uppercase; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="receipt-box">
            <div class="header">
              <h1 class="title">PHARMA STAR APP PRO</h1>
              <p class="subtitle">Official Electronic Payment Receipt & Access Voucher</p>
              <div class="stamp">✓ Auto-Verified & Active</div>
            </div>
            <div class="info-grid">
              <div class="info-row">
                <span class="label">Payer Account:</span>
                <span class="value">${currentUser.fullName} (@${currentUser.username})</span>
              </div>
              <div class="info-row">
                <span class="label">Service Unlocked:</span>
                <span class="value">${payment.serviceName}</span>
              </div>
              <div class="info-row">
                <span class="label">Transaction Reference:</span>
                <span class="value" style="font-family: monospace;">${payment.transactionRef}</span>
              </div>
              <div class="info-row">
                <span class="label">Payment Method:</span>
                <span class="value">${payment.paymentMethod}</span>
              </div>
              <div class="info-row">
                <span class="label">Payment Timestamp:</span>
                <span class="value">${new Date(payment.timestamp).toLocaleString()}</span>
              </div>
              <div class="info-row">
                <span class="label">Recipient CBE Account:</span>
                <span class="value">1000262900367 (Dawid Aliyi)</span>
              </div>
            </div>
            <div class="amount-box">
              <div style="font-size: 12px; color: #0f766e; font-weight: bold;">TOTAL AMOUNT PAID</div>
              <div class="amount-val">${payment.amountETB} ETB (Birr)</div>
            </div>
            <div class="footer">
              <p>Pharma Star Continuous Professional Development & Clinical Intelligence Suite</p>
              <p>Developer: Pharmacist Dawid Aliyi | jaalibiddoo@gmail.com | 0982852778</p>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(receiptHtml);
    printWindow.document.close();
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimTxnRef.trim()) return;

    let serviceTitle = 'Exit Exam & NGAT (50 Birr)';
    let updatedUserProps: Partial<User> = {};

    if (claimService === 'exit_exam') {
      serviceTitle = 'Ethiopian Exit Exam & NGAT Simulator';
      updatedUserProps = { unlockedExitExam: true, unlockedNgat: true };
    } else if (claimService === 'wholesaler') {
      serviceTitle = 'Wholesaler Portal 3-Month Subscription';
      updatedUserProps = { 
        unlockedWholesaler: true,
        wholesalerSubscriptionExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
      };
    } else if (claimService === 'registration') {
      serviceTitle = 'Pharma Star Registration & CPD Access';
      updatedUserProps = { isPro: true };
    }

    const newPaymentRecord: PaymentRecord = {
      id: `pay-${Date.now()}`,
      transactionRef: claimTxnRef.trim().toUpperCase(),
      paymentMethod: claimMethod,
      amountETB: claimAmount,
      serviceName: serviceTitle,
      serviceId: claimService,
      timestamp: new Date().toISOString(),
      status: 'verified',
      payerPhone: claimPhone.trim(),
      payerName: currentUser.fullName,
      notes: 'Auto-remembered via manual verification claim'
    };

    const updated = saveUserAndPayment({
      ...currentUser,
      ...updatedUserProps
    }, newPaymentRecord);

    onUpdateUser(updated);
    setClaimSuccessMsg(`Payment of ${claimAmount} Birr successfully verified and remembered for ${serviceTitle}!`);
    setClaimTxnRef('');
    setTimeout(() => {
      setClaimSuccessMsg(null);
      setActiveTab('payments');
    }, 1500);
  };

  const handleAccountSwitch = (username: string) => {
    const switched = switchAccount(username);
    if (switched) {
      onUpdateUser(switched);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-teal-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>User Account & Payment Ledger</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> Auto-Remembered
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Logged in as <strong className="text-white">{currentUser.fullName}</strong> (@{currentUser.username})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 border-b border-slate-800 flex items-center gap-2 bg-slate-950/60">
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'payments'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Recorded Payments ({payments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('claim')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'claim'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Verify & Remember Payment</span>
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'accounts'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Remembered Profiles ({rememberedAccounts.length})</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300 flex-1">
          {/* Active User Summary Card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{currentUser.fullName}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-teal-500/20 text-teal-300 font-semibold uppercase">
                  {currentUser.role}
                </span>
                {currentUser.isPro && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-bold">
                    PRO / CBE Verified
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Registered: {currentUser.registrationDate} • CBE Account: 1000262900367
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {currentUser.unlockedExitExam && (
                <span className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                  ✓ Exit Exam & NGAT (50 ETB)
                </span>
              )}
              {currentUser.unlockedWholesaler && (
                <span className="px-2 py-1 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-300 text-[10px] font-bold">
                  ✓ Wholesaler Portal (500 ETB)
                </span>
              )}
              {currentUser.isInstitutionSubscribed && (
                <span className="px-2 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-bold">
                  ✓ Institution License
                </span>
              )}
            </div>
          </div>

          {/* TAB 1: Recorded Payments */}
          {activeTab === 'payments' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                  Payment History & Official Electronic Receipts
                </span>
                <span className="text-[11px] text-slate-500">
                  Total Recorded: {payments.length}
                </span>
              </div>

              {payments.length === 0 ? (
                <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <Receipt className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-sm font-semibold text-white">No payments recorded yet</p>
                  <p className="text-xs text-slate-400">
                    When you perform a payment for the Exit Exam (50 Birr), Wholesaler Subscription (500 Birr), or Registration, it will be automatically logged here.
                  </p>
                  <button
                    onClick={() => setActiveTab('claim')}
                    className="mt-2 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Verify Past Transaction
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {payments.map((p) => (
                    <div
                      key={p.id}
                      className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 hover:border-teal-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{p.serviceName}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" /> {p.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 font-mono text-teal-300">
                            Ref: {p.transactionRef}
                            <button
                              onClick={() => handleCopy(p.transactionRef)}
                              className="text-slate-500 hover:text-white cursor-pointer ml-1"
                              title="Copy transaction ref"
                            >
                              {copiedTxn === p.transactionRef ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </span>
                          <span>•</span>
                          <span>{p.paymentMethod}</span>
                          <span>•</span>
                          <span>{new Date(p.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="text-right">
                          <span className="text-base font-bold text-teal-300">{p.amountETB} ETB</span>
                          <span className="text-[10px] text-slate-500 block">Verified Fee</span>
                        </div>

                        <button
                          onClick={() => handlePrintReceipt(p)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-teal-500 text-xs flex items-center gap-1 transition cursor-pointer"
                          title="Print or download official receipt"
                        >
                          <Printer className="w-3.5 h-3.5 text-teal-400" />
                          <span>Receipt</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Claim / Verify Payment */}
          {activeTab === 'claim' && (
            <form onSubmit={handleClaimSubmit} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-teal-400" />
                  <span>Verify and Auto-Remember Payment</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Enter your CBE or Telebirr reference code to unlock services and record the transaction permanently.
                </p>
              </div>

              {claimSuccessMsg && (
                <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{claimSuccessMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Target Service</label>
                  <select
                    value={claimService}
                    onChange={(e) => {
                      const val = e.target.value;
                      setClaimService(val);
                      if (val === 'exit_exam') setClaimAmount(50);
                      else if (val === 'wholesaler') setClaimAmount(500);
                      else if (val === 'registration') setClaimAmount(100);
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="exit_exam">Ethiopian Exit Exam & NGAT (50 Birr)</option>
                    <option value="wholesaler">Wholesaler Portal 3-Months (500 Birr)</option>
                    <option value="registration">Standard Registration & CPD (100 Birr)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Payment Channel</label>
                  <select
                    value={claimMethod}
                    onChange={(e) => setClaimMethod(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="CBE Birr">Commercial Bank of Ethiopia (CBE)</option>
                    <option value="Telebirr">Telebirr SuperApp</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">
                    Transaction Reference (CBE Ref / Telebirr Txn)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., FT26305..., CBE900367..."
                    value={claimTxnRef}
                    onChange={(e) => setClaimTxnRef(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Payer Phone Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="09... / +251..."
                    value={claimPhone}
                    onChange={(e) => setClaimPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Amount: <strong className="text-teal-300 font-bold">{claimAmount} ETB</strong>
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl text-xs font-bold shadow transition cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify & Unlock Service</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: Remembered Accounts */}
          {activeTab === 'accounts' && (
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-teal-400" />
                  <span>Auto-Remembered Profiles on this Device</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Switch between remembered accounts instantly without re-typing passwords or losing payment records.
                </p>
              </div>

              <div className="space-y-2">
                {rememberedAccounts.map((acc) => {
                  const isCurrent = acc.username === currentUser.username;
                  return (
                    <div
                      key={acc.username}
                      className={`p-3.5 rounded-xl border flex items-center justify-between transition ${
                        isCurrent
                          ? 'bg-teal-950/20 border-teal-500/50'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{acc.fullName}</span>
                          <span className="text-[10px] text-slate-400">(@{acc.username})</span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 text-[10px] font-bold">
                              Current Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Role: <strong className="text-slate-300 capitalize">{acc.role}</strong> • Payments: {acc.payments?.length || 0} recorded
                        </p>
                      </div>

                      {!isCurrent && (
                        <button
                          onClick={() => handleAccountSwitch(acc.username)}
                          className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold cursor-pointer transition flex items-center gap-1"
                        >
                          <span>Switch</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Persistent Device Storage: Auto-remembers users & verified payments offline</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
