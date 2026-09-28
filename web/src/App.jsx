import React, { useState, useCallback, useEffect } from 'react';
import { Home, TrendingUp, Leaf, ShoppingBag, User, Bot } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, signOutUser, getUserProfile } from './services/firebase.js';
import { getTranslation } from './services/translations.js';

import Header from './components/Header.jsx';
import BottomNav from './components/BottomNav.jsx';
import SensorBanner from './components/SensorBanner.jsx';
import PricePrediction from './components/PricePrediction.jsx';
import CropRecommendation from './components/CropRecommendation.jsx';
import Marketplace from './components/Marketplace.jsx';
import Profile from './components/Profile.jsx';
import AuthModal from './components/AuthModal.jsx';
import LandingPage from './components/LandingPage.jsx';
import BuyerDashboard from './components/BuyerDashboard.jsx';
import AgroBot from './components/AgroBot.jsx';
import FloatingAgroBot from './components/FloatingAgroBot.jsx';

export default function App() {
  const [language, setLanguage] = useState(() => localStorage.getItem('agrostat_lang') || 'EN');
  const [theme, setTheme] = useState(() => localStorage.getItem('agrostat_theme') || 'light');
  const [activeTab, setActiveTab] = useState('home');

  // null = unauthenticated, {} = profile object (has .role)
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const t = getTranslation(language);

  // Synchronous and reactive Theme Switcher handler
  const handleSetTheme = useCallback((newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('agrostat_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, []);

  // Sync theme changes to HTML document element on initial load and updates
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('agrostat_theme', theme);
  }, [theme]);

  // Sync language changes
  useEffect(() => {
    localStorage.setItem('agrostat_lang', language);
  }, [language]);

  // ── Restore auth session on mount ────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        if (profile) {
          setUser(profile);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const openAuth = useCallback((mode = 'login') => {
    setAuthModal({ isOpen: true, mode });
  }, []);

  const closeAuth = useCallback(() => {
    setAuthModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  const handleLoginSuccess = useCallback((profile) => {
    setUser(profile);
    closeAuth();
  }, [closeAuth]);

  const handleContinueAsGuest = useCallback(() => {
    closeAuth();
    setUser({
      uid: 'guest-farmer-01',
      name: 'Gurmail Singh',
      email: 'gurmail.singh@kisan.in',
      phone: '+91 98765 43210',
      role: 'farmer',
      isGuest: true,
      state: 'Punjab',
      district: 'Ludhiana',
      location: 'Ludhiana, Punjab',
      soilType: 'Alluvial Loam',
      landSize: '14 Acres',
      standingCrop: 'Wheat (HD-2967)',
      kccStatus: 'Active (₹3,00,000 Limit)',
      pmKisanStatus: 'KYC Verified (17th Installment Active)'
    });
  }, [closeAuth]);

  const handleLogout = useCallback(async () => {
    try {
      if (user && !user.isGuest) {
        await signOutUser();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  }, [user]);

  const handleSpeakAdvisory = useCallback((text) => {
    if (!text) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.lang = language === 'HI' ? 'hi-IN' : 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  }, [language]);

  // ── Tab configuration (farmer dashboard) ───────────────────────────────────
  const tabsList = [
    { id: 'home', label: t.tabs.home, icon: Home },
    { id: 'prices', label: t.tabs.prices, icon: TrendingUp },
    { id: 'crops', label: t.tabs.crops, icon: Leaf },
    { id: 'market', label: t.tabs.market, icon: ShoppingBag },
    { id: 'agrobot', label: t.tabs.agrobot, icon: Bot },
    { id: 'profile', label: t.tabs.profile, icon: User },
  ];

  // ── Auth Modal element ───────────────────────────────────────────────────
  const authModalElement = (
    <AuthModal
      isOpen={authModal.isOpen}
      onClose={closeAuth}
      language={language}
      initialMode={authModal.mode}
      onLoginSuccess={handleLoginSuccess}
      onSkip={handleContinueAsGuest}
    />
  );

  // ── Loading state while auth is being resolved ───────────────────────────
  if (authLoading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-[#0F1710]' : 'bg-[#FDF6E9]'} flex items-center justify-center transition-colors`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1B5E20] to-[#2E7D32] dark:from-[#2E7D32] dark:to-[#4ADE80] flex items-center justify-center shadow-lg animate-pulse">
            <Leaf className="w-8 h-8 text-white dark:text-[#052E16]" strokeWidth={2} />
          </div>
          <div className="text-center">
            <div className="text-lg font-black text-[#2C2416] dark:text-[#F0FDF4]">Agrostat</div>
            <div className="text-sm font-semibold text-[#5A4F3F] dark:text-[#94A3B8] mt-1">
              {language === 'HI' ? 'डैशबोर्ड लोड हो रहा है…' : 'Loading your farming dashboard…'}
            </div>
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="w-2 h-2 rounded-full bg-[#2E7D32] dark:bg-[#4ADE80]"
                style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── GATE: Landing page if not logged in ──────────────────────────────────
  if (!user) {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <LandingPage 
          language={language} 
          setLanguage={setLanguage}
          theme={theme}
          setTheme={handleSetTheme}
          onOpenAuth={openAuth} 
          onContinueAsGuest={handleContinueAsGuest} 
        />
        <FloatingAgroBot language={language} theme={theme} />
        {authModalElement}
      </div>
    );
  }

  // ── BUYER DASHBOARD ──────────────────────────────────────────────────────
  if (user.role === 'buyer') {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <BuyerDashboard
          user={user}
          language={language}
          setLanguage={setLanguage}
          theme={theme}
          setTheme={handleSetTheme}
          onLogout={handleLogout}
        />
        <FloatingAgroBot language={language} theme={theme} />
        {authModalElement}
      </div>
    );
  }

  // ── FARMER DASHBOARD ─────────────────────────────────────────────────────
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-[#FDF6E9] dark:bg-[#0F1710] text-[#5A4F3F] dark:text-[#CBD5E1] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col selection:bg-[#2E7D32] selection:text-white transition-colors duration-300">

        <Header
          language={language}
          setLanguage={setLanguage}
          theme={theme}
          setTheme={handleSetTheme}
          user={user}
          onOpenAuth={() => openAuth('login')}
          onGoProfile={() => setActiveTab('profile')}
          onLogout={handleLogout}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-28 lg:pb-12 space-y-7">

          {/* Desktop Tab Navigation */}
          <nav
            aria-label="Dashboard navigation tabs"
            className="hidden lg:flex items-center gap-2 bg-white dark:bg-[#141F15] p-2 rounded-2xl border border-[#F0E6D2] dark:border-[#263828] shadow-sm overflow-x-auto transition-colors"
          >
            {tabsList.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  id={`desktop-tab-${id}`}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-extrabold whitespace-nowrap transition-all duration-150 ${
                    active ? 'tab-nav-active' : 'tab-nav-inactive'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" strokeWidth={2.4} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          {/* Tab Content */}
          <div role="tabpanel" aria-labelledby={`tab-${activeTab}`} key={activeTab} className="space-y-6">
            {activeTab === 'home' && (
              <div className="space-y-6">
                <SensorBanner onSpeakAdvisory={handleSpeakAdvisory} language={language} theme={theme} />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
                  <div onClick={() => setActiveTab('prices')}
                    className="card p-6 cursor-pointer card-hover space-y-3 group">
                    <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] dark:bg-[#1C3320] border border-[#A5D6A7] dark:border-[#2E5E33] flex items-center justify-center text-[#2E7D32] dark:text-[#4ADE80] group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-6 h-6" strokeWidth={2.2} />
                    </div>
                    <h3 className="text-xl font-black text-[#2C2416] dark:text-[#F0FDF4] group-hover:text-[#2E7D32] dark:group-hover:text-[#4ADE80] transition-colors">
                      {language === 'HI' ? 'मंडी भाव व बिक्री सलाह' : 'Check Crop Mandi Rates'}
                    </h3>
                    <p className="text-sm font-medium text-[#5A4F3F] dark:text-[#94A3B8] leading-relaxed">
                      {language === 'HI' 
                        ? '30 दिनों के भाव का अनुमान, तेजी-मंदी के कारक और बेचने का सही समय जानें।'
                        : 'Track 30-day mandi rate projections, volatility drivers & find the peak selling window.'}
                    </p>
                  </div>

                  <div onClick={() => setActiveTab('crops')}
                    className="card p-6 cursor-pointer card-hover space-y-3 group">
                    <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] dark:bg-[#1C3320] border border-[#A5D6A7] dark:border-[#2E5E33] flex items-center justify-center text-[#2E7D32] dark:text-[#4ADE80] group-hover:scale-110 transition-transform">
                      <Leaf className="w-6 h-6" strokeWidth={2.2} />
                    </div>
                    <h3 className="text-xl font-black text-[#2C2416] dark:text-[#F0FDF4] group-hover:text-[#2E7D32] dark:group-hover:text-[#4ADE80] transition-colors">
                      {language === 'HI' ? 'खेत के लिए सर्वश्रेष्ठ फसल' : 'Best Crops for Field'}
                    </h3>
                    <p className="text-sm font-medium text-[#5A4F3F] dark:text-[#94A3B8] leading-relaxed">
                      {language === 'HI'
                        ? 'मिट्टी की किस्म और मौसम अनुसार अधिकतम पैदावार व शुद्ध मुनाफे वाली फसल चुनें।'
                        : 'Match soil texture & season to maximise harvest yield and net profit per acre.'}
                    </p>
                  </div>

                  <div onClick={() => setActiveTab('market')}
                    className="card p-6 cursor-pointer card-hover space-y-3 group">
                    <div className="w-12 h-12 rounded-2xl bg-[#FEF3E2] dark:bg-[#2A2315] border border-[#FCD34D] dark:border-[#4A3D1E] flex items-center justify-center text-[#D97706] dark:text-[#FBBF24] group-hover:scale-110 transition-transform">
                      <ShoppingBag className="w-6 h-6" strokeWidth={2.2} />
                    </div>
                    <h3 className="text-xl font-black text-[#2C2416] dark:text-[#F0FDF4] group-hover:text-[#D97706] dark:group-hover:text-[#FBBF24] transition-colors">
                      {language === 'HI' ? 'सीधा किसान बाज़ार' : 'Farmer Marketplace'}
                    </h3>
                    <p className="text-sm font-medium text-[#5A4F3F] dark:text-[#94A3B8] leading-relaxed">
                      {language === 'HI'
                        ? 'बिना बिचौलिए के सीधे बड़े व्यापारियों, मिलों और प्रसंस्करण कंपनियों को बेचें।'
                        : 'Direct-to-buyer trade with transparent pricing for high-grade harvest produce.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'prices' && <PricePrediction language={language} />}
            {activeTab === 'crops' && <CropRecommendation language={language} />}
            {activeTab === 'market' && <Marketplace language={language} user={user} />}
            {activeTab === 'agrobot' && <AgroBot language={language} />}
            {activeTab === 'profile' && (
              <Profile user={user} onOpenAuth={() => openAuth('login')} language={language} onLogout={handleLogout} />
            )}
          </div>
        </main>

        {/* Floating AgroBot AI Assistant Widget */}
        <FloatingAgroBot language={language} theme={theme} />

        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} language={language} />

        {authModalElement}

        <footer className="mt-auto bg-white dark:bg-[#141F15] border-t border-[#F0E6D2] dark:border-[#263828] py-6 text-sm text-[#8C7B6B] dark:text-[#94A3B8] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-[#2E7D32] dark:text-[#4ADE80]" />
              <span className="font-bold text-[#2C2416] dark:text-[#F0FDF4]">Agrostat Digital Farming Assistant</span>
              <span>© {new Date().getFullYear()}</span>
            </div>
            <p className="text-xs text-[#8C7B6B] dark:text-[#94A3B8]">
              {language === 'HI' 
                ? 'भारतीय किसानों के लिए विश्वसनीय, पारदर्शी एवं आधुनिक कृषि समाधान।'
                : 'Authentic, transparent, and fair agricultural intelligence for every Indian farmer.'}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
