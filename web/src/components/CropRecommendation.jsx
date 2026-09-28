import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Sparkles, 
  Loader2, 
  SlidersHorizontal, 
  CheckCircle2, 
  Droplets, 
  Clock, 
  IndianRupee, 
  AlertCircle, 
  ChevronDown, 
  MapPin,
  Sprout,
  ArrowRight
} from 'lucide-react';
import { recommendCrops } from '../services/data.js';
import { getTranslation } from '../services/translations.js';
import { useCountUp } from '../hooks/useCountUp.js';

const SOIL_TYPES = [
  { value: 'Loam', labelEn: '🌱 Loam (Best all-round fertile soil)', labelHi: '🌱 दोमट मिट्टी (Loam Soil)' },
  { value: 'Sandy Loam', labelEn: '🏖️ Sandy Loam (Light & fast-draining)', labelHi: '🏖️ रेतीली दोमट मिट्टी (Sandy Loam)' },
  { value: 'Clay Loam', labelEn: '🧱 Clay Loam (Rich & high moisture)', labelHi: '🧱 मटियारी दोमट मिट्टी (Clay Loam)' },
  { value: 'Black Cotton Soil', labelEn: '🌾 Black Soil (Ideal for cotton & wheat)', labelHi: '🌾 काली मिट्टी (Black Cotton Soil)' },
  { value: 'Alluvial', labelEn: '🌊 Alluvial (River basin, fertile)', labelHi: '🌊 जलोढ़ मिट्टी (Alluvial Soil)' },
];

const SEASONS = [
  { value: 'Rabi', labelEn: '❄️ Rabi (Winter: Oct – Mar)', labelHi: '❄️ रबी (सर्दियां: अक्टू – मार्च)' },
  { value: 'Kharif', labelEn: '🌧️ Kharif (Monsoon: Jun – Oct)', labelHi: '🌧️ खरीफ (मानसून: जून – अक्टू)' },
  { value: 'Zaid', labelEn: '☀️ Zaid (Summer: Mar – Jun)', labelHi: '☀️ जायद (गर्मी: मार्च – जून)' },
];

const RISK_BADGES = {
  Low: {
    labelEn: '🟢 Easy & Low Risk',
    labelHi: '🟢 आसान व कम जोखिम',
    bg: 'bg-primary-light border-primary-light text-primary-green',
  },
  Medium: {
    labelEn: '🟡 Medium Care Needed',
    labelHi: '🟡 मध्यम देखभाल आवश्यक',
    bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-500',
  },
  High: {
    labelEn: '🔴 High Care & Vigilance Needed',
    labelHi: '🔴 उच्च देखभाल व निगरानी आवश्यक',
    bg: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400',
  }
};

