import React from 'react';
import { Home, TrendingUp, Leaf, ShoppingBag, User, Bot } from 'lucide-react';
import { getTranslation } from '../services/translations.js';

const NAV_ITEMS = [
  { id: 'home', labelEn: 'Home', labelHi: 'होम', Icon: Home },
  { id: 'prices', labelEn: 'Prices', labelHi: 'मंडी भाव', Icon: TrendingUp },
  { id: 'crops', labelEn: 'Crops', labelHi: 'फसल चयन', Icon: Leaf },
  { id: 'market', labelEn: 'Market', labelHi: 'बाज़ार', Icon: ShoppingBag },
  { id: 'agrobot', labelEn: 'AgroBot', labelHi: 'एग्रोबॉट', Icon: Bot },
  { id: 'profile', labelEn: 'Profile', labelHi: 'प्रोफ़ाइल', Icon: User },
];

/**
 * Mobile Bottom Navigation Bar (Fixed at bottom on mobile screens)
 */
export default function BottomNav({ activeTab, setActiveTab, language = 'EN' }) {
  const isHi = language === 'HI';

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border-card shadow-lg transition-colors duration-300"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1">
        {NAV_ITEMS.map(({ id, labelEn, labelHi, Icon }) => {
          const active = activeTab === id;
          const label = isHi ? labelHi : labelEn;
          return (
            <button
              key={id}
              id={`mobile-tab-${id}`}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all relative cursor-pointer ${
                active 
                  ? 'text-primary-green' 
                  : 'text-muted hover:text-main'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  active 
                    ? 'bg-primary-light text-primary-green scale-110' 
                    : ''
                }`}
              >
                <Icon
                  className="w-5 h-5 transition-transform"
                  strokeWidth={active ? 2.5 : 2.2}
                />
              </div>
              <span className={`text-[10px] font-extrabold mt-0.5 tracking-tight ${
                active 
                  ? 'text-primary-green' 
                  : 'text-muted'
              }`}>
                {label}
              </span>
              {active && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-primary-green" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
