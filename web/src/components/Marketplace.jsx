import React, { useState, useEffect } from 'react';
import {
  ShoppingBag, MapPin, Star, Tag, Loader2, RefreshCw,
  PhoneCall, Check, Package, Search, PlusCircle, X, Trash2,
  CheckCircle2, Send, AlertTriangle
} from 'lucide-react';
import {
  onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { marketplaceRef, ordersRef, db } from '../services/firebase.js';
import { getTranslation } from '../services/translations.js';
import { useCountUp } from '../hooks/useCountUp.js';

// ── Crop type options ──────────────────────────────────────────────────────
const CROP_CATEGORIES = [
  { id: 'ALL', labelEn: 'All Produce', labelHi: 'सभी फसलें' },
  { id: 'Rice', labelEn: '🍚 Paddy / Rice', labelHi: '🍚 धान / चावल' },
  { id: 'Wheat', labelEn: '🌾 Wheat', labelHi: '🌾 गेहूं' },
  { id: 'Vegetables', labelEn: '🍅 Vegetables', labelHi: '🍅 सब्जियां' },
  { id: 'Fiber', labelEn: '🌱 Cotton', labelHi: '🌱 कपास' },
];

// Fallback verified produce listings if Firestore is empty on demo boot
const INITIAL_DEMO_LISTINGS = [
  {
    id: 'demo-1',
    title: 'A-Grade Organic PB-1121 Basmati Rice',
    cropType: 'Rice / Paddy',
    price: 3820,
    unit: 'Quintal',
    availableQuantity: '180 Quintals',
    location: 'Karnal, Haryana',
    sellerName: 'Harpreet Singh',
    badge: 'FARMER DIRECT · LAB TESTED',
    rating: 4.9,
    description: 'Moisture < 12%, aged 6 months, pesticide residue free.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'demo-2',
    title: 'Certified Lok-1 Sharbati Golden Wheat',
    cropType: 'Cereals',
    price: 2450,
    unit: 'Quintal',
    availableQuantity: '350 Quintals',
    location: 'Khanna, Punjab',
    sellerName: 'Gurmail Singh',
    badge: 'VERIFIED HARVEST',
    rating: 4.8,
    description: 'High gluten, cleaned and graded, 50kg gunny bags.',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'demo-3',
    title: 'Fresh Farm Polyhouse Hybrid Tomatoes',
    cropType: 'Vegetables',
    price: 1850,
    unit: 'Quintal',
    availableQuantity: '60 Quintals',
    location: 'Kolar, Karnataka',
    sellerName: 'Venkatesh Gowda',
    badge: 'DAILY HARVEST',
    rating: 4.7,
    description: 'Uniform firm red tomatoes, ready for immediate dispatch.',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'demo-4',
    title: 'Long Staple BT Cotton (Kapas)',
    cropType: 'Fiber',
    price: 7150,
    unit: 'Quintal',
    availableQuantity: '120 Quintals',
    location: 'Rajkot, Gujarat',
    sellerName: 'Mansukhbhai Patel',
    badge: 'GINNING GRADE A+',
    rating: 4.9,
    description: '29mm staple length, low trash content, stored dry.',
    image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=600&q=80'
  }
];

// ── Post Listing Modal (Farmers only) ─────────────────────────────────────
function PostListingModal({ user, onClose, language = 'EN' }) {
  const isHi = language === 'HI';
  const [form, setForm] = useState({
    title: '', cropType: '', price: '', quantity: '', location: '', description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.cropType || !form.price || !form.quantity) {
      setError(isHi ? 'कृपया सभी आवश्यक फ़ील्ड भरें।' : 'Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      await addDoc(marketplaceRef, {
        title: form.title.trim(),
        cropType: form.cropType,
        price: Number(form.price),
        unit: 'Quintal',
        availableQuantity: `${form.quantity} Quintals`,
        location: form.location.trim() || user?.location || 'Punjab, India',
        description: form.description.trim(),
        sellerName: user?.name || 'Farmer',
        sellerId: user?.uid || 'guest-farmer',
        sellerEmail: user?.email || '',
        badge: 'DIRECT FROM FARMER',
        rating: 4.8,
        createdAt: serverTimestamp(),
        image: `https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80`
      });
      onClose();
    } catch (err) {
      setError(isHi ? 'लिस्टिंग पोस्ट करने में विफल। पुनः प्रयास करें।' : 'Failed to post listing. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="card w-full max-w-lg p-6 shadow-2xl relative animate-fade-up">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl text-muted hover:bg-subtle transition-colors cursor-pointer">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary-green flex items-center justify-center">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-main">{isHi ? "अपनी उपज लिस्ट करें" : "List Your Produce"}</h3>
            <p className="text-xs font-semibold text-muted">{isHi ? "व्यापारियों हेतु सीधी लिस्टिंग जोड़ें" : "Post a direct marketplace listing"}</p>
          </div>
        </div>

        {error && <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-sm font-semibold text-red-600 dark:text-red-400">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="field-label">{isHi ? "उपज का नाम *" : "Listing Title *"}</label>
            <input type="text" required value={form.title} onChange={handle('title')} placeholder="e.g. Organic Basmati Paddy A-Grade" className="field-input" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="field-label">{isHi ? "फसल की श्रेणी *" : "Crop Type *"}</label>
              <select required value={form.cropType} onChange={handle('cropType')} className="field-input">
                <option value="">Select</option>
                <option value="Rice / Paddy">Rice / Paddy</option>
                <option value="Cereals">Wheat</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fiber">Cotton</option>
                <option value="Pulses">Pulses</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="field-label">{isHi ? "भाव (₹ / क्विंटल) *" : "Price (₹ / Quintal) *"}</label>
              <input type="number" required min={1} value={form.price} onChange={handle('price')} placeholder="e.g. 3800" className="field-input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="field-label">{isHi ? "मात्रा (क्विंटल) *" : "Quantity (Quintals) *"}</label>
              <input type="number" required min={1} value={form.quantity} onChange={handle('quantity')} placeholder="e.g. 120" className="field-input" />
            </div>
            <div className="space-y-1">
              <label className="field-label">{isHi ? "स्थान / जिला" : "Location"}</label>
              <input type="text" value={form.location} onChange={handle('location')} placeholder="e.g. Amritsar, Punjab" className="field-input" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="field-label">{isHi ? "विवरण (वैकल्पिक)" : "Description (optional)"}</label>
            <textarea value={form.description} onChange={handle('description')} rows={2} placeholder="Grade, moisture content, packaging details…" className="field-input resize-none" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-outline flex-1 cursor-pointer">{isHi ? "रद्द करें" : "Cancel"}</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 cursor-pointer">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><PlusCircle className="w-4 h-4" /><span>{isHi ? "पोस्ट करें" : "Post Listing"}</span></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Bulk Order Modal (Buyers only) ─────────────────────────────────────────
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
        buyerId: user?.uid || 'guest-buyer',
        buyerName: user?.name || 'Institutional Buyer',
        buyerEmail: user?.email || '',
        quantity: Number(quantity),
        pricePerUnit: item.price,
        totalAmount: Number(quantity) * item.price,
        note: note.trim(),
        status: 'pending',
        requestedAt: serverTimestamp()
      });
      setSuccess(true);
    } catch (err) {
      setError(isHi ? 'ऑर्डर भेजने में विफल। पुनः प्रयास करें।' : 'Failed to place order. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-6 shadow-2xl relative animate-fade-up">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl text-muted hover:bg-subtle transition-colors cursor-pointer"><X className="w-5 h-5" /></button>

        {success ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-16 h-16 rounded-full bg-primary-light border-2 border-primary-light flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9 text-primary-green" />
            </div>
            <h3 className="text-xl font-black text-main">{isHi ? "ऑर्डर सफलतापूर्वक भेजा गया!" : "Order Placed!"}</h3>
            <p className="text-sm text-body">
              {isHi 
                ? `${quantity} क्विंटल ${item.title} का थोक ऑर्डर किसान को भेज दिया गया है।`
                : `Your bulk order for ${quantity} quintals of ${item.title} has been sent to the farmer.`}
            </p>
            <button onClick={onClose} className="btn-primary w-full mt-2 cursor-pointer">{isHi ? "पूर्ण" : "Done"}</button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-center justify-center text-amber-500">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-main">{isHi ? "थोक खरीद ऑर्डर भेजें" : "Place Bulk Order"}</h3>
                <p className="text-xs text-muted font-semibold line-clamp-1">{item.title}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-subtle border border-border-subtle mb-4 flex items-center justify-between text-sm">
              <span className="text-muted font-semibold">{isHi ? "दर प्रति क्विंटल" : "Price per Quintal"}</span>
              <span className="text-xl font-black text-primary-green">₹{item.price?.toLocaleString()}</span>
            </div>

            {error && <div className="mb-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-sm font-semibold text-red-600 dark:text-red-400">{error}</div>}

            <form onSubmit={handleOrder} className="space-y-4">
              <div className="space-y-1">
                <label className="field-label">{isHi ? "आवश्यक मात्रा (क्विंटल) *" : "Quantity Required (Quintals) *"}</label>
                <input type="number" required min={1} value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="e.g. 50" className="field-input" />
                {quantity && <p className="text-xs text-primary-green font-bold mt-1">Total: ₹{(Number(quantity) * item.price).toLocaleString()}</p>}
              </div>
              <div className="space-y-1">
                <label className="field-label">{isHi ? "किसान के लिए नोट (वैकल्पिक)" : "Note to Farmer (optional)"}</label>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Quality specs, delivery needs, packaging…" className="field-input resize-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={onClose} className="btn-outline flex-1 cursor-pointer">{isHi ? "रद्द करें" : "Cancel"}</button>
                <button type="submit" disabled={loading} className="btn-gold flex-1 cursor-pointer">
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

// ── Main Marketplace Component ─────────────────────────────────────────────
export default function Marketplace({ language = 'EN', user }) {
  const t = getTranslation(language);
  const isHi = language === 'HI';

  const [listings, setListings] = useState(INITIAL_DEMO_LISTINGS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showPostModal, setShowPostModal] = useState(false);
  const [orderTarget, setOrderTarget] = useState(null);

  const isFarmer = user?.role === 'farmer' || user?.isGuest;
  const isBuyer = user?.role === 'buyer';

  // Subscribe to Firestore marketplace, merge with demo listings if needed
  useEffect(() => {
    const q = query(marketplaceRef, orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setListings(data);
      } else {
        setListings(INITIAL_DEMO_LISTINGS);
      }
      setLoading(false);
    }, (err) => {
      console.warn('Marketplace snapshot fallback to demo:', err.message);
      setListings(INITIAL_DEMO_LISTINGS);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm(isHi ? 'क्या आप इस लिस्टिंग को हटाना चाहते हैं?' : 'Delete this listing?')) return;
    try {
      await deleteDoc(doc(db, 'marketplace', listingId));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filteredListings = listings.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || item.title?.toLowerCase().includes(q) ||
      item.location?.toLowerCase().includes(q) || item.cropType?.toLowerCase().includes(q);
    const matchesCategory = categoryFilter === 'ALL' ||
      item.cropType?.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <section aria-label="Farmer Marketplace" className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-200 dark:border-amber-900 flex items-center justify-center text-amber-500 shadow-sm shrink-0">
            <ShoppingBag className="w-7 h-7" strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-main tracking-tight">
              {t.market.title}
            </h2>
            <p className="text-sm font-semibold text-muted mt-0.5">
              {t.market.subtitle}
            </p>
          </div>
        </div>

        {isFarmer && (
          <button onClick={() => setShowPostModal(true)}
            className="btn-primary self-start sm:self-auto inline-flex items-center gap-2 text-sm shrink-0 cursor-pointer">
            <PlusCircle className="w-4 h-4" />
            <span>{t.market.listProduce}</span>
          </button>
        )}
      </div>

      {/* Search + Filter */}
      <div className="card p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder={isHi ? "फसल, मंडी या स्थान खोजें…" : "Search crop, mandi, location…"}
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="field-input pl-10" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 shrink-0">
          {CROP_CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setCategoryFilter(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-primary-green text-white shadow-sm'
                  : 'bg-subtle text-muted hover:text-main border border-border-subtle'
              }`}>
              {isHi ? cat.labelHi : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-pulse">
          {[1, 2, 3, 4].map(n => <div key={n} className="card overflow-hidden h-96" />)}
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredListings.length === 0 && (
        <div className="card p-12 text-center space-y-3 border-dashed border-2 border-border-subtle">
          <ShoppingBag className="w-12 h-12 text-muted mx-auto" />
          <h3 className="text-xl font-black text-main">{isHi ? "कोई लिस्टिंग नहीं मिली" : "No Listings Found"}</h3>
          <p className="text-sm text-muted max-w-sm mx-auto">
            {searchQuery 
              ? (isHi ? `"${searchQuery}" से मेल खाती कोई फसल नहीं मिली।` : `No crops matched "${searchQuery}".`)
              : (isHi ? 'अभी कोई लिस्टिंग उपलब्ध नहीं है। किसान भाई अपनी उपज पोस्ट कर सकते हैं।' : 'No listings yet. Verified farmers can list produce to get started.')}
          </p>
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); setCategoryFilter('ALL'); }} className="btn-outline text-xs mt-2 cursor-pointer">
              {isHi ? "फ़िल्टर हटाएं" : "Clear Filters"}
            </button>
          )}
        </div>
      )}

      {/* Listings grid */}
      {!loading && filteredListings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredListings.map(item => (
            <ProduceCard
              key={item.id}
              item={item}
              user={user}
              isBuyer={isBuyer}
              language={language}
              onOrder={() => setOrderTarget(item)}
              onDelete={() => handleDeleteListing(item.id)}
            />
          ))}
        </div>
      )}

      {/* Post listing modal */}
      {showPostModal && <PostListingModal user={user} onClose={() => setShowPostModal(false)} language={language} />}

      {/* Bulk order modal */}
      {orderTarget && <BulkOrderModal item={orderTarget} user={user} onClose={() => setOrderTarget(null)} language={language} />}
    </section>
  );
}

function ProduceCard({ item, user, isBuyer, language = 'EN', onOrder, onDelete }) {
  const isHi = language === 'HI';
  const [contacted, setContacted] = useState(false);
  const animPrice = useCountUp(item.price || 0, 600, 0);
  const isOwner = user?.uid && item.sellerId === user.uid;

  return (
    <article className="card overflow-hidden card-hover flex flex-col justify-between shadow-sm">
      <div>
        {/* Image */}
        <div className="relative h-48 bg-subtle overflow-hidden">
          {item.image ? (
            <img src={item.image} alt={item.title} loading="lazy"
              className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted">
              <Package className="w-12 h-12" />
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-card/95 text-main border border-border-card shadow-sm backdrop-blur-sm">
              {item.badge || 'VERIFIED PRODUCE'}
            </span>
          </div>
          {isOwner && (
            <button onClick={onDelete}
              className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-card/90 hover:bg-red-50 dark:hover:bg-red-950/70 border border-border-card flex items-center justify-center text-red-600 dark:text-red-400 transition-colors shadow-sm cursor-pointer"
              title="Delete your listing">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="font-bold flex items-center gap-1 text-primary-green">
              <Tag className="w-3.5 h-3.5" />
              {item.cropType || 'Crop'}
            </span>
            <span className="flex items-center gap-1 text-amber-500 font-extrabold text-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              {item.rating || '4.8'}
            </span>
          </div>
          <h3 className="text-lg font-black text-main leading-tight line-clamp-2">{item.title}</h3>
          <div className="grid grid-cols-2 gap-2 text-xs py-1">
            <div className="p-2 rounded-xl bg-subtle border border-border-subtle">
              <span className="text-muted block text-[10px]">{isHi ? "उपलब्ध मात्रा" : "Available"}</span>
              <span className="font-extrabold text-main text-xs truncate block">{item.availableQuantity || '—'}</span>
            </div>
            {item.description && (
              <div className="p-2 rounded-xl bg-subtle border border-border-subtle">
                <span className="text-muted block text-[10px]">{isHi ? "विवरण" : "Details"}</span>
                <span className="font-extrabold text-main text-xs truncate block">{item.description}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted pt-1">
            <MapPin className="w-3.5 h-3.5 text-primary-green shrink-0" />
            <span className="font-bold text-main truncate">{item.sellerName}</span>
            <span className="text-muted truncate">• {item.location}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 pt-3 border-t border-border-card flex items-center justify-between gap-3 bg-subtle/40">
        <div>
          <div className="text-xl font-black text-primary-green">₹{animPrice.toLocaleString()}</div>
          <div className="text-[11px] text-muted">per {item.unit || 'Quintal'}</div>
        </div>

        {isBuyer ? (
          <button onClick={onOrder} className="btn-gold px-3.5 py-1.5 min-h-[40px] text-xs cursor-pointer">
            <Send className="w-4 h-4" /><span>{isHi ? "थोक ऑर्डर" : "Bulk Order"}</span>
          </button>
        ) : (
          <button onClick={() => setContacted(true)} disabled={contacted}
            className={contacted
              ? 'btn-outline px-3 py-1.5 min-h-[40px] text-xs cursor-default'
              : 'btn-gold px-3.5 py-1.5 min-h-[40px] text-xs cursor-pointer'}>
            {contacted
              ? <><Check className="w-4 h-4" /><span>{isHi ? "संपर्क किया गया" : "Contacted"}</span></>
              : <><PhoneCall className="w-4 h-4" /><span>{isHi ? "सीधा संपर्क" : "Contact"}</span></>}
          </button>
        )}
      </div>
    </article>
  );
}
