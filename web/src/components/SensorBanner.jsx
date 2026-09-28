import React, { useEffect, useState, useCallback } from 'react';
import {
  Thermometer,
  Droplets,
  Volume2,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  CloudSun,
  ArrowUpRight,
  ArrowDownRight,
  Radio,
  Calendar,
  MapPin,
  Wind,
  Sprout,
  Activity,
  Sliders,
  Sparkles,
  Zap,
  ShieldAlert,
  Coins,
  Gauge
} from 'lucide-react';
import { onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { sensorReadingsRef } from '../services/firebase.js';
import { getTranslation } from '../services/translations.js';
import { getLatestTelemetry } from '../services/data.js';
import { useCountUp } from '../hooks/useCountUp.js';

/* ── Severity Configuration ──────────────────────────────────────────────── */
const SEVERITY_CONFIG = {
  normal: {
    panelClass: 'advisory-normal',
    badgeClass: 'bg-primary-light text-primary-green border-primary-light',
    labelEn: 'All Clear · Optimal Microclimate',
    labelHi: 'अनुकूल एवं सुरक्षित सूक्ष्म-जलवायु',
    icon: <ShieldCheck className="w-6 h-6 text-primary-green shrink-0" strokeWidth={2.2} />
  },
  warning: {
    panelClass: 'advisory-warning',
    badgeClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-200 dark:border-amber-900',
    labelEn: 'Pathogen Warning · Spore Incubation Risk',
    labelHi: 'रोग चेतावनी · फफूंद फैलाव का खतरा',
    icon: <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 animate-bounce" strokeWidth={2.2} />
  },
  danger: {
    panelClass: 'advisory-danger',
    badgeClass: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900',
    labelEn: 'Critical Microclimate Alert · Financial Loss Risk',
    labelHi: 'अत्यधिक मौसम चेतावनी · फसल नुकसान जोखिम',
    icon: <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0 animate-pulse" strokeWidth={2.2} />
  }
};

export default function SensorBanner({ onSpeakAdvisory, language = 'EN', theme = 'light' }) {
  const t = getTranslation(language);
  const isHi = language === 'HI';

  // Default sensor values (or updated via Firestore / Live Simulator)
  const [sensor, setSensor] = useState({
    temperature: 28.4,
    humidity: 62.0,
    soil_moisture_raw: 2100,
    motion_detected: false,
    timestamp: new Date().toISOString()
  });
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSimulation, setActiveSimulation] = useState(null);

  const temp = sensor?.temperature ?? sensor?.temp ?? 28.4;
  const humidity = sensor?.humidity ?? 62.0;
  const rawMoisture = sensor?.soil_moisture_raw ?? sensor?.soilMoistureRaw ?? sensor?.rawSoil ?? 2100;
  
  const [uiInvert, setUiInvert] = useState(false);

  // Calculate moisture percentage & VPD with dual polarity support
  let rawCalculatedPct = typeof sensor?.soil_moisture_pct === 'number'
    ? sensor.soil_moisture_pct
    : (typeof sensor?.soil_moisture === 'number'
        ? sensor.soil_moisture
        : (typeof sensor?.soilPercent === 'number'
            ? sensor.soilPercent
            : Math.max(0, Math.min(100, Math.round((rawMoisture / 4095) * 100)))));

  const soilPct = uiInvert ? (100 - rawCalculatedPct) : rawCalculatedPct;

  // Precision Agronomy: Vapor Pressure Deficit (kPa)
  const vpSat = 0.61078 * Math.exp((17.27 * temp) / (temp + 237.3));
  const vpAct = vpSat * (humidity / 100.0);
  const vpd = Math.max(0, vpSat - vpAct).toFixed(2);

  // Derive biological loss & disease risk metrics
  let severity = 'normal';
  let pathogenRiskPct = 14;
  let financialLossAtRisk = 0;
  let advisoryText = '';

  if (temp >= 35) {
    severity = 'danger';
    pathogenRiskPct = 88;
    financialLossAtRisk = 12000;
    advisoryText = isHi
      ? `खेत का तापमान ${temp}°C पहुंच गया है (गर्मी का भारी तनाव)। वाष्पोत्सर्जन दर अत्यधिक तेज है। पौधों को झुलसने से बचाने के लिए शाम के समय हल्की सिंचाई करें।`
      : `Field temperature has reached ${temp}°C (High Evaporative Stress). Cellular respiration is peaking. Irrigate during cooler evening hours to protect crop foliage.`;
  } else if (temp <= 5) {
    severity = 'danger';
    pathogenRiskPct = 92;
    financialLossAtRisk = 16000;
    advisoryText = isHi
      ? `खेत का तापमान ${temp}°C है (पाला पड़ने की चेतावनी)। रात में खेत की मेड़ों पर हल्का धुआं करें और हल्की सिंचाई कर नमी बनाए रखें।`
      : `Field temperature is ${temp}°C (Frost Alert). Protect winter seedlings by maintaining soil moisture and creating mild smoke cover near borders.`;
  } else if (humidity >= 78 && Number(vpd) <= 0.45) {
    severity = 'warning';
    pathogenRiskPct = 82;
    financialLossAtRisk = 14500;
    advisoryText = isHi
      ? `पत्तियों पर नमी संघनन (VPD ${vpd} kPa) व 78%+ आर्द्रता से फफूंद (पीला रतुआ/झुलसा) का खतरा 36 घंटे में बढ़ सकता है। ICAR अनुसार प्रोपिकोनाजोल या मैंकोजेब का सुरक्षात्मक छिड़काव करें।`
      : `Microclimate (VPD ${vpd} kPa, ${humidity}% RH) creates high-risk spore germination conditions for Yellow Rust/Blight in 36h. Apply protective foliar bio-fungicide.`;
  } else if (soilPct < 30) {
    severity = 'warning';
    pathogenRiskPct = 45;
    financialLossAtRisk = 6500;
    advisoryText = isHi
      ? `मिट्टी में नमी का स्तर केवल ${soilPct}% है। फसल की जड़ों में सूखापन से बचने के लिए अगले 24 घंटे में सिंचाई की योजना बनाएं।`
      : `Soil moisture level is dry at ${soilPct}%. Plan next irrigation cycle within 24 hours to prevent moisture deficiency.`;
  } else {
    severity = 'normal';
    pathogenRiskPct = 12;
    financialLossAtRisk = 0;
    advisoryText = isHi
      ? `खेत का तापमान ${temp}°C, नमी ${humidity}% व VPD ${vpd} kPa फसल वृद्धि के लिए बिल्कुल अनुकूल है। सामान्य कृषि कार्यों व खाद छिड़काव का उत्तम समय है।`
      : `Field microclimate (${temp}°C, ${humidity}% RH, VPD ${vpd} kPa) is in the optimal growth zone. Safe window for nutrient top-dressing and field operations.`;
  }

  // Animated numbers
  const animatedTemp = useCountUp(temp, 500, 1);
  const animatedHumidity = useCountUp(humidity, 500, 0);
  const animatedSoil = useCountUp(soilPct, 500, 0);
  const animatedRaw = useCountUp(rawMoisture, 500, 0);

  const currentDate = new Date().toLocaleDateString(isHi ? 'hi-IN' : 'en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  // Subscribe to latest sensor reading via FastAPI live backend and Firestore
  useEffect(() => {
    if (activeSimulation) return;

    let isMounted = true;
    const fetchLive = async () => {
      try {
        const liveData = await getLatestTelemetry();
        if (liveData && liveData.temperature != null && isMounted) {
          setSensor(prev => ({
            ...prev,
            ...liveData
          }));
          setLoading(false);
        }
      } catch (e) {
        // Fallback
      }
    };

    fetchLive();
    const interval = setInterval(fetchLive, 2500);

    const q = query(sensorReadingsRef, orderBy('timestamp', 'desc'), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLoading(false);
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        if (data.temperature != null && isMounted) {
          setSensor(prev => ({ ...prev, ...data }));
        }
      }
    }, (err) => {
      setLoading(false);
    });

    return () => {
      isMounted = false;
      clearInterval(interval);
      unsubscribe();
    };
  }, [activeSimulation]);

  const handleSpeak = () => {
    if (!advisoryText) return;
    setIsSpeaking(true);
    onSpeakAdvisory?.(advisoryText);
    setTimeout(() => setIsSpeaking(false), 5000);
  };

  const handleSimulate = (mode) => {
    setActiveSimulation(mode);
    if (mode === 'heat') {
      setSensor({ temperature: 38.5, humidity: 36.0, soil_moisture_raw: 3650, soil_moisture_pct: 12, motion_detected: false });
    } else if (mode === 'frost') {
      setSensor({ temperature: 3.8, humidity: 88.0, soil_moisture_raw: 2200, soil_moisture_pct: 48, motion_detected: false });
    } else if (mode === 'spoilage') {
      setSensor({ temperature: 23.5, humidity: 86.0, soil_moisture_raw: 1600, soil_moisture_pct: 82, motion_detected: false });
    } else if (mode === 'dry_soil') {
      setSensor({ temperature: 31.0, humidity: 42.0, soil_moisture_raw: 3800, soil_moisture_pct: 14, motion_detected: false });
    } else if (mode === 'wet_soil') {
      setSensor({ temperature: 25.0, humidity: 75.0, soil_moisture_raw: 1300, soil_moisture_pct: 92, motion_detected: false });
    } else {
      setActiveSimulation(null);
    }
  };

  const severityStyle = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.normal;

  return (
    <section aria-label="Field Overview and Weather Advisory" className="space-y-6 animate-fade-up">

      {/* ── 1. Hero Banner ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1B5E20] via-[#246B28] to-[#2E7D32] dark:from-[#112413] dark:via-[#163519] dark:to-[#1D4A22] p-6 sm:p-8 lg:p-10 text-white shadow-xl border border-white/10">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-[#E8A93B]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-2xl">
            <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/15 dark:bg-black/30 backdrop-blur-sm border border-white/20 dark:border-white/10 text-white text-xs font-bold shadow-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>{currentDate}</span>
              <span className="opacity-60">•</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Ludhiana, Punjab</span>
              <span className="opacity-60">•</span>
              <span className="flex items-center gap-1.5 text-emerald-300 font-black">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {sensor.device_id || "agrostat-esp32-node-01"}
              </span>
              <span className="opacity-60">•</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-200 text-[10px] font-black uppercase tracking-wider">
                ☁️ Firebase RTDB Live
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              {isHi ? 'नमस्ते किसान भाई! 🌾' : 'Good Morning, Farmer! 🌾'}
            </h1>

            <p className="text-white/95 text-base sm:text-lg leading-relaxed font-medium">
              {advisoryText}
            </p>

            {/* Hardware Demo Simulator Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-white/75 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-300" /> {isHi ? "सिम्युलेशन / टेस्ट:" : "Test Presets:"}
              </span>
              <button
                onClick={() => handleSimulate(null)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  !activeSimulation
                    ? 'bg-emerald-400 text-emerald-950 shadow-md font-black scale-105'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                {isHi ? "⚡ लाइव हार्डवेयर" : "⚡ Live Hardware"}
              </button>
              <button
                onClick={() => handleSimulate('dry_soil')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSimulation === 'dry_soil'
                    ? 'bg-red-400 text-red-950 font-black shadow-md scale-105'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                {isHi ? "सूखी मिट्टी (14%) 🌵" : "Dry Soil (14%) 🌵"}
              </button>
              <button
                onClick={() => handleSimulate('wet_soil')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSimulation === 'wet_soil'
                    ? 'bg-sky-400 text-sky-950 font-black shadow-md scale-105'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                {isHi ? "सिंचित मिट्टी (92%) 🌊" : "Wet Soil (92%) 🌊"}
              </button>
              <button
                onClick={() => handleSimulate('spoilage')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSimulation === 'spoilage'
                    ? 'bg-purple-400 text-purple-950 font-black shadow-md scale-105'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                {isHi ? "फफूंद जोखिम (VPD 0.3) 🍄" : "Spore Risk (VPD 0.3) 🍄"}
              </button>
              <button
                onClick={() => handleSimulate('heat')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSimulation === 'heat'
                    ? 'bg-amber-400 text-amber-950 font-black shadow-md scale-105'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                {isHi ? "गर्मी तनाव (38°C) 🔥" : "High Heat (38°C) 🔥"}
              </button>
            </div>
          </div>

          {/* Quick Real-Time Capsules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5 shrink-0 lg:min-w-[300px]">
            <div className="flex items-center gap-3.5 bg-white/10 dark:bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/20 dark:border-white/10 sensor-breath">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-[#E8A93B] shrink-0">
                <CloudSun className="w-7 h-7" strokeWidth={2.2} />
              </div>
              <div>
                <div className="text-xs font-bold text-white/80 uppercase tracking-wider">{t.sensor.temperature}</div>
                <div className="text-2xl font-black text-white">
                  {animatedTemp}°C
                </div>
                <div className="text-xs font-semibold text-emerald-200">
                  {t.sensor.humidity}: {animatedHumidity}%
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-white/10 dark:bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/20 dark:border-white/10">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-emerald-300 shrink-0">
                <Gauge className="w-7 h-7" strokeWidth={2.2} />
              </div>
              <div>
                <div className="text-xs font-bold text-white/80 uppercase tracking-wider">Vapor Pressure Deficit (VPD)</div>
                <div className="text-lg font-black text-white">
                  {vpd} kPa · {Number(vpd) < 0.5 ? (isHi ? "कंडेनसेशन ⚠️" : "Condensation ⚠️") : (isHi ? "सुरक्षित 🟢" : "Optimal 🟢")}
                </div>
                <div className="text-xs font-semibold text-emerald-200">
                  {isHi ? "सूक्ष्म-जलवायु आर्द्रता सूचकांक" : "Microclimate Transpiration Index"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Sensor Cards + Killer Loss Prevention Gauge ──────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Temperature */}
        <div className="card p-5 border-t-4 border-t-amber-500 relative overflow-hidden card-hover">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-center justify-center text-amber-500">
                <Thermometer className="w-6 h-6" strokeWidth={2.2} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted">{t.sensor.temperature}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-primary-light text-primary-green">
                    <span className="live-dot" /> LIVE
                  </span>
                </div>
                <div className="text-3xl font-black text-main mt-0.5">
                  {animatedTemp}°C
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center text-xs font-bold px-2 py-1 rounded-lg ${
                temp >= 35 ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400' : 'bg-primary-light text-primary-green'
              }`}>
                {temp >= 35 ? '🔥 High Heat' : '✓ Normal'}
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border-card flex items-center justify-between text-xs text-muted">
            <span>Optimal: 20° – 32°C</span>
            <span className={`font-bold ${temp >= 20 && temp <= 32 ? 'text-primary-green' : 'text-amber-500'}`}>
              {temp >= 20 && temp <= 32 ? '✓ Healthy' : '⚠ Action'}
            </span>
          </div>
        </div>

        {/* Humidity */}
        <div className="card p-5 border-t-4 border-t-sky-500 relative overflow-hidden card-hover">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 flex items-center justify-center text-sky-500">
                <Droplets className="w-6 h-6" strokeWidth={2.2} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted">{t.sensor.humidity}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-primary-light text-primary-green">
                    <span className="live-dot" /> LIVE
                  </span>
                </div>
                <div className="text-3xl font-black text-main mt-0.5">
                  {animatedHumidity}%
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center text-xs font-bold text-sky-500 bg-sky-50 dark:bg-sky-950/40 px-2 py-1 rounded-lg">
                <ArrowDownRight className="w-3.5 h-3.5" /> RH
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border-card flex items-center justify-between text-xs text-muted">
            <span>Optimal: 50 – 75%</span>
            <span className={`font-bold ${humidity >= 50 && humidity <= 75 ? 'text-sky-500' : 'text-amber-500'}`}>
              {humidity >= 50 && humidity <= 75 ? '✓ Good' : '⚠ Monitor'}
            </span>
          </div>
        </div>

        {/* Soil Moisture */}
        <div className="card p-5 border-t-4 border-t-primary-green relative overflow-hidden card-hover">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary-green flex items-center justify-center">
                <Sprout className="w-6 h-6" strokeWidth={2.2} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted">{t.sensor.soilMoisture}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-primary-light text-primary-green">
                    <span className="live-dot" /> LIVE
                  </span>
                </div>
                <div className="text-3xl font-black text-main mt-0.5">
                  {animatedSoil}%
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center text-xs font-bold px-2 py-1 rounded-lg ${
                soilPct < 30 ? 'text-red-600 bg-red-50 dark:bg-red-950/50 dark:text-red-400' : 'text-primary-green bg-primary-light'
              }`}>
                {soilPct < 30 ? 'Dry 🔴' : 'Moist 🟢'}
              </span>
            </div>
          </div>

          {/* Hydration Progress Bar */}
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-700 rounded-full ${
                soilPct < 25
                  ? 'bg-red-500'
                  : soilPct < 60
                  ? 'bg-emerald-500'
                  : 'bg-sky-500'
              }`}
              style={{ width: `${Math.max(4, Math.min(100, soilPct))}%` }}
            />
          </div>

          <div className="mt-3 pt-3 border-t border-border-card flex items-center justify-between text-xs text-muted">
            <div className="flex items-center gap-2">
              <span>ADC Raw: <strong>{animatedRaw}</strong></span>
              <button
                onClick={() => setUiInvert(prev => !prev)}
                title="Click to flip sensor polarity between 4095=100% and 0=100%"
                className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-subtle hover:bg-border-subtle text-main border border-border-subtle transition-colors cursor-pointer"
              >
                {uiInvert ? '🔄 Invert (ON)' : '🔄 Invert (OFF)'}
              </button>
            </div>
            <span className={`font-bold ${soilPct < 30 ? 'text-red-600 dark:text-red-400' : 'text-primary-green'}`}>
              {soilPct < 30 ? '⚠ Irrigate (Dry)' : '✓ Optimal (Moist)'}
            </span>
          </div>
        </div>

        {/* ── Killer Standout Metric: Financial Loss Risk at Stake ────── */}
        <div className="card p-5 border-t-4 border-t-red-500 relative overflow-hidden card-hover">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-center justify-center text-red-600 dark:text-red-400">
                <Coins className="w-6 h-6" strokeWidth={2.2} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted">Pre-Harvest Loss Risk</span>
                </div>
                <div className="text-2xl font-black text-main mt-0.5">
                  {financialLossAtRisk > 0 ? `₹${financialLossAtRisk.toLocaleString()}` : '₹0 (Safe)'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center text-xs font-bold px-2 py-1 rounded-lg ${
                financialLossAtRisk > 0 ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400' : 'bg-primary-light text-primary-green'
              }`}>
                {financialLossAtRisk > 0 ? '⚠ At Risk' : '✓ Protected'}
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border-card flex items-center justify-between text-xs text-muted">
            <span>Pathogen Spore Index</span>
            <span className={`font-bold ${pathogenRiskPct > 60 ? 'text-red-600 dark:text-red-400' : 'text-primary-green'}`}>
              {pathogenRiskPct}% Risk
            </span>
          </div>
        </div>
      </div>

      {/* ── 2.5 PIR Motion / Intrusion Detection Alert (ESP32 GPIO 27) ────── */}
      {sensor?.motion_detected && (
        <div className="card p-4 bg-amber-500/10 border-2 border-amber-500/50 rounded-2xl flex items-center justify-between gap-4 animate-bounce">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              🚨
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {isHi ? "खेत में हलचल / जंगली पशु चेतावनी (PIR GPIO 27)" : "Field Intrusion / Wildlife Motion Detected (PIR GPIO 27)"}
              </div>
              <div className="text-sm font-bold text-main">
                {isHi ? "खेत की मेड़ पर हलचल दर्ज की गई है। कृपया फसल सुरक्षा सुनिश्चित करें।" : "Active motion sensed near field perimeter. Check crop protection fencing."}
              </div>
            </div>
          </div>
          <span className="px-3 py-1 bg-amber-500 text-white rounded-lg text-xs font-black animate-pulse">
            MOTION ACTIVE
          </span>
        </div>
      )}

      {/* ── 3. Actionable Advisory Banner with Soundwave animation ────────── */}
      <div className={`card p-5 sm:p-6 lg:p-7 ${severityStyle.panelClass} shadow-md border-2 relative transition-all`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-card border border-border-card flex items-center justify-center shadow-sm shrink-0 mt-0.5">
              {severityStyle.icon}
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border ${severityStyle.badgeClass}`}>
                  {isHi ? severityStyle.labelHi : severityStyle.labelEn}
                </span>
                {loading && (
                  <span className="text-xs text-muted flex items-center gap-1 font-semibold">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Syncing sensor…
                  </span>
                )}
              </div>
              <p className="text-base sm:text-lg font-bold text-main leading-relaxed">
                {advisoryText}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
            <button
              onClick={handleSpeak}
              disabled={isSpeaking || !advisoryText}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer ${
                isSpeaking
                  ? 'bg-primary-green text-white border-primary-green animate-pulse'
                  : 'bg-card hover:bg-subtle text-main border-border-subtle'
              }`}
              title="Listen to advisory (Text-to-Speech)"
            >
              {isSpeaking ? (
                <div className="flex items-center gap-1 h-4 px-1">
                  <span className="w-1 bg-white rounded-full wave-1" />
                  <span className="w-1 bg-white rounded-full wave-2" />
                  <span className="w-1 bg-white rounded-full wave-3" />
                  <span className="w-1 bg-white rounded-full wave-4" />
                </div>
              ) : (
                <Volume2 className="w-4 h-4 text-primary-green" />
              )}
              <span>{isSpeaking ? (isHi ? 'सलाह बोल रहे हैं…' : 'Speaking Aloud…') : (isHi ? 'बोलकर सुनें' : 'Listen Aloud')}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
