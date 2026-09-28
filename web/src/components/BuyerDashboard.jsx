import React, { useState, useEffect } from 'react';
import {
  ShoppingBag, Search, Star, MapPin, Tag, Send, Package, Building2,
  User, LogOut, Leaf, ClipboardList, CheckCircle2, Clock, Truck,
  X, ChevronDown, Globe, TrendingUp, Filter, Loader2, Sun, Moon
} from 'lucide-react';
import {
  onSnapshot, query, where, orderBy, addDoc, serverTimestamp
} from 'firebase/firestore';
import { marketplaceRef, ordersRef } from '../services/firebase.js';
import { useCountUp } from '../hooks/useCountUp.js';

// ── Order status config ──────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-[#FEF3E2] dark:bg-[#332410] text-[#D97706] dark:text-[#FBBF24] border-[#FCD34D] dark:border-[#66491A]', icon: <Clock className="w-4 h-4" /> },
  accepted: { label: 'Accepted', color: 'bg-[#E8F5E9] dark:bg-[#1C3320] text-[#2E7D32] dark:text-[#4ADE80] border-[#A5D6A7] dark:border-[#2E5E33]', icon: <CheckCircle2 className="w-4 h-4" /> },
  fulfilled: { label: 'Fulfilled', color: 'bg-[#E1F5FE] dark:bg-[#0C2A38] text-[#0288D1] dark:text-[#38BDF8] border-[#81D4FA] dark:border-[#1E4E66]', icon: <Truck className="w-4 h-4" /> },
  rejected: { label: 'Rejected', color: 'bg-[#FEE2E2] dark:bg-[#331717] text-[#B91C1C] dark:text-[#F87171] border-[#FCA5A5] dark:border-[#5E2626]', icon: <X className="w-4 h-4" /> },
};

