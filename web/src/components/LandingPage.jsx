import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Leaf,
  TrendingUp,
  ShoppingBag,
  CloudSun,
  ArrowRight,
  LogIn,
  UserPlus,
  ShieldCheck,
  Star,
  ChevronRight,
  Cpu,
  Sprout,
  BarChart2,
  Store,
  Radio,
  Users,
  Map,
  Wallet,
  HeadphonesIcon,
  Thermometer,
  Droplets,
  Package,
  Sparkles,
  PhoneCall,
  MessageSquare,
  CheckCircle2,
  Clock,
  Sun,
  Moon,
  Globe
} from 'lucide-react';
import { getTranslation } from '../services/translations.js';

// ─── Reusable fade-in-up animation variant ────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

// ─── Section wrapper with scroll-triggered animation ─────────────────────────
function FadeSection({ children, className = '', delay = 0, id }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.section
      id={id}
      className={className}
      variants={fadeUp}
      custom={delay}
      initial={prefersReduced ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
    >
      {children}
    </motion.section>
  );
}

// ─── Data Arrays ─────────────────────────────────────────────────────────────
const STATS = [
  { icon: Users, value: '50,000+', labelEn: 'Registered Farmers', labelHi: 'पंजीकृत किसान', color: 'text-primary-green', bg: 'bg-primary-light' },
  { icon: Store, value: '500+', labelEn: 'APMC Mandis Live', labelHi: 'लाइव APMC मंडियां', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  { icon: Sparkles, value: '98%', labelEn: 'AI Advisory Accuracy', labelHi: 'एआई सलाह सटीकता', color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-950/30' },
  { icon: Wallet, value: '₹12.5 Cr+', labelEn: 'Direct Trade Volume', labelHi: 'सीधा व्यापार मूल्य', color: 'text-primary-green', bg: 'bg-primary-light' },
];

const FEATURES = [
  {
    icon: TrendingUp,
    color: 'text-primary-green bg-primary-light border-primary-light',
    titleEn: '30-Day Mandi Forecast',
    titleHi: '30-दिवसीय मंडी भाव अनुमान',
    descEn: 'ML models analyze 500+ APMC mandis daily to predict price peaks so you sell at maximum profit.',
    descHi: '500+ मंडियों के डेटा पर आधारित एआई मॉडल आपको बताते हैं कि कब फसल बेचने पर अधिकतम भाव मिलेगा।',
    tag: 'ML-Powered',
  },
  {
    icon: Sprout,
    color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900',
    titleEn: 'Personalised Crop Advice',
    titleHi: 'व्यक्तिगत फसल सिफारिश',
    descEn: 'Get custom crop suggestions matched to your soil type, season, rainfall, and state geography.',
    descHi: 'अपनी मिट्टी की किस्म, मौसम और राज्य अनुसार सर्वाधिक पैदावार देने वाली लाभकारी फसलें चुनें।',
    tag: 'Agronomy AI',
  },
  {
    icon: Radio,
    color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-900',
    titleEn: 'Real-Time Sensor Alerts',
    titleHi: 'लाइव IoT खेत सेंसर चेतावनी',
    descEn: 'Live field temperature, humidity, and soil moisture telemetry with automated voice advisories.',
    descHi: 'खेत के तापमान, नमी और मिट्टी की स्थिति पर 24/7 नज़र रखें और समय पर सिंचाई अलर्ट प्राप्त करें।',
    tag: 'IoT Telemetry',
  },
  {
    icon: Store,
    color: 'text-primary-green bg-primary-light border-primary-light',
    titleEn: 'Zero-Middleman Market',
    titleHi: 'बिना दलाल सीधा किसान बाज़ार',
    descEn: 'List your harvest directly to verified institutional buyers, mills, and food companies across India.',
    descHi: 'बिना बिचौलियों के सीधे बड़े व्यापारियों व मिलों को अपनी उपज बेचें और पूरा लाभ सीधे पाएं।',
    tag: 'Direct Trade',
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    icon: Cpu,
    badgeColor: 'bg-primary-light text-primary-green border-primary-light',
    titleEn: 'Setup Your Farm Profile',
    titleHi: 'खेत का विवरण दर्ज करें',
    descEn: 'Select your state, district, and soil type in under 2 minutes. Instant calibration for your microclimate.',
    descHi: 'मात्र 2 मिनट में अपना राज्य, ज़िला और मिट्टी की किस्म चुनें। आपकी स्थानीय जलवायु अनुसार तुरंत तैयार।',
    highlightEn: 'Takes < 2 Minutes',
    highlightHi: '2 मिनट से भी कम समय',
  },
  {
    step: '02',
    icon: Sparkles,
    badgeColor: 'bg-amber-50 dark:bg-amber-950/30 text-amber-500 border-amber-200 dark:border-amber-900',
    titleEn: 'Receive AI Action Plans',
    titleHi: 'दैनिक एआई परामर्श पाएं',
    descEn: 'Get real-time alerts on disease risk, spray windows, price swings, and optimal harvesting dates.',
    descHi: 'कीट रोग चेतावनी, दवा छिड़काव का सही समय और मंडी भाव में तेजी-मंदी की दैनिक सूचना पाएं।',
    highlightEn: 'Daily Voice Alerts',
    highlightHi: 'दैनिक वॉयस अलर्ट',
  },
  {
    step: '03',
    icon: ShoppingBag,
    badgeColor: 'bg-sky-50 dark:bg-sky-950/30 text-sky-500 border-sky-200 dark:border-sky-900',
    titleEn: 'Sell at Peak Mandi Rates',
    titleHi: 'उच्चतम भाव पर उपज बेचें',
    descEn: 'Track the 30-day projection curve and connect with verified buyers when wholesale prices peak.',
    descHi: 'मूल्य वक्र का अनुसरण करें और अधिकतम भाव आने पर सीधे सत्यापित खरीदारों को बेचें।',
    highlightEn: 'Zero Commission',
    highlightHi: 'शून्य कमीशन',
  },
];

const MARKET_TICKER = [
  { crop: 'Wheat (गेहूं)', mandi: 'Khanna, Punjab', price: '₹2,450/q', change: '+4.8%', up: true },
  { crop: 'Paddy Basmati (धान)', mandi: 'Karnal, Haryana', price: '₹3,820/q', change: '+2.1%', up: true },
  { crop: 'Mustard (सरसों)', mandi: 'Bharatpur, Rajasthan', price: '₹5,600/q', change: '-0.8%', up: false },
  { crop: 'Cotton (कपास)', mandi: 'Rajkot, Gujarat', price: '₹7,150/q', change: '+3.4%', up: true },
  { crop: 'Soybean (सोयाबीन)', mandi: 'Indore, MP', price: '₹4,380/q', change: '+1.5%', up: true },
];

const TESTIMONIALS = [
  {
    name: 'Gurmail Singh',
    location: 'Ludhiana, Punjab',
    crop: 'Wheat & Paddy · 18 Acres',
    initials: 'GS',
    textEn: 'Agrostat price forecast advised holding wheat for 12 days. I gained ₹180 more per quintal on 350 quintals!',
    textHi: 'एग्रोस्टेट ने गेहूं 12 दिन रोककर बेचने की सलाह दी। मुझे 350 क्विंटल पर प्रति क्विंटल ₹180 का अतिरिक्त मुनाफा हुआ!',
    stars: 5,
  },
  {
    name: 'Rameshwar Patel',
    location: 'Hoshangabad, MP',
    crop: 'Soybean & Gram · 12 Acres',
    initials: 'RP',
    textEn: 'Soil-based fertilizer recommendations cut my urea cost by 30% while increasing overall pod yield.',
    textHi: 'मिट्टी अनुसार खाद की सलाह से यूरिया का खर्च 30% कम हुआ और पैदावार भी बहुत अच्छी मिली।',
    stars: 5,
  },
  {
    name: 'Suresh Choudhary',
    location: 'Nagaur, Rajasthan',
    crop: 'Mustard & Moong · 8 Acres',
    initials: 'SC',
    textEn: 'Direct marketplace let me sell mustard directly to an oil mill without paying the local mandi commission.',
    textHi: 'सीधे बाज़ार की वजह से मैं बिना किसी आढ़त/कमीशन के सीधे तेल मिल को सरसों बेच पाया।',
    stars: 5,
  },
];

const NAV_LINKS = [
  { labelEn: 'Features', labelHi: 'विशेषताएं', href: '#features' },
  { labelEn: 'How It Works', labelHi: 'कैसे काम करता है', href: '#how-it-works' },
  { labelEn: 'Live Mandi', labelHi: 'मंडी भाव', href: '#marketplace' },
  { labelEn: 'Farmers', labelHi: 'किसान अनुभव', href: '#testimonials' },
  { labelEn: 'Helpline', labelHi: 'हेल्पलाइन', href: '#contact' },
];

// ─── Interactive Phone Frame Preview Component ────────────────────────────────
function AppPreviewMockup() {
  return (
    <div className="relative w-full max-w-sm mx-auto select-none">
      
      {/* Floating Badge 1: AI Powered (Top-Left) */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="absolute -top-3 -left-2 sm:-left-6 z-20"
      >
        <div className="bg-card/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-primary-light flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-primary-light flex items-center justify-center text-primary-green shrink-0">
            <Sparkles className="w-3 h-3" />
          </div>
          <span className="text-[11px] font-black text-primary-green">AI Powered</span>
          <span className="text-[10px] font-bold text-muted border-l border-border-card pl-1.5">98% Accuracy</span>
        </div>
      </motion.div>

      {/* Floating Badge 2: Farmer Rating (Top-Right) */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="absolute -top-3 -right-2 sm:-right-6 z-20"
      >
        <div className="bg-card/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-amber-200 dark:border-amber-900 flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-500 shrink-0">
            <Star className="w-3 h-3 fill-amber-500" />
          </div>
          <span className="text-[11px] font-black text-main">4.8★ Rating</span>
          <span className="text-[10px] font-bold text-muted border-l border-border-card pl-1.5">50k+ Farmers</span>
        </div>
      </motion.div>

      {/* Floating Badge 3: Weather Chip */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="absolute top-20 -right-3 sm:-right-8 z-20"
      >
        <div className="bg-card/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-lg border border-sky-200 dark:border-sky-900 flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center">
            <CloudSun className="w-4 h-4 text-sky-500" />
          </div>
          <div>
            <div className="text-[10px] font-black text-main">28.5°C · Optimal</div>
            <div className="text-[9px] text-sky-500 font-bold">Spray Window: Open ✓</div>
          </div>
        </div>
      </motion.div>

      {/* Phone Frame */}
      <div className="relative z-10">
        <div className="w-64 sm:w-72 mx-auto bg-card rounded-[2.5rem] shadow-2xl border-4 border-border-card overflow-hidden">
          {/* Status bar */}
          <div className="bg-[#1B5E20] px-5 pt-4 pb-2.5 text-white text-xs flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-[#4ADE80]" />
              <span className="font-black text-xs tracking-wide">Agrostat</span>
            </div>
            <span className="opacity-80 text-[10px] font-semibold">9:41 AM</span>
          </div>

          {/* Hero greeting strip */}
          <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-4 py-3 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] opacity-80 font-medium">Namaste,</p>
                <p className="font-black text-sm">Gurmail Singh 🌾</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-bold">Punjab</span>
            </div>
            <p className="text-[10px] opacity-90 text-emerald-200 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
              Sensor Active · Normal Condition
            </p>
          </div>

          {/* Sensor cards strip */}
          <div className="bg-canvas px-3 py-2.5 grid grid-cols-2 gap-2">
            <div className="bg-card rounded-xl p-2.5 border border-border-card shadow-xs">
              <div className="flex items-center gap-1 mb-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[9px] font-bold text-muted">Field Temp</span>
              </div>
              <span className="text-sm font-black text-main">28.5°C</span>
            </div>
            <div className="bg-card rounded-xl p-2.5 border border-border-card shadow-xs">
              <div className="flex items-center gap-1 mb-1">
                <Droplets className="w-3.5 h-3.5 text-sky-500" />
                <span className="text-[9px] font-bold text-muted">Moisture</span>
              </div>
              <span className="text-sm font-black text-main">74%</span>
            </div>
          </div>

          {/* Price chart strip */}
          <div className="bg-card px-3 py-2.5 mx-3 my-2 rounded-xl border border-border-card shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-primary-green" />
                <span className="text-[10px] font-black text-main">Wheat Mandi Forecast</span>
              </div>
              <span className="text-[9px] font-black text-primary-green bg-primary-light px-1.5 py-0.5 rounded-md">+4.8% ↑</span>
            </div>
            <svg viewBox="0 0 100 30" className="w-full h-8" preserveAspectRatio="none">
              <path d="M0,20 C10,18 20,22 30,16 C40,10 50,14 60,8 C70,2 80,6 100,4" fill="none" stroke="#22C55E" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            <div className="flex items-center justify-between mt-1 text-[9px]">
              <span className="text-muted">Today: <strong className="text-main">₹2,450</strong></span>
              <span className="text-amber-500 font-black">Peak: ₹2,680</span>
            </div>
          </div>

          {/* Quick AI advice strip */}
          <div className="mx-3 mb-2 px-2.5 py-1.5 bg-primary-light rounded-lg border border-primary-light flex items-center gap-2 text-[9px] text-primary-green font-bold">
            <Sparkles className="w-3 h-3 shrink-0 text-primary-green" />
            <span>AI Advice: Hold wheat until price peak</span>
          </div>

          {/* Bottom tab strip */}
          <div className="bg-card border-t border-border-card px-3 py-2 flex items-center justify-around">
            {[
              { icon: Sprout, label: 'Home', active: true },
              { icon: BarChart2, label: 'Prices', active: false },
              { icon: Store, label: 'Market', active: false },
            ].map(({ icon: Icon, label, active }) => (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <Icon className={`w-4 h-4 ${active ? 'text-primary-green' : 'text-muted'}`} strokeWidth={2.2} />
                <span className={`text-[8px] font-bold ${active ? 'text-primary-green' : 'text-muted'}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Landing Page Component ──────────────────────────────────────────────
export default function LandingPage({ 
  onOpenAuth, 
  onContinueAsGuest, 
  language = 'EN', 
  setLanguage, 
  theme = 'light', 
  setTheme 
}) {
  const isHi = language === 'HI';
  const [scrolled, setScrolled] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    if (setTheme) setTheme(next);
  };

  const toggleLanguage = () => {
    const next = language === 'EN' ? 'HI' : 'EN';
    if (setLanguage) setLanguage(next);
  };

  return (
    <div className="min-h-screen bg-canvas text-body font-['Plus_Jakarta_Sans',sans-serif] flex flex-col selection:bg-leaf selection:text-white transition-colors duration-300">

      {/* ─── Sticky Landing Header ─────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${
          scrolled 
            ? 'bg-card/95 backdrop-blur-md shadow-sm border-b border-border-card' 
            : 'bg-canvas/90 backdrop-blur-sm border-b border-border-card/60'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] flex items-center justify-center shadow-md">
              <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black text-main tracking-tight">Agrostat</span>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {NAV_LINKS.map(({ labelEn, labelHi, href }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                className="px-3.5 py-1.5 rounded-xl text-sm font-bold text-muted hover:text-primary-green hover:bg-primary-light transition-all duration-150"
              >
                {isHi ? labelHi : labelEn}
              </a>
            ))}
          </nav>

          {/* Action buttons + Unified Theme & Language Switches */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-card hover:bg-subtle text-main border border-border-card text-xs font-bold transition-colors shadow-2xs cursor-pointer"
              title="Change Language (English / हिन्दी)"
            >
              <Globe className="w-3.5 h-3.5 text-primary-green" />
              <span>{isHi ? 'हिन्दी' : 'EN'}</span>
            </button>

            {/* Unified Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-card hover:bg-subtle text-main border border-border-card transition-colors shadow-2xs cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#5A4F3F]" />
              )}
            </button>

            {/* Login & Register */}
            <button
              onClick={() => onOpenAuth('login')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold text-main hover:bg-subtle transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{isHi ? 'लॉगिन' : 'Login'}</span>
            </button>

            <button
              onClick={() => onOpenAuth('signup')}
              className="btn-primary px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-bold shrink-0 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isHi ? 'पंजीकरण' : 'Get Started'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* ─── Hero Section ────────────────────────────────────────────────────── */}
      <section id="hero" className="relative overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-14 sm:pb-20">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">

            {/* Left Column: Copy & Actions */}
            <div className="flex-[1.15] text-center lg:text-left space-y-6">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-light border border-primary-light text-xs font-black text-primary-green shadow-xs">
                <span className="w-2 h-2 rounded-full bg-primary-green animate-pulse" />
                {isHi ? '50,000+ भारतीय किसानों का भरोसेमंद साथी' : 'Trusted by 50,000+ Indian Farmers'}
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] xl:text-[3.2rem] font-black text-main leading-[1.18] tracking-tight">
                <span className="block">
                  {isHi ? 'आपका ' : 'Your '}
                  <span className="text-primary-green">{isHi ? 'डिजिटल कृषि' : 'Digital Farming'}</span>
                  {isHi ? ' सहायक' : ' Assistant'}
                </span>
                <span className="block mt-1 sm:mt-2">
                  {isHi ? 'अधिक उपज और ' : 'for '}
                  <span className="relative inline-block text-amber-500">
                    {isHi ? 'सर्वोत्तम मुनाफे हेतु' : 'Smarter Harvests'}
                  </span>
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg font-semibold text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {isHi
                  ? '30-दिवसीय एआई फसल भाव पूर्वानुमान, मिट्टी अनुसार फसल सलाह, लाइव IoT सेंसर अलर्ट और बिना बिचौलियों का सीधा बाज़ार — सब कुछ एक सरल ऐप में।'
                  : 'Get AI-powered crop price predictions, personalised soil-based crop advice, real-time field sensor data, and a direct marketplace — all in one app.'}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
                <button
                  id="landing-cta-getstarted"
                  onClick={() => onOpenAuth('signup')}
                  className="btn-primary px-7 py-3.5 text-base font-black shadow-lg w-full sm:w-auto cursor-pointer"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>{isHi ? 'किसान पंजीकरण — 100% मुफ़्त' : 'Register as Farmer — Free'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  id="landing-cta-login"
                  onClick={() => onOpenAuth('login')}
                  className="btn-outline px-7 py-3.5 text-base font-black w-full sm:w-auto cursor-pointer"
                >
                  <LogIn className="w-5 h-5" />
                  <span>{isHi ? 'पहले से पंजीकृत हैं? लॉगिन' : 'Already registered? Login'}</span>
                </button>
              </div>

              {/* Skip to guest */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-muted">
                <button
                  id="landing-skip-guest"
                  onClick={onContinueAsGuest}
                  className="text-sm font-bold text-muted hover:text-primary-green underline underline-offset-2 transition-colors cursor-pointer"
                >
                  {isHi ? 'गेस्ट के रूप में जारी रखें — ऐप एक्सप्लोर करें →' : 'Continue as Guest — Explore the App →'}
                </button>
              </div>

              {/* Trust Badges Row */}
              <div className="pt-3 border-t border-border-card flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs font-bold text-muted">
                <span className="flex items-center gap-1.5 text-primary-green">
                  <CheckCircle2 className="w-4 h-4" /> {isHi ? 'किसानों के लिए मुफ़्त' : '100% Free for Farmers'}
                </span>
                <span className="flex items-center gap-1.5 text-amber-500">
                  <ShieldCheck className="w-4 h-4" /> {isHi ? 'PM-KISAN सहायता' : 'PM-KISAN Aligned'}
                </span>
                <span className="flex items-center gap-1.5 text-sky-500">
                  <Radio className="w-4 h-4" /> {isHi ? '500+ मंडियां लाइव' : '500+ Mandis Live'}
                </span>
              </div>

            </div>

            {/* Right Column: App Preview Mockup */}
            <div className="flex-1 w-full max-w-sm sm:max-w-md lg:max-w-none flex justify-center lg:justify-end">
              <AppPreviewMockup />
            </div>

          </div>
        </div>
      </section>

      {/* ─── Stats / Trust Strip ───────────────────────────────────────────── */}
      <FadeSection className="bg-card/80 backdrop-blur-sm border-y border-border-card py-8 sm:py-10 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {STATS.map(({ icon: Icon, value, labelEn, labelHi, color, bg }) => (
              <div
                key={labelEn}
                className="bg-subtle rounded-2xl p-5 text-center border border-border-card shadow-xs space-y-2 cursor-default"
              >
                <div className={`w-11 h-11 rounded-2xl ${bg} flex items-center justify-center mx-auto shadow-xs`}>
                  <Icon className={`w-5 h-5 ${color}`} strokeWidth={2.2} />
                </div>
                <div className={`text-2xl sm:text-3xl font-black ${color} leading-none`}>{value}</div>
                <div className="text-xs font-bold text-body">{isHi ? labelHi : labelEn}</div>
              </div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* ─── Feature Highlights ────────────────────────────────────────────── */}
      <FadeSection id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20" delay={0.05}>
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light border border-primary-light text-xs font-black text-primary-green">
            <Sprout className="w-3.5 h-3.5" /> {isHi ? 'स्मार्ट डिजिटल कृषि मंच' : 'Smart Agriculture Platform'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-main tracking-tight">
            {isHi ? 'हर किसान की आवश्यकता, एक ही स्थान पर' : 'Everything a Farmer Needs, In One App'}
          </h2>
          <p className="text-sm sm:text-base font-semibold text-muted max-w-xl mx-auto">
            {isHi 
              ? 'बुवाई से लेकर बिक्री तक — एग्रोस्टेट प्रमाणित APMC मंडी डेटा और एआई मॉडल द्वारा आपकी खेती को सुरक्षित बनाता है।'
              : 'From sowing to selling — Agrostat covers the full farming lifecycle with verified APMC mandi data and AI models.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon: Icon, color, titleEn, titleHi, descEn, descHi, tag }, i) => (
            <div
              key={titleEn}
              className="card p-6 space-y-3.5 cursor-default flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl border ${color} flex items-center justify-center shadow-xs`}>
                    <Icon className="w-6 h-6" strokeWidth={2.2} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-subtle border border-border-subtle text-muted">
                    {tag}
                  </span>
                </div>
                <h3 className="text-lg font-black text-main leading-snug">{isHi ? titleHi : titleEn}</h3>
                <p className="text-sm font-medium text-body leading-relaxed">{isHi ? descHi : descEn}</p>
              </div>
              <div className="pt-2 border-t border-border-card flex items-center text-xs font-bold text-primary-green">
                <span>{isHi ? 'विवरण देखें' : 'Explore Feature'}</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </div>
            </div>
          ))}
        </div>
      </FadeSection>

      {/* ─── How It Works Section ──────────────────────────────────────────── */}
      <FadeSection id="how-it-works" className="bg-subtle border-y border-border-subtle py-16 sm:py-20" delay={0.05}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs font-black text-amber-500">
              <Clock className="w-3.5 h-3.5" /> {isHi ? 'सरल 3-चरणीय प्रक्रिया' : 'Simple 3-Step Process'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-main tracking-tight">
              {isHi ? 'एग्रोस्टेट आपकी खेती को कैसे सशक्त बनाता है' : 'How Agrostat Empowers Your Farm'}
            </h2>
            <p className="text-sm sm:text-base font-semibold text-muted max-w-xl mx-auto">
              {isHi 
                ? 'अनुमान लगाने के बजाय वैज्ञानिक आंकड़ों और एआई की सहायता से प्रति एकड़ मुनाफा बढ़ाएं।'
                : 'Follow three simple steps to eliminate guesswork, protect your harvest, and maximize your profit per acre.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {HOW_IT_WORKS_STEPS.map(({ step, icon: Icon, badgeColor, titleEn, titleHi, descEn, descHi, highlightEn, highlightHi }) => (
              <div
                key={step}
                className="bg-card rounded-2xl p-7 border border-border-card shadow-sm flex flex-col justify-between space-y-5 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl border ${badgeColor} flex items-center justify-center shadow-xs`}>
                    <Icon className="w-6 h-6" strokeWidth={2.2} />
                  </div>
                  <span className="text-2xl font-black text-muted select-none">
                    {step}
                  </span>
                </div>

                <div className="space-y-2.5">
                  <h3 className="text-lg font-black text-main">{isHi ? titleHi : titleEn}</h3>
                  <p className="text-sm font-medium text-body leading-relaxed">{isHi ? descHi : descEn}</p>
                </div>

                <div className="pt-3 border-t border-border-card flex items-center gap-1.5 text-xs font-bold text-primary-green">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{isHi ? highlightHi : highlightEn}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => onOpenAuth('signup')}
              className="btn-primary px-6 py-3 text-sm font-black shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isHi ? '2 मिनट में शुरुआत करें' : 'Get Started in 2 Minutes'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </FadeSection>

      {/* ─── Marketplace Highlight Section ─────────────────────────────────── */}
      <FadeSection id="marketplace" className="bg-card border-b border-border-card py-16 sm:py-20" delay={0.05}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-12">
            <div className="space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900 text-xs font-black text-sky-500">
                <ShoppingBag className="w-3.5 h-3.5" /> {isHi ? 'किसान डायरेक्ट मंडी बाज़ार' : 'Direct Farmer Marketplace'}
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-main tracking-tight">
                {isHi ? 'उचित मंडी भाव पर सीधी बिक्री करें' : 'Sell Directly at Fair Mandi Rates'}
              </h2>
              <p className="text-sm sm:text-base font-semibold text-muted max-w-xl">
                {isHi
                  ? 'दलालों और कटौतियों से मुक्ति पाएं। पूरे भारत के प्रमाणित खरीदारों, राइस मिलों और थोक व्यापारियों से सीधे जुड़ें।'
                  : 'Skip agents and commissions. Connect directly with certified institutional buyers, flour mills, and food processors across India.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenAuth('signup')}
                className="btn-gold px-5 py-2.5 text-sm font-black flex items-center gap-2 cursor-pointer"
              >
                <Store className="w-4 h-4" />
                <span>{isHi ? 'अपनी उपज लिस्ट करें' : 'List Your Produce'}</span>
              </button>
              <button
                onClick={onContinueAsGuest}
                className="btn-outline px-5 py-2.5 text-sm font-black flex items-center gap-2 cursor-pointer"
              >
                <span>{isHi ? 'लाइव बोलियां देखें' : 'Browse Live Bids'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Live Mandi Ticker Strip */}
          <div className="bg-subtle rounded-2xl p-5 border border-border-card shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-muted">
              <span className="flex items-center gap-1.5 text-main font-black">
                <Radio className="w-3.5 h-3.5 text-primary-green animate-pulse" /> {isHi ? 'आज के प्रमुख लाइव मंडी भाव' : 'Live Mandi Rates Today'}
              </span>
              <span className="text-[11px]">{isHi ? '15 मिनट पूर्व अपडेट · 500+ APMC मंडियां' : 'Updated 15 mins ago · 500+ APMC Mandis'}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {MARKET_TICKER.map(({ crop, mandi, price, change, up }) => (
                <div key={crop} className="bg-card rounded-xl p-3 border border-border-subtle shadow-2xs">
                  <div className="text-xs font-black text-main truncate">{crop}</div>
                  <div className="text-[10px] text-muted font-semibold">{mandi}</div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-black text-main">{price}</span>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${up ? 'bg-primary-light text-primary-green' : 'bg-red-50 dark:bg-red-950/40 text-red-600'}`}>
                      {change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </FadeSection>

      {/* ─── Testimonials ──────────────────────────────────────────────────── */}
      <FadeSection id="testimonials" className="bg-canvas py-16 sm:py-20" delay={0.05}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs font-black text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-500" /> {isHi ? 'प्रमाणित किसान अनुभव' : 'Verified Farmer Stories'}
            </div>
            <h2 className="text-3xl font-black text-main tracking-tight">
              {isHi ? 'सच्चे किसान, वास्तविक लाभ' : 'Real Farmers, Real Results'}
            </h2>
            <p className="text-sm font-semibold text-muted max-w-md mx-auto">
              {isHi 
                ? 'जानिए कैसे एग्रोस्टेट ने किसानों की मौसमी आय में वृद्धि की।'
                : 'Hear from farmers who transformed their seasonal income with Agrostat AI insights.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, location, crop, initials, textEn, textHi, stars }) => (
              <div
                key={name}
                className="bg-card rounded-2xl p-6 border border-border-card shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex gap-1">
                    {Array.from({ length: stars }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-main leading-relaxed">
                    "{isHi ? textHi : textEn}"
                  </p>
                </div>
                
                <div className="flex items-center gap-3 pt-3 border-t border-border-card">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white text-xs font-black flex items-center justify-center shrink-0 shadow-xs">
                    {initials}
                  </div>
                  <div>
                    <div className="text-xs font-black text-main">{name}</div>
                    <div className="text-[11px] font-semibold text-muted">{location}</div>
                    <div className="text-[10px] font-bold text-primary-green">{crop}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* ─── Bottom CTA Banner ───────────────────────────────────────────────── */}
      <FadeSection className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20" delay={0.05}>
        <div className="bg-gradient-to-br from-[#1B5E20] via-[#246B28] to-[#2E7D32] rounded-3xl p-10 sm:p-14 shadow-xl relative overflow-hidden text-center border border-white/10">
          <div className="relative z-10 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 text-xs font-black text-white mb-1 backdrop-blur-xs">
              <ShieldCheck className="w-4 h-4" /> {isHi ? 'PM-KISAN से मान्यता प्राप्त तकनीक' : 'PM-KISAN Aligned Technology'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">
              {isHi ? 'आज ही स्मार्ट खेती की शुरुआत करें' : 'Start Growing Smarter Today'}
            </h2>
            <p className="text-sm sm:text-base text-white/80 font-semibold max-w-md mx-auto leading-relaxed">
              {isHi
                ? '50,000+ किसानों से जुड़ें जो बेहतर पैदावार और उचित मूल्य के लिए एग्रोस्टेट का उपयोग कर रहे हैं।'
                : 'Join 50,000+ farmers already using Agrostat to boost yields, reduce risk, and sell at better prices.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => onOpenAuth('signup')}
                className="flex items-center justify-center gap-2 bg-[#E8A93B] hover:bg-[#D97706] text-white px-7 py-3.5 rounded-2xl text-base font-black transition-colors shadow-md hover:shadow-lg w-full sm:w-auto cursor-pointer"
              >
                <UserPlus className="w-5 h-5" />
                <span>{isHi ? 'मुफ़्त पंजीकरण करें' : 'Register for Free'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={onContinueAsGuest}
                className="text-sm font-bold text-white/80 hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                {isHi ? 'गेस्ट के रूप में देखें' : 'Explore as Guest'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </FadeSection>

      {/* ─── Contact & Farmer Support Strip ─────────────────────────────────── */}
      <FadeSection id="contact" className="bg-card border-t border-border-card pt-14 pb-8" delay={0.05}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-10 text-center space-y-2">
            <h3 className="text-2xl font-black text-main tracking-tight">
              {isHi ? 'किसान सेवा व 24/7 सहायता' : 'Kisan Support & Farmer Helpline'}
            </h3>
            <p className="text-sm font-semibold text-muted max-w-md mx-auto">
              {isHi 
                ? 'हमारे कृषि विशेषज्ञ और एआई सहायक आपके सवालों के लिए सदैव उपलब्ध हैं।'
                : 'Our agriculture experts and advisory officers are available round-the-clock.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            {/* Helpline Card */}
            <div className="bg-subtle rounded-2xl p-5 border border-border-card flex items-center gap-4 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary-green flex items-center justify-center shrink-0">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-muted">{isHi ? 'टोल-फ्री हेल्पलाइन' : 'Toll-Free Helpline'}</div>
                <div className="text-base font-black text-main">1800-AGRO-STAT</div>
                <div className="text-[11px] text-primary-green font-semibold">{isHi ? 'प्रातः 8 से रात्रि 8 बजे तक' : '8 AM – 8 PM · 6 Languages'}</div>
              </div>
            </div>

            {/* WhatsApp Advisory Card */}
            <div className="bg-subtle rounded-2xl p-5 border border-border-card flex items-center gap-4 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-500 flex items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-muted">{isHi ? 'व्हाट्सएप कृषि सलाह' : 'WhatsApp Crop Advisory'}</div>
                <div className="text-base font-black text-main">+91 98765 43210</div>
                <div className="text-[11px] text-amber-500 font-semibold">{isHi ? 'त्वरित एआई रोग व फसल गाइड' : 'Instant AI Pest & Crop Advice'}</div>
              </div>
            </div>

            {/* Nationwide Mandi Hubs */}
            <div className="bg-subtle rounded-2xl p-5 border border-border-card flex items-center gap-4 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/30 text-sky-500 flex items-center justify-center shrink-0">
                <Map className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-muted">{isHi ? 'मंडी नेटवर्क' : 'Mandi Network'}</div>
                <div className="text-base font-black text-main">{isHi ? '500+ अधिकृत मंडियां' : '500+ Mandi Centers'}</div>
                <div className="text-[11px] text-sky-500 font-semibold">{isHi ? '28 भारतीय राज्यों में सक्रिय' : 'Active in 28 Indian States'}</div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Line */}
          <div className="pt-8 border-t border-border-card flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] flex items-center justify-center shadow-xs">
                <Leaf className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-sm font-black text-main">Agrostat</div>
                <div className="text-[10px] text-muted font-semibold">Your Digital Farming Assistant</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold text-muted">
              {NAV_LINKS.map(({ labelEn, labelHi, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className="hover:text-primary-green transition-colors"
                >
                  {isHi ? labelHi : labelEn}
                </a>
              ))}
            </div>

            <p className="text-[11px] text-muted">
              © {new Date().getFullYear()} Agrostat · Built for Indian Farmers 🌾
            </p>
          </div>

        </div>
      </FadeSection>

    </div>
  );
}
