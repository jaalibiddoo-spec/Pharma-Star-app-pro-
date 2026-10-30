import React, { useState, useEffect } from 'react';
import { 
  Building2, Package, MessageSquare, Send, RefreshCw, 
  Search, ShieldCheck, CheckCircle2, AlertTriangle, 
  Clock, Plus, Edit2, Check, ExternalLink, Filter, 
  CreditCard, Landmark, KeyRound, Sparkles, X, Phone
} from 'lucide-react';
import { WholesalerItem, WholesalerMessage, WholesalerSubscription, User } from '../types';
import { initialWholesalerItems, initialWholesalerMessages, sampleWholesalerSubscription } from '../data/wholesalerData';

interface WholesalerPortalProps {
  currentUser: User;
  onUpdateUser?: (user: User) => void;
}

export const WholesalerPortal: React.FC<WholesalerPortalProps> = ({
  currentUser,
  onUpdateUser
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'messages' | 'subscription'>('inventory');
  
  // Inventory state
  const [items, setItems] = useState<WholesalerItem[]>(() => {
    try {
      const stored = localStorage.getItem('pharmastar_wholesaler_items');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
    return initialWholesalerItems;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWholesalerFilter, setSelectedWholesalerFilter] = useState('all');
  
  // Editing quantity state
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Messaging state
  const [messages, setMessages] = useState<WholesalerMessage[]>(() => {
    try {
      const stored = localStorage.getItem('pharmastar_wholesaler_messages');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
    return initialWholesalerMessages;
  });

  const [messageRecipientWholesaler, setMessageRecipientWholesaler] = useState<string>('wh-apf');
  const [messageSelectedItem, setMessageSelectedItem] = useState<string>('');
  const [messageText, setMessageText] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Wholesaler Subscription (Every 3 Months: 500 Birr)
  const [subscription, setSubscription] = useState<WholesalerSubscription>(() => {
    try {
      const stored = localStorage.getItem('pharmastar_wholesaler_subscription');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
    return sampleWholesalerSubscription;
  });

  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [subForm, setSubForm] = useState({
    wholesalerName: '',
    licenseNo: '',
    contactPerson: '',
    contactPhone: '+251 ',
    contactEmail: '',
    region: 'Addis Ababa',
    city: 'Addis Ababa',
    paymentMethod: 'telebirr' as const,
    paymentReference: ''
  });

  // Save items to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('pharmastar_wholesaler_items', JSON.stringify(items));
    } catch (e) {
      // ignore
    }
  }, [items]);

  // Save messages to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('pharmastar_wholesaler_messages', JSON.stringify(messages));
    } catch (e) {
      // ignore
    }
  }, [messages]);

  // Handle Update Quantity (matches PUT /api/items/:id)
  const handleUpdateQuantity = async (itemId: string) => {
    setIsUpdating(true);
    try {
      // Try backend PUT route first
      const res = await fetch(`/api/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity_available: newQuantity })
      });
      const data = await res.json();
      if (data.item) {
        setItems(prev => prev.map(item => item.id === itemId ? { ...item, quantityAvailable: data.item.quantity_available || newQuantity, lastUpdated: new Date().toISOString() } : item));
      } else {
        // Local update fallback
        setItems(prev => prev.map(item => item.id === itemId ? { ...item, quantityAvailable: newQuantity, lastUpdated: new Date().toISOString() } : item));
      }
    } catch (e) {
      // Offline fallback
      setItems(prev => prev.map(item => item.id === itemId ? { ...item, quantityAvailable: newQuantity, lastUpdated: new Date().toISOString() } : item));
    } finally {
      setIsUpdating(false);
      setEditingItemId(null);
      setSuccessToast('Inventory stock balance updated successfully!');
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  // Handle Send Message (matches POST /api/messages)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setIsSendingMessage(true);
    const targetWholesaler = items.find(i => i.wholesalerId === messageRecipientWholesaler) || items[0];
    const targetItem = items.find(i => i.id === messageSelectedItem);

    const newMsg: WholesalerMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.username || 'client-facility',
      senderName: currentUser.fullName || 'Lead Hospital Pharmacist',
      senderRole: 'Clinical Healthcare Facility Buyer',
      receiverId: targetWholesaler.wholesalerId,
      receiverName: targetWholesaler.wholesalerName,
      itemId: targetItem?.id,
      itemName: targetItem?.itemName,
      messageText: messageText.trim(),
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiver_id: targetWholesaler.wholesalerId,
          item_id: targetItem?.id,
          message_text: messageText.trim()
        })
      });
    } catch (e) {
      // offline fallback
    }

    setMessages(prev => [newMsg, ...prev]);
    setMessageText('');
    setIsSendingMessage(false);
    setSuccessToast('Order inquiry sent directly to pharmaceutical wholesaler!');
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Handle Wholesaler Subscription (500 ETB / 3 Months)
  const handleActivateSubscription = () => {
    if (!subForm.wholesalerName || !subForm.paymentReference) return;

    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 3); // 3 months

    const newSub: WholesalerSubscription = {
      id: `sub-wh-${Date.now()}`,
      wholesalerName: subForm.wholesalerName,
      wholesalerId: `wh-${Date.now().toString().slice(-4)}`,
      licenseNo: subForm.licenseNo || `EFDA-WHL-${Math.floor(10000 + Math.random() * 90000)}`,
      contactPerson: subForm.contactPerson || currentUser.fullName || 'Distribution Manager',
      contactPhone: subForm.contactPhone,
      contactEmail: subForm.contactEmail || 'wholesale@pharma.gov.et',
      region: subForm.region,
      city: subForm.city,
      quarterlyFeeETB: 500,
      paymentMethod: subForm.paymentMethod,
      paymentReference: subForm.paymentReference,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: expiry.toISOString().split('T')[0],
      subscriptionPeriod: '3_months',
      approvedBy: 'Pharmacist Dawid Aliyi, Regulatory Lead'
    };

    localStorage.setItem('pharmastar_wholesaler_subscription', JSON.stringify(newSub));
    setSubscription(newSub);
    setIsSubscribeModalOpen(false);
    setSuccessToast('Quarterly Wholesaler Subscription (500 Birr) activated successfully!');
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Filtered items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.wholesalerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWholesaler = selectedWholesalerFilter === 'all' || item.wholesalerId === selectedWholesalerFilter;
    return matchesSearch && matchesWholesaler;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-xl bg-teal-600 text-white font-bold text-xs flex items-center gap-2 shadow-2xl animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-indigo-400" />
                EFDA Accredited B2B Distribution
              </span>
              <span className="text-[11px] text-slate-400">Quarterly License: 500 ETB / 3 Months</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              Pharmaceutical Wholesaler & Supply Chain Portal
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Verified inventory management for Ethiopian pharmaceutical distributors, real-time bulk stock replenishment, and direct healthcare facility order communications.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {subscription && subscription.status === 'active' ? (
              <div className="px-3.5 py-2 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Wholesaler Active (500 ETB / 3 Mo)</span>
                </div>
                <span className="text-[10px] text-slate-400 block font-mono">
                  Valid until {subscription.expiryDate}
                </span>
              </div>
            ) : (
              <button
                onClick={() => setIsSubscribeModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Wholesaler Subscription (500 Birr / 3 Months)</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-indigo-300" />
            <span>Wholesale Inventory & Stock Control</span>
            <span className="px-1.5 py-0.2 rounded bg-white/20 text-[10px]">
              {items.length} Items
            </span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-teal-300" />
            <span>Client-Wholesaler Order Chat & Inquiries</span>
            <span className="px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 text-[10px] border border-teal-500/30">
              {messages.length} Active
            </span>
          </button>

          <button
            onClick={() => setActiveTab('subscription')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'subscription'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-amber-300" />
            <span>Quarterly Plan (500 ETB / 3 Months)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. INVENTORY MANAGEMENT (GET /api/items & PUT /api/items/:id) */}
      {/* ========================================================================= */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inventory by brand name, generic molecule, or wholesaler..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-slate-400 text-[11px] font-bold">Filter Wholesaler:</span>
              {[
                { id: 'all', label: 'All Wholesalers' },
                { id: 'wh-apf', label: 'APF Wholesale' },
                { id: 'wh-kadisco', label: 'Kadisco' },
                { id: 'wh-medtech', label: 'Medtech' },
                { id: 'wh-bafana', label: 'Bafana' }
              ].map(w => (
                <button
                  key={w.id}
                  onClick={() => setSelectedWholesalerFilter(w.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap cursor-pointer transition ${
                    selectedWholesalerFilter === w.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Items Table / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => {
              const isEditing = editingItemId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between space-y-3 hover:border-indigo-500/40 transition"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        Batch: {item.batchNumber}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        EFDA Reg
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{item.itemName}</h4>
                    <p className="text-xs text-slate-400 font-medium">{item.genericName} • {item.strength}</p>
                    <p className="text-[11px] text-indigo-400 font-semibold mt-1">{item.wholesalerName}</p>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Available Quantity</span>
                        {isEditing ? (
                          <div className="flex items-center gap-1 mt-1">
                            <input
                              type="number"
                              value={newQuantity}
                              onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
                              className="w-20 bg-slate-950 border border-indigo-500 rounded px-1.5 py-0.5 text-xs text-white font-mono font-bold"
                            />
                            <button
                              onClick={() => handleUpdateQuantity(item.id)}
                              disabled={isUpdating}
                              className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingItemId(null)}
                              className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px] cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-sm font-bold text-white font-mono">
                              {item.quantityAvailable.toLocaleString()}
                            </span>
                            <button
                              onClick={() => {
                                setEditingItemId(item.id);
                                setNewQuantity(item.quantityAvailable);
                              }}
                              title="Update item quantity (Wholesaler Controlled)"
                              className="text-indigo-400 hover:text-white p-0.5 cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <span className="text-[10px] text-slate-400">{item.unitOfMeasure}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Wholesale Price</span>
                        <span className="text-sm font-black text-emerald-400 font-mono mt-0.5 block">
                          {item.unitPriceETB} ETB
                        </span>
                        <span className="text-[10px] text-slate-400">Min Order: {item.minimumOrderQuantity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Inquire Button */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 text-[10px]">Exp: {item.expiryDate}</span>
                    <button
                      onClick={() => {
                        setMessageRecipientWholesaler(item.wholesalerId);
                        setMessageSelectedItem(item.id);
                        setMessageText(`Greetings ${item.wholesalerName}, we are inquiring regarding bulk supply for ${item.itemName} (${item.quantityAvailable} available in stock at ${item.unitPriceETB} ETB).`);
                        setActiveTab('messages');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 font-bold flex items-center gap-1 cursor-pointer transition"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Inquire / Order</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CLIENT-TO-WHOLESALER MESSAGING (POST & GET /api/messages) */}
      {/* ========================================================================= */}
      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Send Message Form */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-teal-400" />
                <span>Direct Wholesaler Order Dispatch</span>
              </h3>
              <span className="text-[10px] text-teal-400 font-mono">B2B Messaging API</span>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Target Wholesaler</label>
                <select
                  value={messageRecipientWholesaler}
                  onChange={(e) => setMessageRecipientWholesaler(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-medium focus:border-indigo-500"
                >
                  <option value="wh-apf">Addis Pharmaceuticals Factory (APF) Wholesale</option>
                  <option value="wh-kadisco">Kadisco Chemical & Pharmaceutical Wholesaler</option>
                  <option value="wh-medtech">Medtech Ethiopia Pharmaceutical Wholesaler</option>
                  <option value="wh-bafana">Bafana Pharmaceutical Wholesaler & Importer</option>
                  <option value="wh-julphar">Julphar Pharmaceuticals Wholesaler</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Associated Inventory Item (Optional)</label>
                <select
                  value={messageSelectedItem}
                  onChange={(e) => setMessageSelectedItem(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-medium focus:border-indigo-500"
                >
                  <option value="">General Order Inquiry</option>
                  {items.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.itemName} ({i.wholesalerName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Inquiry / Requisition Message</label>
                <textarea
                  rows={4}
                  required
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Specify quantity needed, delivery timeline, payment terms, or credit framework..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSendingMessage}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSendingMessage ? 'Sending...' : 'Send Message Directly to Wholesaler'}</span>
              </button>
            </form>
          </div>

          {/* Conversation History / Inbox */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>Conversation Inbox & Thread History</span>
              </h3>
              <span className="text-[10px] text-slate-400">{messages.length} Messages</span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                    <div>
                      <span className="font-bold text-white text-xs">{msg.senderName}</span>
                      <span className="text-[10px] text-slate-400 block">{msg.senderRole} ➔ {msg.receiverName}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(msg.timestamp).toLocaleDateString()} {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {msg.itemName && (
                    <div className="inline-block px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[10px] font-mono border border-indigo-500/20">
                      Product: {msg.itemName}
                    </div>
                  )}

                  <p className="text-slate-300 leading-relaxed text-xs">
                    {msg.messageText}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. WHOLESALER SUBSCRIPTION (500 ETB / 3 MONTHS) */}
      {/* ========================================================================= */}
      {activeTab === 'subscription' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                Wholesaler License & Registration
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                Quarterly Wholesaler Listing Plan (500 ETB / 3 Months)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Accredited listing on Pharma Star App Pro: publish bulk pharmaceutical inventory, update live batches, and receive orders.
              </p>
            </div>

            <button
              onClick={() => setIsSubscribeModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition cursor-pointer self-start sm:self-auto"
            >
              <CreditCard className="w-4 h-4" />
              <span>Renew or Register (500 Birr)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Active License Details</span>
              <div className="space-y-1">
                <span className="text-sm font-bold text-white block">{subscription.wholesalerName}</span>
                <span className="text-[11px] text-indigo-400 font-mono block">License: {subscription.licenseNo}</span>
                <span className="text-slate-400 block">{subscription.region}, {subscription.city}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Subscription Period</span>
              <div className="space-y-1">
                <span className="text-sm font-bold text-emerald-400 block">3 Months Active</span>
                <span className="text-slate-400 block">Started: {subscription.startDate}</span>
                <span className="text-amber-400 font-bold block">Renewal Date: {subscription.expiryDate}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Payment Verification</span>
              <div className="space-y-1">
                <span className="text-sm font-bold text-white block">500 ETB / Quarter</span>
                <span className="text-slate-400 block">Method: {subscription.paymentMethod.toUpperCase()}</span>
                <span className="text-[11px] text-teal-400 font-mono block">Ref: {subscription.paymentReference}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Modal (500 ETB / 3 Months) */}
      {isSubscribeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Subscribe Wholesaler (500 Birr / 3 Months)</h3>
                <span className="text-[10px] text-slate-400">Quarterly B2B Listing & Bulk Order Dispatch</span>
              </div>
              <button onClick={() => setIsSubscribeModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Payment Details */}
            <div className="p-3 bg-slate-950 rounded-xl border border-indigo-500/30 text-xs space-y-1">
              <span className="font-bold text-indigo-300 block">Official Payment Gateways (500 Birr):</span>
              <div className="text-slate-300 space-y-0.5 text-[11px]">
                <p>• <strong>Telebirr:</strong> 0982852778 (Dawid Aliyi)</p>
                <p>• <strong>CBE:</strong> 1000262900367 (Dawid Aliyi)</p>
                <p>• <strong>CBE Birr:</strong> *847# (Merchant: 262900)</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Wholesaler Entity Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kadisco Chemical & Pharmaceutical Wholesaler"
                  value={subForm.wholesalerName}
                  onChange={(e) => setSubForm({ ...subForm, wholesalerName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">EFDA License No</label>
                  <input
                    type="text"
                    placeholder="e.g. EFDA-WHL-AA-2026-99"
                    value={subForm.licenseNo}
                    onChange={(e) => setSubForm({ ...subForm, licenseNo: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={subForm.contactPhone}
                    onChange={(e) => setSubForm({ ...subForm, contactPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Payment Method</label>
                <select
                  value={subForm.paymentMethod}
                  onChange={(e) => setSubForm({ ...subForm, paymentMethod: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="telebirr">Telebirr (0982852778)</option>
                  <option value="cbe">CBE Account (1000262900367)</option>
                  <option value="cbeBirr">CBE Birr (*847#)</option>
                  <option value="chapa">Chapa Unified Payment</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Transaction Reference / SMS Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TB-WHL-500-XXXXX"
                  value={subForm.paymentReference}
                  onChange={(e) => setSubForm({ ...subForm, paymentReference: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <button
                onClick={handleActivateSubscription}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition cursor-pointer"
              >
                Submit Payment & Activate 3-Month Plan (500 ETB)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
