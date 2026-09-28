import React from 'react';
import { 
  TrendingUp, 
  CloudSun, 
  Sprout, 
  ShoppingBag, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  ChevronRight, 
  Droplets, 
  Wind, 
  ShieldCheck, 
  Sparkles,
  Search,
  CheckCircle2
} from 'lucide-react';
import { MARKET_COMMODITIES, CURRENT_WEATHER } from '../data/mockData';

export default function Dashboard({ setActiveTab, onSelectCrop }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/20 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Digital Farming Assistant</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Grow Smarter, Sell Higher with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">Agrostat</span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Real-time crop price forecasts, micro-climate weather advisories, soil suitability models, and a direct farmer-to-buyer marketplace.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full lg:w-auto">
            <button 
              onClick={() => setActiveTab('prediction')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold hover:from-emerald-400 hover:to-teal-500 transition-all duration-200 shadow-lg shadow-emerald-500/20"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Check Crop Prices</span>
            </button>
            <button 
              onClick={() => setActiveTab('recommendation')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold border border-slate-700 transition-all duration-200"
            >
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>Soil Crop Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* Critical Weather Alert Banner */}
      {CURRENT_WEATHER.advisories.length > 0 && (
        <div className="glass-panel-gold rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
              <AlertTriangle className="w-6 h-6 animate-pulse-subtle" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/30 text-amber-300 uppercase tracking-wider">
                  {CURRENT_WEATHER.advisories[0].severity}
                </span>
                <h2 className="text-white font-bold text-base sm:text-lg">
                  {CURRENT_WEATHER.advisories[0].title}
                </h2>
              </div>
              <p className="text-slate-300 text-sm mt-1">
                {CURRENT_WEATHER.advisories[0].description}
              </p>
              <p className="text-emerald-400 text-xs font-semibold mt-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Action: {CURRENT_WEATHER.advisories[0].action}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('weather')}
            className="shrink-0 px-4 py-2 text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl flex items-center gap-1 transition-colors"
          >
            <span>Full Forecast</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick Access Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Module 1: Price Prediction */}
        <div 
          onClick={() => setActiveTab('prediction')}
          className="glass-panel-interactive rounded-2xl p-5 cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                AI Forecast
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                Price Prediction
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                30-day Mandi market price trends & optimal selling window indicators.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-300">
            <span>8 Commodities Tracked</span>
            <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Module 2: Weather Advisory */}
        <div 
          onClick={() => setActiveTab('weather')}
          className="glass-panel-interactive rounded-2xl p-5 cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-sky-500/15 text-sky-400 group-hover:scale-110 transition-transform">
                <CloudSun className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">
                {CURRENT_WEATHER.temp}°C {CURRENT_WEATHER.condition}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors">
                Weather Advisory
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Microclimate rainfall probability, pesticide spray windows & soil moisture.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-300">
            <span>{CURRENT_WEATHER.location}</span>
            <ChevronRight className="w-4 h-4 text-sky-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Module 3: Crop Recommendation */}
        <div 
          onClick={() => setActiveTab('recommendation')}
          className="glass-panel-interactive rounded-2xl p-5 cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-teal-500/15 text-teal-400 group-hover:scale-110 transition-transform">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
                Soil AI
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">
                Crop Recommendation
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                NPK & pH soil analysis to match optimal crop yield & ROI potential.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-300">
            <span>Smart Soil Engine</span>
            <ChevronRight className="w-4 h-4 text-teal-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Module 4: Marketplace */}
        <div 
          onClick={() => setActiveTab('marketplace')}
          className="glass-panel-interactive rounded-2xl p-5 cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-amber-500/15 text-amber-400 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                Direct B2B
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                Agro Marketplace
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Buy quality seeds, fertilizers & machinery or sell harvest directly to buyers.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-300">
            <span>Verified Farmers & Suppliers</span>
            <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main Section: Live Market Ticker & Weather Quick Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Commodity Price Forecast Highlights */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white">Live Mandi Commodity Forecast</h2>
            </div>
            <button 
              onClick={() => setActiveTab('prediction')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              <span>View All Commodities</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MARKET_COMMODITIES.slice(0, 4).map((crop) => (
              <div 
                key={crop.id}
                onClick={() => {
                  onSelectCrop(crop.id);
                  setActiveTab('prediction');
                }}
                className="glass-panel-interactive rounded-2xl p-4 cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {crop.category}
                    </span>
                    <h3 className="font-bold text-white text-base mt-0.5">{crop.name}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    crop.trend === 'BULLISH' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {crop.recommendation}
                  </span>
                </div>

                <div className="my-4 flex items-baseline justify-between">
                  <div>
                    <div className="text-2xl font-extrabold text-white">
                      ₹{crop.currentPrice.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-400">Current / {crop.unit}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-400 flex items-center justify-end gap-0.5">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>₹{crop.predictedPrice30d.toLocaleString()}</span>
                    </div>
                    <div className="text-[11px] text-emerald-400/80">30-Day Forecast (+{crop.predictedChange}%)</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Best Selling Window:</span>
                  <span className="text-amber-400 font-semibold">{crop.optimalWindow}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Weather Quick Overview Widget */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-sky-400" />
              <h2 className="text-xl font-bold text-white">Microclimate Radar</h2>
            </div>
          </div>

          <div className="glass-panel-sky rounded-2xl p-5 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-extrabold text-white">
                  {CURRENT_WEATHER.temp}°C
                </h3>
                <p className="text-slate-300 text-sm font-medium">{CURRENT_WEATHER.condition}</p>
                <p className="text-slate-400 text-xs mt-0.5">{CURRENT_WEATHER.location}</p>
              </div>
              <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-300 text-right">
                <div className="text-xs font-bold text-sky-400 uppercase">Rain Probability</div>
                <div className="text-2xl font-extrabold text-white">{CURRENT_WEATHER.rainProbability}%</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                  <Droplets className="w-3.5 h-3.5 text-sky-400" />
                  <span>Humidity</span>
                </div>
                <div className="text-base font-bold text-white mt-1">{CURRENT_WEATHER.humidity}%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                  <Wind className="w-3.5 h-3.5 text-teal-400" />
                  <span>Wind Speed</span>
                </div>
                <div className="text-base font-bold text-white mt-1">{CURRENT_WEATHER.windSpeed}</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Today's Spray Window</span>
              </div>
              <p className="text-xs text-slate-300">
                {CURRENT_WEATHER.forecast[0].sprayWindow}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