// ── Bulk Order Modal ─────────────────────────────────────────────────────
function BulkOrderModal({ item, user, onClose, language = 'EN' }) {
  const isHi = language === 'HI';
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!quantity || Number(quantity) < 1) { setError(isHi ? 'मान्य मात्रा दर्ज करें।' : 'Enter a valid quantity.'); return; }
    setLoading(true);
    try {
      await addDoc(ordersRef, {
        listingId: item.id,
        listingTitle: item.title,
        farmerId: item.sellerId || '',
        farmerName: item.sellerName,
        buyerId: user.uid,
        buyerName: user.name,
        buyerEmail: user.email,
        quantity: Number(quantity),
        pricePerUnit: item.price,
        totalAmount: Number(quantity) * item.price,
        note: note.trim(),
        status: 'pending',
        requestedAt: serverTimestamp()
      });
      setSuccess(true);
    } catch (err) {
      setError(isHi ? 'ऑर्डर दर्ज करने में विफल। पुनः प्रयास करें।' : 'Failed to place order. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-6 border-2 border-[#F0E6D2] dark:border-[#263828] shadow-2xl relative animate-fade-up">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl text-[#8C7B6B] dark:text-[#94A3B8] hover:bg-[#F5EDD6] dark:hover:bg-[#1E2E20] transition-colors"><X className="w-5 h-5" /></button>
        {success ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#E8F5E9] dark:bg-[#1C3320] border-2 border-[#A5D6A7] dark:border-[#2E5E33] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9 text-[#2E7D32] dark:text-[#4ADE80]" />
            </div>
            <h3 className="text-xl font-black text-[#2C2416] dark:text-[#F0FDF4]">{isHi ? "ऑर्डर सफलतापूर्वक भेजा गया!" : "Order Placed!"}</h3>
            <p className="text-sm text-[#5A4F3F] dark:text-[#94A3B8]">
              {isHi 
                ? `${quantity} क्विंटल ${item.title} का थोक ऑर्डर किसान को सूचित कर दिया गया है।`
                : `${quantity} quintals of ${item.title} — the farmer has been notified.`}
            </p>
            <button onClick={onClose} className="btn-primary w-full mt-2">{isHi ? "पूर्ण" : "Done"}</button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#FEF3E2] dark:bg-[#332410] border border-[#FCD34D] dark:border-[#66491A] flex items-center justify-center text-[#D97706] dark:text-[#FBBF24]">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#2C2416] dark:text-[#F0FDF4]">{isHi ? "थोक खरीद ऑर्डर भेजें" : "Place Bulk Order"}</h3>
                <p className="text-xs text-[#5A4F3F] dark:text-[#94A3B8] font-semibold line-clamp-1">{item.title}</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#FDF6E9] dark:bg-[#141F15] border border-[#F0E6D2] dark:border-[#263828] mb-4 flex items-center justify-between text-sm">
              <span className="text-[#5A4F3F] dark:text-[#94A3B8] font-semibold">{isHi ? "दर प्रति क्विंटल" : "Price / Quintal"}</span>
              <span className="text-xl font-black text-[#2E7D32] dark:text-[#4ADE80]">₹{item.price?.toLocaleString()}</span>
            </div>
            {error && <div className="mb-3 px-4 py-3 rounded-xl bg-[#FEE2E2] dark:bg-[#331717] border border-[#FCA5A5] dark:border-[#5E2626] text-sm font-semibold text-[#B91C1C] dark:text-[#F87171]">{error}</div>}
            <form onSubmit={handleOrder} className="space-y-4">
              <div className="space-y-1">
                <label className="field-label dark:text-[#94A3B8]">{isHi ? "आवश्यक मात्रा (क्विंटल) *" : "Quantity (Quintals) *"}</label>
                <input type="number" required min={1} value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="e.g. 50" className="field-input dark:bg-[#162217] dark:text-[#F0FDF4] dark:border-[#263828]" />
                {quantity && <p className="text-xs text-[#2E7D32] dark:text-[#4ADE80] font-bold mt-1">Total: ₹{(Number(quantity) * item.price).toLocaleString()}</p>}
              </div>
              <div className="space-y-1">
                <label className="field-label dark:text-[#94A3B8]">{isHi ? "किसान के लिए नोट (वैकल्पिक)" : "Note to Farmer (optional)"}</label>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Quality specs, delivery needs…" className="field-input dark:bg-[#162217] dark:text-[#F0FDF4] dark:border-[#263828] resize-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={onClose} className="btn-outline flex-1 dark:bg-[#162217] dark:text-[#F0FDF4] dark:border-[#263828]">{isHi ? "रद्द करें" : "Cancel"}</button>
                <button type="submit" disabled={loading} className="btn-gold flex-1">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /><span>{isHi ? "ऑर्डर भेजें" : "Place Order"}</span></>}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ── Browse Listings Panel ────────────────────────────────────────────────
function BrowsePanel({ user, language = 'EN' }) {
  const isHi = language === 'HI';
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [orderTarget, setOrderTarget] = useState(null);

  useEffect(() => {
    const q = query(marketplaceRef, orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setListings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => { console.error(err); setLoading(false); });
    return () => unsub();
  }, []);

  const filtered = listings.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || item.title?.toLowerCase().includes(q) || item.location?.toLowerCase().includes(q) || item.cropType?.toLowerCase().includes(q);
    const matchCat = categoryFilter === 'ALL' || item.cropType?.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-5">
      {/* Search + Filter */}
      <div className="card p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8C7B6B] dark:text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder={isHi ? "फसल, मंडी, किसान या स्थान खोजें…" : "Search crop, location, farmer…"} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="field-input pl-10 dark:bg-[#162217] dark:text-[#F0FDF4] dark:border-[#263828]" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 shrink-0">
          {[
            { id: 'ALL', labelEn: 'All', labelHi: 'सभी' }, 
            { id: 'Rice', labelEn: '🍚 Paddy', labelHi: '🍚 धान' },
            { id: 'Wheat', labelEn: '🌾 Wheat', labelHi: '🌾 गेहूं' }, 
            { id: 'Vegetables', labelEn: '🍅 Veggies', labelHi: '🍅 सब्जियां' }, 
            { id: 'Fiber', labelEn: '🌱 Cotton', labelHi: '🌱 कपास' }
          ].map(cat => (
            <button key={cat.id} onClick={() => setCategoryFilter(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                categoryFilter === cat.id 
                  ? 'bg-[#2E7D32] text-white shadow-sm' 
                  : 'bg-[#FDF6E9] dark:bg-[#141F15] text-[#5A4F3F] dark:text-[#94A3B8] hover:bg-[#E8F5E9] dark:hover:bg-[#1C3320] border border-[#F0E6D2] dark:border-[#263828]'
              }`}>{isHi ? cat.labelHi : cat.labelEn}</button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          {[1, 2, 3].map(n => <div key={n} className="card h-80 bg-white dark:bg-[#162217]" />)}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="card p-12 text-center space-y-3 border-dashed border-2 border-[#E8DDD0] dark:border-[#263828]">
          <ShoppingBag className="w-12 h-12 text-[#8C7B6B] dark:text-[#94A3B8] mx-auto" />
          <h3 className="text-xl font-black text-[#2C2416] dark:text-[#F0FDF4]">{isHi ? "कोई उपज नहीं मिली" : "No Listings Found"}</h3>
          <p className="text-sm text-[#5A4F3F] dark:text-[#94A3B8]">
            {searchQuery ? `No listings matched "${searchQuery}".` : 'No farmer listings are available at the moment.'}
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(item => (
            <article key={item.id} className="card overflow-hidden card-hover flex flex-col justify-between shadow-sm">
              <div>
                <div className="relative h-44 bg-[#F5EDD6] dark:bg-[#1C2C1E] overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#8C7B6B] dark:text-[#94A3B8]"><Package className="w-10 h-10" /></div>
                  )}
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[11px] font-black bg-white/95 dark:bg-black/80 text-[#2C2416] dark:text-[#F0FDF4] border border-[#E8DDD0] dark:border-white/10 shadow-xs">
                    {item.badge || 'VERIFIED PRODUCE'}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#5A4F3F] dark:text-[#94A3B8]">
                    <span className="font-bold flex items-center gap-1"><Tag className="w-3 h-3 text-[#2E7D32] dark:text-[#4ADE80]" />{item.cropType}</span>
                    <span className="flex items-center gap-1 text-[#D97706] dark:text-[#FBBF24] font-extrabold"><Star className="w-3.5 h-3.5 fill-[#E8A93B]" />{item.rating || '4.8'}</span>
                  </div>
                  <h3 className="text-base font-black text-[#2C2416] dark:text-[#F0FDF4] line-clamp-1">{item.title}</h3>
                  <div className="text-xs text-[#5A4F3F] dark:text-[#94A3B8] flex items-center justify-between py-1 border-y border-[#F0E6D2] dark:border-[#263828]">
                    <span>Available: <strong>{item.availableQuantity || '—'}</strong></span>
                    <span className="flex items-center gap-1 text-[#8C7B6B] dark:text-[#94A3B8]"><MapPin className="w-3 h-3 text-[#2E7D32] dark:text-[#4ADE80]" />{item.location}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 pt-2 flex items-center justify-between gap-2 border-t border-[#F0E6D2] dark:border-[#263828] bg-[#FDF6E9]/40 dark:bg-[#141F15]/40">
                <div>
                  <div className="text-lg font-black text-[#2E7D32] dark:text-[#4ADE80]">₹{item.price?.toLocaleString()}</div>
                  <div className="text-[10px] text-[#8C7B6B] dark:text-[#94A3B8]">per {item.unit || 'Quintal'}</div>
                </div>
                <button onClick={() => setOrderTarget(item)} className="btn-gold px-3.5 py-1.5 text-xs">
                  <Send className="w-3.5 h-3.5" /><span>{isHi ? "थोक ऑर्डर" : "Bulk Order"}</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {orderTarget && <BulkOrderModal item={orderTarget} user={user} onClose={() => setOrderTarget(null)} language={language} />}
    </div>
  );
}

// ── My Orders Panel ──────────────────────────────────────────────────────
function MyOrdersPanel({ user, language = 'EN' }) {
  const isHi = language === 'HI';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(ordersRef, where('buyerId', '==', user.uid), orderBy('requestedAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => { console.error(err); setLoading(false); });
    return () => unsub();
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map(n => <div key={n} className="card h-24 bg-white dark:bg-[#162217]" />)}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="card p-12 text-center space-y-3 border-dashed border-2 border-[#E8DDD0] dark:border-[#263828]">
        <ClipboardList className="w-12 h-12 text-[#8C7B6B] dark:text-[#94A3B8] mx-auto" />
        <h3 className="text-xl font-black text-[#2C2416] dark:text-[#F0FDF4]">{isHi ? "कोई ऑर्डर नहीं मिला" : "No Orders Placed Yet"}</h3>
        <p className="text-sm text-[#5A4F3F] dark:text-[#94A3B8] max-w-sm mx-auto">
          {isHi ? "बाज़ार में उपलब्ध उपज देखें और किसानों से सीधे थोक ऑर्डर करें।" : "Browse verified farmer produce and place bulk orders directly."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map(order => {
        const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
        return (
          <div key={order.id} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-[#2C2416] dark:text-[#F0FDF4]">{order.listingTitle}</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-black border ${status.color}`}>
                  {status.icon}<span>{status.label}</span>
                </span>
              </div>
              <div className="text-xs text-[#5A4F3F] dark:text-[#94A3B8] flex items-center gap-3">
                <span>Farmer: <strong>{order.farmerName || 'Verified Farmer'}</strong></span>
                <span>•</span>
                <span>Qty: <strong>{order.quantity} Quintals</strong></span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-lg font-black text-[#2E7D32] dark:text-[#4ADE80]">₹{order.totalAmount?.toLocaleString()}</div>
              <div className="text-[11px] text-[#8C7B6B] dark:text-[#94A3B8]">@ ₹{order.pricePerUnit?.toLocaleString()}/Qtl</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Buyer Profile Panel ───────────────────────────────────────────────────
function BuyerProfilePanel({ user, onLogout, language = 'EN' }) {
  const isHi = language === 'HI';
  return (
    <div className="max-w-xl mx-auto card p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#D97706] to-[#F59E0B] text-white text-2xl font-black flex items-center justify-center shadow-md">
          {user?.name?.charAt(0).toUpperCase() || 'B'}
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#2C2416] dark:text-[#F0FDF4]">{user?.name}</h2>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEF3E2] dark:bg-[#332410] text-[#D97706] dark:text-[#FBBF24] border border-[#FCD34D] dark:border-[#66491A] text-xs font-black uppercase mt-1">
            🏢 Verified Institutional Buyer
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t border-[#F0E6D2] dark:border-[#263828] text-sm">
        <div className="flex justify-between py-2 border-b border-[#F0E6D2] dark:border-[#263828]">
          <span className="text-[#8C7B6B] dark:text-[#94A3B8]">Email</span>
          <span className="font-bold text-[#2C2416] dark:text-[#F0FDF4]">{user?.email || '—'}</span>
        </div>
        {user?.companyName && (
          <div className="flex justify-between py-2 border-b border-[#F0E6D2] dark:border-[#263828]">
            <span className="text-[#8C7B6B] dark:text-[#94A3B8]">Company</span>
            <span className="font-bold text-[#2C2416] dark:text-[#F0FDF4]">{user.companyName}</span>
          </div>
        )}
        {user?.phone && (
          <div className="flex justify-between py-2 border-b border-[#F0E6D2] dark:border-[#263828]">
            <span className="text-[#8C7B6B] dark:text-[#94A3B8]">Phone</span>
            <span className="font-bold text-[#2C2416] dark:text-[#F0FDF4]">+91 {user.phone}</span>
          </div>
        )}
      </div>

      <button onClick={onLogout} className="btn-outline w-full text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/50 flex items-center justify-center gap-2">
        <LogOut className="w-4 h-4" /><span>{isHi ? "लॉगआउट करें" : "Sign Out"}</span>
      </button>
    </div>
  );
}

// ── Main Buyer Dashboard ─────────────────────────────────────────────────
export default function BuyerDashboard({ user, language = 'EN', setLanguage, theme = 'light', setTheme, onLogout }) {
  const [activeTab, setActiveTab] = useState('browse');
  const [menuOpen, setMenuOpen] = useState(false);
  const isHi = language === 'HI';

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    if (setTheme) setTheme(next);
  };

  const TABS = [
    { id: 'browse', label: isHi ? 'मंडी उपज' : 'Browse Market', icon: ShoppingBag },
    { id: 'orders', label: isHi ? 'मेरे ऑर्डर' : 'My Orders', icon: ClipboardList },
    { id: 'profile', label: isHi ? 'प्रोफ़ाइल' : 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#FDF6E9] dark:bg-[#0F1710] text-[#5A4F3F] dark:text-[#CBD5E1] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-[#141F15] border-b border-[#F0E6D2] dark:border-[#263828] shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#D97706] to-[#F59E0B] flex items-center justify-center shadow-md shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-[#2C2416] dark:text-[#F0FDF4] tracking-tight">
                  Agro<span className="text-[#D97706] dark:text-[#FBBF24]">stat</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEF3E2] dark:bg-[#332410] text-[#D97706] dark:text-[#FBBF24] border border-[#FCD34D] dark:border-[#66491A] text-[10px] font-black uppercase tracking-wider">
                  🏢 Buyer
                </span>
              </div>
              <p className="text-xs font-semibold text-[#5A4F3F] dark:text-[#94A3B8] mt-0.5 hidden sm:block">
                Bulk Procurement Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Unified Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white dark:bg-[#162217] hover:bg-[#F5EDD6] dark:hover:bg-[#1C3320] text-[#2C2416] dark:text-[#F0FDF4] border border-[#F0E6D2] dark:border-[#263828] transition-colors shadow-2xs"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#5A4F3F]" />}
            </button>

            {/* Language */}
            <div className="flex items-center bg-[#FDF6E9] dark:bg-[#162217] border border-[#E8DDD0] dark:border-[#263828] rounded-xl p-1 shadow-inner">
              {[{ code: 'EN', label: 'EN' }, { code: 'HI', label: 'हि' }].map(({ code, label }) => (
                <button key={code} onClick={() => setLanguage(code)}
                  className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                    language === code ? 'bg-white dark:bg-[#22C55E] text-[#2C2416] dark:text-[#052E16] border border-[#E8DDD0] dark:border-[#22C55E] shadow-sm' : 'text-[#5A4F3F] dark:text-[#94A3B8] hover:text-[#2C2416] dark:hover:text-[#F0FDF4]'
                  }`}>{label}</button>
              ))}
            </div>

            {/* User chip */}
            <div className="relative">
              <button onClick={() => setMenuOpen(p => !p)}
                className="inline-flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-white dark:bg-[#162217] border border-[#E8DDD0] dark:border-[#263828] hover:bg-[#FDF6E9] dark:hover:bg-[#1E2E20] hover:shadow-md transition-all shadow-sm">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FEF3E2] dark:bg-[#332410] border border-[#FCD34D] dark:border-[#66491A] text-[#D97706] dark:text-[#FBBF24] font-black text-sm flex items-center justify-center shrink-0">
                  {user?.name?.charAt(0).toUpperCase() || 'B'}
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#2C2416] dark:text-[#F0FDF4] truncate max-w-[100px]">{user?.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#8C7B6B] dark:text-[#94A3B8] transition-all ${menuOpen ? 'rotate-180' : ''}`} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-[#162217] rounded-2xl border border-[#F0E6D2] dark:border-[#263828] shadow-lg py-1.5 z-50">
                  <button onClick={() => { setActiveTab('profile'); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-[#2C2416] dark:text-[#F0FDF4] hover:bg-[#FDF6E9] dark:hover:bg-[#1E2E20] transition-colors">
                    <User className="w-4 h-4 text-[#D97706]" />{isHi ? "प्रोफ़ाइल देखें" : "View Profile"}
                  </button>
                  <button onClick={onLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-[#B91C1C] dark:text-[#F87171] hover:bg-[#FEE2E2] dark:hover:bg-[#331717] transition-colors">
                    <LogOut className="w-4 h-4" />{isHi ? "लॉगआउट" : "Sign Out"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-28 lg:pb-12 space-y-7">

        {/* Desktop tabs */}
        <nav className="hidden lg:flex items-center gap-2 bg-white dark:bg-[#141F15] p-2 rounded-2xl border border-[#F0E6D2] dark:border-[#263828] shadow-sm transition-colors">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-base font-extrabold whitespace-nowrap transition-all ${
                  active ? 'bg-[#D97706] text-white shadow-sm' : 'text-[#2C2416] dark:text-[#CBD5E1] hover:bg-[#FEF3E2] dark:hover:bg-[#2B2313]'
                }`}>
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-[#2C2416] dark:text-[#CBD5E1]'}`} strokeWidth={2.4} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Tab section header */}
        <div className="flex items-center gap-3">
          {(() => {
            const tab = TABS.find(t => t.id === activeTab);
            if (!tab) return null;
            const Icon = tab.icon;
            return (
              <>
                <div className="w-12 h-12 rounded-2xl bg-[#FEF3E2] dark:bg-[#2B2313] border-2 border-[#FCD34D] dark:border-[#523E1B] flex items-center justify-center text-[#D97706] dark:text-[#FBBF24] shadow-sm shrink-0">
                  <Icon className="w-7 h-7" strokeWidth={2.2} />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#2C2416] dark:text-[#F0FDF4]">{tab.label}</h2>
                  <p className="text-sm text-[#5A4F3F] dark:text-[#94A3B8] font-semibold mt-0.5">
                    {activeTab === 'browse' ? (isHi ? 'किसान उपज देखें और थोक ऑर्डर दें।' : 'Browse live marketplace listings and place bulk orders.') :
                     activeTab === 'orders' ? (isHi ? 'अपने सभी थोक खरीद ऑर्डर ट्रैक करें।' : 'Track and manage all your bulk purchase orders.') :
                     (isHi ? 'व्यापारी खाता और संपर्क विवरण।' : 'Your buyer account and profile details.')}
                  </p>
                </div>
              </>
            );
          })()}
        </div>

        {/* Panel content */}
        <div key={activeTab} className="animate-fade-up">
          {activeTab === 'browse' && <BrowsePanel user={user} language={language} />}
          {activeTab === 'orders' && <MyOrdersPanel user={user} language={language} />}
          {activeTab === 'profile' && <BuyerProfilePanel user={user} onLogout={onLogout} language={language} />}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#141F15] border-t border-[#F0E6D2] dark:border-[#263828] shadow-lg transition-colors"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all relative ${
                  active ? 'text-[#D97706] dark:text-[#FBBF24]' : 'text-[#2C2416] dark:text-[#CBD5E1] hover:text-[#D97706]'
                }`}>
                <div className={`p-1 rounded-xl transition-all ${active ? 'bg-[#FEF3E2] dark:bg-[#2B2313]' : ''}`}>
                  <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2.2} />
                </div>
                <span className="text-[11px] font-extrabold mt-0.5 tracking-tight">{label}</span>
                {active && <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#D97706] dark:bg-[#FBBF24]" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <footer className="mt-auto bg-white dark:bg-[#141F15] border-t border-[#F0E6D2] dark:border-[#263828] py-6 text-sm text-[#8C7B6B] dark:text-[#94A3B8] transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-[#D97706]" />
            <span className="font-bold text-[#2C2416]">Agrostat Buyer Platform</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <p className="text-xs">Direct farm-to-buyer procurement for Indian agriculture.</p>
        </div>
      </footer>
    </div>
  );
}
