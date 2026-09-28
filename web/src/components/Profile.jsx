import React from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Sprout, 
  ShoppingBag, 
  Award, 
  HelpCircle, 
  CheckCircle2,
  FileText,
  BadgePercent,
  ExternalLink,
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Building2,
  Sparkles
} from 'lucide-react';
import { getTranslation } from '../services/translations.js';

export default function Profile({ user, onOpenAuth, language = 'EN', onLogout }) {
  const t = getTranslation(language);
  const isHi = language === 'HI';

  // Fallback demo values for Guest Farmer to ensure rich, non-stale presentation
  const farmerName = user?.isGuest
    ? (isHi ? 'गेस्ट किसान' : 'Guest Farmer')
    : (user?.name || (isHi ? 'किसान' : 'Farmer'));
  const farmerLocation = user?.location || (isHi ? 'लुधियाना, पंजाब' : 'Ludhiana, Punjab');
  const farmerPhone = user?.phone || '+91 98765 43210';
  const farmerSoil = user?.soilType || (isHi ? 'जलोढ़ दोमट मिट्टी (Alluvial Loam)' : 'Alluvial Loam Soil');
  const landHolding = user?.landSize || (isHi ? '14 एकड़ सिंचित भूमि' : '14.0 Acres (Canal Irrigated)');
  const standingCrop = user?.standingCrop || (isHi ? 'गेहूं (HD-2967) · 22 क्विंटल/एकड़' : 'Wheat (HD-2967) · 22 Qtl/Acre');

  return (
    <section aria-label="Farmer Profile and Farm Dashboard" className="space-y-6 animate-fade-up">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-primary-light border-2 border-primary-light flex items-center justify-center text-primary-green shadow-sm shrink-0">
          <User className="w-7 h-7" strokeWidth={2.2} />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-main tracking-tight">
            {isHi ? 'किसान प्रोफाइल व खेत डैशबोर्ड' : 'Farmer Profile & Land Dashboard'}
          </h2>
          <p className="text-sm font-semibold text-muted mt-0.5">
            {isHi 
              ? 'अपनी भूमि रिकॉर्ड, सरकारी सब्सिडी, मृदा स्वास्थ्य कार्ड और मंडी लिस्टिंग प्रबंधित करें।'
              : 'Manage your land records, government subsidies, soil health status, and produce listings.'}
          </p>
        </div>
      </div>

      {/* ── Multi-Column Split: Farmer Land Identity (7 cols) + Subsidies & Support (5 cols) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left 7 Columns: Farmer Card + Land Metrics */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Identity Card */}
          <div className="card p-6 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-5 border-b border-border-card">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#1B5E20] to-[#2E7D32] flex items-center justify-center text-white text-3xl font-black shadow-md shrink-0">
                {user?.isGuest ? 'G' : (farmerName ? farmerName.slice(0, 2).toUpperCase() : 'GF')}
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-2xl sm:text-3xl font-black text-main">
                    {farmerName}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black bg-primary-light border border-primary-light text-primary-green">
                    <ShieldCheck className="w-4 h-4" /> {isHi ? 'प्रमाणित किसान (PM-KISAN)' : 'Verified Kisan ID'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-body font-semibold">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-primary-green" />
                    {farmerLocation}
                  </span>
                  <span className="text-muted">•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4 text-primary-green" />
                    {farmerPhone}
                  </span>
                </div>
              </div>
            </div>

            {/* Farm Land Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="metric-box space-y-1 p-3.5">
                <div className="text-xs font-bold text-muted">{isHi ? 'मिट्टी का प्रकार' : 'Soil Profile'}</div>
                <div className="text-lg font-black text-main leading-tight">{farmerSoil}</div>
                <div className="text-[11px] font-semibold text-primary-green">{isHi ? 'मृदा स्वास्थ्य कार्ड सत्यापित' : 'Soil Health Card OK'}</div>
              </div>

              <div className="metric-box space-y-1 p-3.5">
                <div className="text-xs font-bold text-muted">{isHi ? 'वर्तमान खड़ी फसल' : 'Standing Crop'}</div>
                <div className="text-lg font-black text-main leading-tight">{standingCrop}</div>
                <div className="text-[11px] font-semibold text-amber-500">{isHi ? 'बुवाई: नवंबर · रबी चक्र' : 'Sown Nov · Rabi Cycle'}</div>
              </div>

              <div className="metric-box space-y-1 p-3.5">
                <div className="text-xs font-bold text-muted">{isHi ? 'कुल भूमि रकबा' : 'Landholding'}</div>
                <div className="text-lg font-black text-main leading-tight">{landHolding}</div>
                <div className="text-[11px] font-semibold text-muted">{isHi ? 'नहरी सिंचाई उपलब्ध' : 'Canal Irrigated'}</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-subtle border border-border-subtle flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-light text-primary-green flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-muted">{isHi ? 'किसान क्रेडिट कार्ड (KCC)' : 'Kisan Credit Card (KCC)'}</div>
                  <div className="text-sm font-black text-main">₹3,00,000 {isHi ? 'स्वीकृत सीमा' : 'Sanctioned Limit'}</div>
                  <div className="text-[10px] text-primary-green font-bold">SBI Agri Branch · Active</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-subtle border border-border-subtle flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-muted">{isHi ? 'सक्रिय मंडी लॉट' : 'Active Market Lot'}</div>
                  <div className="text-sm font-black text-main">120 Qtl · PB-1121 Basmati</div>
                  <div className="text-[10px] text-amber-500 font-bold">{isHi ? 'लाइव बोली चालू है' : 'Receiving Buyer Bids'}</div>
                </div>
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="sm:col-span-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 font-bold text-sm transition-colors cursor-pointer"
                >
                  <ArrowUpRight className="w-4 h-4 rotate-90" />
                  <span>{isHi ? 'लॉगआउट करें' : 'Sign Out / Exit Dashboard'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Government Subsidies & Kisan Call Centre */}
        <div className="lg:col-span-5 space-y-5">
          {/* Government Schemes Card */}
          <div className="card p-6 space-y-4">
            <h4 className="text-base font-black text-main flex items-center gap-2">
              <Award className="w-5 h-5 text-primary-green" />
              {isHi ? 'सक्रिय सरकारी योजनाएं व सब्सिडी' : 'Active Govt Schemes & Subsidies'}
            </h4>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-primary-light border border-primary-light flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-black text-primary-green">PM-KISAN Samman Nidhi</div>
                  <div className="text-xs font-semibold text-body">{isHi ? '₹6,000 / वर्ष · 17वीं किस्त जारी' : '₹6,000 / year · 17th Installment Credited'}</div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-primary-green text-white">
                  {isHi ? 'सक्रिय' : 'Active'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-black text-sky-500">PM Fasal Bima Yojana (PMFBY)</div>
                  <div className="text-xs font-semibold text-body">{isHi ? 'रबी फसल बीमा सक्रिय (#PB9821)' : 'Rabi Crop Insurance Active (#PB9821)'}</div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-sky-500 text-white">
                  {isHi ? 'बीमित' : 'Insured'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-black text-amber-500">{isHi ? 'उर्वरक सब्सिडी DBT पासबुक' : 'Fertilizer Subsidy Passbook'}</div>
                  <div className="text-xs font-semibold text-body">{isHi ? 'डायरेक्ट बेनिफिट ट्रांसफर (DBT) लिंक' : 'Direct Benefit Transfer (DBT) Linked'}</div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-amber-500 text-white">
                  {isHi ? 'लिंक' : 'Linked'}
                </span>
              </div>
            </div>
          </div>

          {/* Kisan Call Centre Helpline Card */}
          <div className="card p-6 advisory-normal space-y-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary-green" />
              <h4 className="text-base font-black text-main">
                {isHi ? '24/7 किसान कॉल सेंटर हेल्पलाइन' : '24/7 Kisan Call Centre Helpline'}
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-body font-medium leading-relaxed">
              {isHi 
                ? 'कीट प्रकोप, मृदा परीक्षण और न्यूनतम समर्थन मूल्य (MSP) की जानकारी हेतु कृषि वैज्ञानिकों से सीधी सलाह पाएं।'
                : 'Direct telephonic agronomy advice from agriculture scientists for pest outbreaks, soil testing, and MSP updates.'}
            </p>
            <div className="pt-1">
              <a
                href="tel:18001801551"
                className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>{isHi ? 'टोल-फ्री डायल करें: 1800-180-1551' : 'Toll-Free: 1800-180-1551'}</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
