/**
 * Agrostat Data Services Module
 * Connects frontend directly to FastAPI Backend (:8000) with seamless offline fallback.
 */

const API_BASE_URL = 'http://localhost:8000';

// Fallback delay helper
const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

const FIREBASE_RTDB_URL = 'https://agrostat-42043-default-rtdb.firebaseio.com/sensorReadings/latest.json';

/**
 * Fetches latest ESP32 telemetry prioritizing live local USB hardware stream
 */
export async function getLatestTelemetry() {
  // 1. Prioritize FastAPI local backend (Live physical USB serial stream from ESP32)
  try {
    const res = await fetch(`${API_BASE_URL}/api/telemetry/latest`, { signal: AbortSignal.timeout(1200) });
    if (res.ok) {
      const data = await res.json();
      if (data && data.temperature != null) {
        return data;
      }
    }
  } catch (err) {
    // Continue to Firebase RTDB cloud fallback
  }

  // 2. Fallback to direct Firebase Realtime Database cloud
  try {
    const fbRes = await fetch(FIREBASE_RTDB_URL, { signal: AbortSignal.timeout(1500) });
    if (fbRes.ok) {
      const fbData = await fbRes.json();
      if (fbData && (fbData.temperature != null || fbData.soil_moisture_raw != null || fbData.soil_moisture_pct != null)) {
        return fbData;
      }
    }
  } catch (fbErr) {
    // Continue to default
  }

  return {
    device_id: "AGRO_ESP32_NODE_01",
    temperature: 28.4,
    humidity: 62.0,
    soil_moisture_raw: 2100,
    soil_moisture_pct: 49,
    heat_index: 34.6,
    status: "NORMAL",
    alert_code: "NONE",
    timestamp: new Date().toISOString()
  };
}

/**
 * Precision VPD & Loss Risk Evaluation from FastAPI Backend
 */
export async function evaluateLossRisk(temperature, humidity, soilMoistureRaw = 2100, cropName = "Wheat") {
  try {
    const res = await fetch(`${API_BASE_URL}/api/loss-prevention/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        temperature: Number(temperature),
        humidity: Number(humidity),
        soil_moisture_raw: Number(soilMoistureRaw),
        crop_name: cropName
      }),
      signal: AbortSignal.timeout(2000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Handled in component
  }
  return null;
}

/**
 * Fetches 30-day commodity price forecast data and selling recommendation for a given crop
 */
export async function getPriceForecast(crop = 'wheat') {
  const normalizedCrop = String(crop).toLowerCase().trim();

  // Try fetching dynamic arbitrage optimization from backend
  try {
    const res = await fetch(`${API_BASE_URL}/api/arbitrage/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crop: crop.charAt(0).toUpperCase() + crop.slice(1).toLowerCase(),
        lot_size_quintals: 100.0,
        current_mandi_price: normalizedCrop === 'tomato' ? 1850 : (normalizedCrop === 'cotton' ? 7100 : 2450)
      }),
      signal: AbortSignal.timeout(2000)
    });
    if (res.ok) {
      const liveArbitrage = await res.json();
      const baseObj = getStaticPriceDataset(normalizedCrop);
      return {
        ...baseObj,
        currentPrice: liveArbitrage.local_mandi_price,
        liveArbitrageData: liveArbitrage
      };
    }
  } catch (err) {
    // Fall back to offline dataset
  }

  await delay(150);
  return getStaticPriceDataset(normalizedCrop);
}

function getStaticPriceDataset(normalizedCrop) {
  const dataset = {
    wheat: {
      crop: "Wheat (Lok-1 / HD-2967)",
      category: "Cereals",
      currentPrice: 2450,
      unit: "Quintal",
      change24h: 3.2,
      predictedPrice30d: 2680,
      predictedChangePct: 9.38,
      trend: "BULLISH",
      recommendation: "HOLD",
      recommendationText: "High demand expected in major APMC mandis over next 14 days due to tight central reserves.",
      optimalSellingWindow: "Sept 02 - Sept 10",
      volatility: "Low (1.4%)",
      history: [
        { date: "Aug 01", price: 2320 },
        { date: "Aug 05", price: 2360 },
        { date: "Aug 10", price: 2390 },
        { date: "Aug 15", price: 2410 },
        { date: "Aug 20", price: 2450 },
        { date: "Aug 25 (F)", price: 2510 },
        { date: "Aug 30 (F)", price: 2570 },
        { date: "Sept 05 (F)", price: 2640 },
        { date: "Sept 10 (F)", price: 2680 }
      ]
    },
    rice: {
      crop: "Paddy Basmati (PB-1121)",
      category: "Cereals",
      currentPrice: 3820,
      unit: "Quintal",
      change24h: -0.8,
      predictedPrice30d: 4150,
      predictedChangePct: 8.64,
      trend: "BULLISH",
      recommendation: "HOLD",
      recommendationText: "Export duty relaxation on Basmati shipments will surge market rates next week.",
      optimalSellingWindow: "Sept 05 - Sept 15",
      volatility: "Medium (2.8%)",
      history: [
        { date: "Aug 01", price: 3700 },
        { date: "Aug 05", price: 3750 },
        { date: "Aug 10", price: 3800 },
        { date: "Aug 15", price: 3850 },
        { date: "Aug 20", price: 3820 },
        { date: "Aug 25 (F)", price: 3910 },
        { date: "Aug 30 (F)", price: 4000 },
        { date: "Sept 05 (F)", price: 4100 },
        { date: "Sept 10 (F)", price: 4150 }
      ]
    },
    cotton: {
      crop: "Raw Cotton (Kapas)",
      category: "Fiber",
      currentPrice: 7100,
      unit: "Quintal",
      change24h: 1.5,
      predictedPrice30d: 6850,
      predictedChangePct: -3.52,
      trend: "BEARISH",
      recommendation: "SELL",
      recommendationText: "New harvest arrivals entering southern mandis. Sell stocks within 5 days to avoid downward price pressure.",
      optimalSellingWindow: "IMMEDIATE (Next 3 days)",
      volatility: "High (4.1%)",
      history: [
        { date: "Aug 01", price: 6900 },
        { date: "Aug 05", price: 6980 },
        { date: "Aug 10", price: 7050 },
        { date: "Aug 15", price: 7120 },
        { date: "Aug 20", price: 7100 },
        { date: "Aug 25 (F)", price: 7020 },
        { date: "Aug 30 (F)", price: 6920 },
        { date: "Sept 05 (F)", price: 6870 },
        { date: "Sept 10 (F)", price: 6850 }
      ]
    },
    tomato: {
      crop: "Tomato (Hybrid Red)",
      category: "Vegetables",
      currentPrice: 1850,
      unit: "Quintal",
      change24h: 5.7,
      predictedPrice30d: 2600,
      predictedChangePct: 40.54,
      trend: "BULLISH",
      recommendation: "HOLD",
      recommendationText: "Monsoon rain damage in major producing clusters will trigger sharp supply shortages.",
      optimalSellingWindow: "Sept 01 - Sept 12",
      volatility: "Very High (8.5%)",
      history: [
        { date: "Aug 01", price: 1400 },
        { date: "Aug 05", price: 1520 },
        { date: "Aug 10", price: 1680 },
        { date: "Aug 15", price: 1750 },
        { date: "Aug 20", price: 1850 },
        { date: "Aug 25 (F)", price: 2080 },
        { date: "Aug 30 (F)", price: 2300 },
        { date: "Sept 05 (F)", price: 2520 },
        { date: "Sept 10 (F)", price: 2600 }
      ]
    }
  };

  return dataset[normalizedCrop] || dataset['wheat'];
}

