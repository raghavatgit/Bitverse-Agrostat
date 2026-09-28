import React, { useState, useRef, useEffect } from 'react';
import { Leaf, Globe, LogIn, ChevronDown, User, LogOut, Sun, Moon, ShieldCheck, Sparkles } from 'lucide-react';
import { getTranslation } from '../services/translations.js';

/**
 * Top Header Navigation with Theme Switcher & Bilingual Support
 */
export default function Header({ 
  language = 'EN', 
  setLanguage, 
  theme = 'light', 
  setTheme, 
  user, 
  onOpenAuth, 
  onGoProfile, 
  onLogout 
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const t = getTranslation(language);
  const isHi = language === 'HI';

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  const displayName = user?.isGuest
    ? (isHi ? 'गेस्ट किसान' : 'Guest Farmer')
    : (user?.name || (isHi ? 'किसान' : 'Farmer'));

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border-card shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">

        {/* ── Logo & Branding ──────────────────────────────────────────────── */}
        <div 
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Agrostat Home"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#1B5E20] to-[#2E7D32] flex items-center justify-center shadow-md group-hover:scale-105 group-hover:shadow-lg transition-all shrink-0">
            <Leaf className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black text-main tracking-tight leading-none transition-colors">
                Agro<span className="text-[#2E7D32] dark:text-[#4ADE80]">stat</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-light text-primary-green border border-primary-light text-[10px] font-black tracking-wider uppercase">
                <span className="live-dot" />
                {t.liveAi}
              </span>
            </div>
            <p className="text-xs font-semibold text-muted mt-0.5 hidden md:block transition-colors">
              {t.brandTagline}
            </p>
          </div>
        </div>

        {/* ── Right Actions: Theme Toggle + Language Switcher + User Profile ─── */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {/* Theme Switcher Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t.lightMode : t.darkMode}
            title={theme === 'dark' ? t.lightMode : t.darkMode}
            className="w-10 h-10 rounded-xl bg-subtle border border-border-subtle flex items-center justify-center text-main hover:text-primary-green hover:scale-105 transition-all shadow-xs cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" strokeWidth={2.2} />
            ) : (
              <Moon className="w-5 h-5 text-[#5A4F3F]" strokeWidth={2.2} />
            )}
          </button>
          
          {/* Floating High-Visibility Language Switcher */}
          <div className="flex items-center bg-subtle border border-border-subtle rounded-xl p-1 shadow-inner transition-colors">
            <Globe className="w-3.5 h-3.5 text-muted ml-1.5 mr-1 hidden xs:block" />
            {[
              { code: 'EN', label: 'English', short: 'EN' },
              { code: 'HI', label: 'हिन्दी', short: 'हिन्दी' }
            ].map(({ code, label, short }) => {
              const active = language === code;
              return (
                <button
                  key={code}
                  onClick={() => setLanguage(code)}
                  aria-label={`Switch language to ${label}`}
                  aria-pressed={active}
                  className={`px-2.5 sm:px-3.5 py-1 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-card text-main border border-border-subtle shadow-sm'
                      : 'text-muted hover:text-main hover:bg-canvas'
                  }`}
                >
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{short}</span>
                </button>
              );
            })}
          </div>

          {/* User Profile Chip / Login Button */}
          {user ? (
            <div className="relative" ref={menuRef}>
              {/* Profile Chip Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(prev => !prev);
                }}
                className="inline-flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-card border border-border-subtle hover:bg-subtle hover:shadow-md transition-all shadow-sm cursor-pointer group"
                title="Farmer profile & account options"
                aria-label="Farmer profile & account options"
                aria-expanded={menuOpen}
              >
                {/* Farmer avatar with initial */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#1B5E20] to-[#2E7D32] flex items-center justify-center text-white text-xs sm:text-sm font-black shadow-xs shrink-0">
                  {user?.isGuest ? 'G' : (user.name ? user.name[0].toUpperCase() : '🌾')}
                </div>

                {/* Farmer name & role */}
                <div className="text-left hidden sm:block">
                  <div className="text-xs sm:text-sm font-bold text-main leading-tight flex items-center gap-1.5">
                    <span className="truncate max-w-[130px]">{displayName}</span>
                    {user.isGuest ? (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                        GUEST
                      </span>
                    ) : (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-primary-light text-primary-green uppercase tracking-wider">
                        {user.role === 'buyer' ? 'BUYER' : 'FARMER'}
                      </span>
                    )}
                  </div>
                </div>

                <ChevronDown 
                  className={`w-3.5 h-3.5 text-muted transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Profile Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-card rounded-2xl shadow-2xl border border-border-card py-2 z-50 animate-fade-up">
                  {/* Account Header */}
                  <div className="px-4 py-3 border-b border-border-subtle">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-muted uppercase tracking-wider">
                        {user.isGuest ? (isHi ? 'गेस्ट सत्र' : 'Guest Session') : (isHi ? 'लॉगिन खाता' : 'Signed In')}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary-green">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-green" /> {isHi ? 'सक्रिय' : 'Active'}
                      </span>
                    </div>
                    <p className="text-sm font-black text-main truncate mt-1">
                      {displayName}
                    </p>
                    <p className="text-xs font-medium text-muted truncate">
                      {user.isGuest 
                        ? (isHi ? 'डेमो किसान मोड सक्रिय' : 'Full Demo Access')
                        : (user.email || user.phone || 'Verified Account')}
                    </p>
                  </div>

                  {/* Navigation Links */}
                  <div className="py-1 border-b border-border-subtle">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onGoProfile();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-main hover:bg-subtle flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-primary-green" />
                      <span>{isHi ? 'किसान प्रोफ़ाइल व खेत रिकॉर्ड' : 'Farmer Profile & Records'}</span>
                    </button>
                  </div>

                  {/* Sign Out / Exit Guest */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{user.isGuest ? (isHi ? 'गेस्ट मोड से बाहर निकलें' : 'Exit Guest Mode') : t.auth.signOut}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Login CTA button if not logged in */
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-primary-green text-white text-xs sm:text-sm font-black shadow-md hover:bg-primary-hover transition-all shrink-0 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden xs:inline">{t.auth.login}</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