export default function CropRecommendation({ language = 'EN' }) {
  const [location, setLocation] = useState('Ludhiana, Punjab');
  const [soilType, setSoilType] = useState('Loam');
  const [season, setSeason] = useState('Rabi');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const t = getTranslation(language);
  const isHi = language === 'HI';

  const runRecommendation = async (loc, soil, ssn) => {
    setLoading(true);
    setError(null);
    try {
      const data = await recommendCrops(loc, soil, ssn);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Run initial match on mount
  useEffect(() => {
    runRecommendation(location, soilType, season);
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    runRecommendation(location, soilType, season);
  };

  const loadPreset = (presetLoc, presetSoil, presetSeason) => {
    setLocation(presetLoc);
    setSoilType(presetSoil);
    setSeason(presetSeason);
    runRecommendation(presetLoc, presetSoil, presetSeason);
  };

  return (
    <section aria-label="Crop Recommendation" className="space-y-6 animate-fade-up">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-light border-2 border-primary-light flex items-center justify-center text-primary-green shadow-sm shrink-0">
            <Leaf className="w-7 h-7" strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-main tracking-tight">
              {t.crops.title}
            </h2>
            <p className="text-sm font-semibold text-muted mt-0.5">
              {t.crops.subtitle}
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-muted whitespace-nowrap">
            {isHi ? "त्वरित फील्ड टेस्ट:" : "Quick Field Tests:"}
          </span>
          <button
            onClick={() => loadPreset('Ludhiana, Punjab', 'Loam', 'Rabi')}
            className="px-3 py-1.5 rounded-xl bg-card border border-border-subtle text-xs font-bold text-main hover:border-primary-green hover:text-primary-green transition-colors whitespace-nowrap shadow-xs cursor-pointer"
          >
            🌾 Punjab Rabi Loam
          </button>
          <button
            onClick={() => loadPreset('Rajkot, Gujarat', 'Black Cotton Soil', 'Kharif')}
            className="px-3 py-1.5 rounded-xl bg-card border border-border-subtle text-xs font-bold text-main hover:border-primary-green hover:text-primary-green transition-colors whitespace-nowrap shadow-xs cursor-pointer"
          >
            🌱 Gujarat Black Cotton
          </button>
        </div>
      </div>

      {/* ── Multi-Column Split: Form (4 cols) + Results (8 cols) ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 4 Cols: Soil & Climate Input Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-4 card p-5 sm:p-6 space-y-4 shadow-sm lg:sticky lg:top-24">
          <div className="flex items-center justify-between pb-3 border-b border-border-card">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-primary-green" strokeWidth={2.2} />
              <h3 className="text-base font-black text-main">
                {isHi ? "खेत व मिट्टी पैरामीटर" : "Land & Climate Parameters"}
              </h3>
            </div>
            <span className="text-[10px] font-bold text-primary-green bg-primary-light px-2.5 py-0.5 rounded-full">
              AI Match
            </span>
          </div>

          <div className="space-y-4">
            {/* Location */}
            <div className="space-y-1.5">
              <label htmlFor="cr-location" className="field-label flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary-green" strokeWidth={2} />
                {t.crops.location}
              </label>
              <input
                id="cr-location"
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Ludhiana, Punjab"
                className="field-input font-semibold"
              />
            </div>

            {/* Soil Type */}
            <div className="space-y-1.5">
              <label htmlFor="cr-soil" className="field-label flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-primary-green" strokeWidth={2} />
                {t.crops.soilType}
              </label>
              <div className="relative">
                <select
                  id="cr-soil"
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="field-input appearance-none pr-10 cursor-pointer font-semibold"
                >
                  {SOIL_TYPES.map((s) => (
                    <option key={s.value} value={s.value} className="dark:bg-[#162217]">
                      {isHi ? s.labelHi : s.labelEn}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
              </div>
            </div>

            {/* Season */}
            <div className="space-y-1.5">
              <label htmlFor="cr-season" className="field-label flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary-green" strokeWidth={2} />
                {t.crops.season}
              </label>
              <div className="relative">
                <select
                  id="cr-season"
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="field-input appearance-none pr-10 cursor-pointer font-semibold"
                >
                  {SEASONS.map((s) => (
                    <option key={s.value} value={s.value} className="dark:bg-[#162217]">
                      {isHi ? s.labelHi : s.labelEn}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{isHi ? 'गणना जारी है…' : 'Calculating Model…'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>{t.crops.recommendBtn}</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] font-medium text-muted text-center">
            🔒 {isHi ? 'ICAR एवं राज्य कृषि विश्वविद्यालयों के डेटा पर आधारित।' : 'Uses ICAR & regional agricultural university agronomy standards.'}
          </p>
        </form>

        {/* Right 8 Cols: Ranked Crop Recommendations Grid */}
        <div className="lg:col-span-8 space-y-4">
          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-pulse">
              <div className="card h-72" />
              <div className="card h-72" />
              <div className="card h-72" />
              <div className="card h-72" />
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="advisory-danger rounded-2xl p-4 text-base font-bold text-red-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{isHi ? 'त्रुटि: ' : 'Error loading recommendations: '} {error}</span>
            </div>
          )}

          {/* Results Grid */}
          {results && !loading && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl sm:text-2xl font-black text-main">
                  {isHi ? `${soilType} मिट्टी हेतु श्रेष्ठ फसलें (${season})` : `Top Crop Matches for ${soilType} in ${season}`}
                </h3>
                <span className="text-xs font-bold text-primary-green bg-primary-light border border-primary-light px-3 py-1 rounded-full">
                  {results.length} {isHi ? "अनुकूल फसलें" : "Suitable Matches"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {results.map((item, idx) => (
                  <CropCardItem key={item.crop} item={item} rank={idx + 1} language={language} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CropCardItem({ item, rank, language = 'EN' }) {
  const isHi = language === 'HI';
  const risk = RISK_BADGES[item.riskLevel] || RISK_BADGES.Medium;
  const animScore = useCountUp(item.suitabilityScore, 600, 0);

  return (
    <article
      className="card p-5 space-y-3.5 card-hover flex flex-col justify-between"
    >
      <div className="space-y-3">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-black bg-primary-green text-white mb-1 shadow-sm">
              #{rank} {isHi ? "रैंक" : "Match"}
            </span>
            <h4 className="text-xl font-black text-main">{item.crop}</h4>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-black text-primary-green leading-none">
              {animScore}%
            </div>
            <div className="text-[10px] font-extrabold text-muted uppercase mt-0.5">
              {isHi ? "अनुकूलता स्कोर" : "Match Score"}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 rounded-full bg-subtle overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] transition-all duration-700"
            style={{ width: `${item.suitabilityScore}%` }}
          />
        </div>

        {/* Key Metrics Chips */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2.5 rounded-xl bg-subtle border border-border-subtle">
            <div className="text-[10px] font-bold text-muted">{isHi ? "अनुमानित शुद्ध लाभ" : "Est. Net Profit"}</div>
            <div className="text-base font-black text-main flex items-center gap-0.5 mt-0.5">
              <span>{item.estimatedProfitPerAcre}</span>
              <span className="text-[10px] font-semibold text-muted">/ acre</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-subtle border border-border-subtle">
            <div className="text-[10px] font-bold text-muted">{isHi ? "पैदावार" : "Expected Yield"}</div>
            <div className="text-base font-black text-main mt-0.5 truncate">
              {item.expectedYield}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-subtle border border-border-subtle">
            <div className="text-[10px] font-bold text-muted flex items-center gap-1">
              <Droplets className="w-3 h-3 text-sky-500" /> {isHi ? "पानी की जरूरत" : "Water Need"}
            </div>
            <div className="text-xs font-extrabold text-main mt-0.5">
              {item.waterRequirement}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-subtle border border-border-subtle">
            <div className="text-[10px] font-bold text-muted flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-500" /> {isHi ? "समय अवधि" : "Duration"}
            </div>
            <div className="text-xs font-extrabold text-main mt-0.5">
              {item.durationDays}
            </div>
          </div>
        </div>

        {/* Risk Badge */}
        <div className={`p-2.5 rounded-xl border text-xs font-medium ${risk.bg}`}>
          <div className="font-black text-xs mb-0.5">{isHi ? risk.labelHi : risk.labelEn}</div>
          <p className="text-[11px] font-semibold leading-relaxed opacity-95">{item.riskReason}</p>
        </div>
      </div>

      {/* Fertilizer Advice */}
      <div className="p-2.5 rounded-xl bg-subtle border border-border-subtle text-xs text-main flex items-start gap-2 shadow-sm">
        <CheckCircle2 className="w-3.5 h-3.5 text-primary-green shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold text-main">{isHi ? "उर्वरक सलाह: " : "Fertilizer: "}</span>
          <span className="text-body font-semibold">{item.recommendedFertilizer}</span>
        </div>
      </div>
    </article>
  );
}