/**
 * Recommends optimal crops based on field location, soil type, and target season
 */
export async function recommendCrops(location = 'Punjab', soilType = 'Loam', season = 'Rabi') {
  try {
    const res = await fetch(`${API_BASE_URL}/api/crops/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location,
        soil_type: soilType,
        season
      }),
      signal: AbortSignal.timeout(2000)
    });
    if (res.ok) {
      const data = await res.json();
      return data.map(item => ({
        crop: item.crop,
        suitabilityScore: item.suitability_score,
        expectedYield: item.expected_yield,
        estimatedProfitPerAcre: item.estimated_profit_per_acre,
        riskLevel: item.risk_level,
        riskReason: item.risk_reason,
        waterRequirement: item.water_requirement,
        durationDays: item.duration_days,
        recommendedFertilizer: item.recommended_fertilizer
      }));
    }
  } catch (err) {
    // Fall back to offline model
  }

  await delay(200);
  const normSoil = String(soilType).toLowerCase();
  const normSeason = String(season).toLowerCase();

  const allCrops = [
    {
      crop: "Wheat (HD-2967 / PBW-550)",
      suitabilityScore: normSoil.includes('loam') || normSeason.includes('rabi') ? 95 : 82,
      expectedYield: "20 - 24 Quintals / Acre",
      estimatedProfitPerAcre: "₹34,000 – ₹42,000",
      riskLevel: "Low",
      riskReason: "Guaranteed MSP procurement at ₹2,275/Qtl with established APMC supply chains.",
      waterRequirement: "Medium",
      durationDays: "135 - 145 Days",
      recommendedFertilizer: "NPK 120:60:40 kg/ha + Zinc Sulphate @ 10 kg/acre"
    },
    {
      crop: "Mustard (Pusa Bold / RH-749)",
      suitabilityScore: normSoil.includes('loam') || normSoil.includes('sandy') ? 92 : 84,
      expectedYield: "7 - 9 Quintals / Acre",
      estimatedProfitPerAcre: "₹36,000 – ₹45,000",
      riskLevel: "Medium",
      riskReason: "Low water requirement, high market return potential.",
      waterRequirement: "Low",
      durationDays: "115 - 125 Days",
      recommendedFertilizer: "Urea @ 35 kg/acre + Single Super Phosphate @ 100 kg/acre + Sulphur 20 kg/ha"
    },
    {
      crop: "Paddy / Basmati (PB-1121)",
      suitabilityScore: normSeason.includes('kharif') ? 94 : 78,
      expectedYield: "18 - 22 Quintals / Acre",
      estimatedProfitPerAcre: "₹45,000 – ₹58,000",
      riskLevel: "Medium",
      riskReason: "High water and power requirement; commanding export price premium.",
      waterRequirement: "High",
      durationDays: "140 - 150 Days",
      recommendedFertilizer: "NPK 120:50:50 kg/ha + Zinc at transplanting stage."
    },
    {
      crop: "Hybrid Red Tomato",
      suitabilityScore: normSeason.includes('zaid') || normSeason.includes('rabi') ? 88 : 75,
      expectedYield: "160 - 200 Quintals / Acre",
      estimatedProfitPerAcre: "₹60,000 – ₹85,000",
      riskLevel: "High",
      riskReason: "Perishable commodity with high price volatility; requires staking and pest monitoring.",
      waterRequirement: "Medium",
      durationDays: "90 - 110 Days",
      recommendedFertilizer: "NPK 150:100:100 kg/ha + Micronutrient boron spray during flowering."
    }
  ];

  return allCrops.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}

/**
 * Queries AIKosh KCC Verified NLP from FastAPI backend
 */
export async function queryAgroBotAI(userQuery, language = "EN") {
  try {
    const res = await fetch(`${API_BASE_URL}/api/agrobot/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: userQuery,
        language: language
      }),
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Handled in component
  }
  return null;
}
