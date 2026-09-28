/**
 * AGROSTAT Bilingual Translation Dictionary (EN / HI)
 * Carefully calibrated for Indian farmers with clear, culturally natural terminology.
 */

export const TRANSLATIONS = {
  EN: {
    // Brand & Header
    brandTagline: "Digital Farming Assistant & Market Intelligence",
    liveAi: "LIVE AI",
    login: "Login / Sign Up",
    logout: "Sign Out",
    guestFarmer: "Guest Farmer",
    farmer: "🌾 Farmer",
    buyer: "🏢 Buyer",
    viewProfile: "View Profile",
    toggleTheme: "Toggle Theme",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    switchToHindi: "Switch to हिन्दी",
    switchToEnglish: "Switch to English",

    // Navigation Tabs
    tabs: {
      home: "Home & Field Advisory",
      prices: "Crop Mandi Prices",
      crops: "Crop Recommendation",
      market: "Direct Marketplace",
      profile: "Farmer Profile",
      agrobot: "AgroBot AI Assistant"
    },

    // Sensor Banner & Telemetry
    sensor: {
      title: "Real-time Field Telemetry",
      subtitle: "Live microclimate signals from your field IoT node",
      connected: "IoT Node Connected (USB/Cloud)",
      offline: "Offline - Using Forecast Data",
      temperature: "Temperature",
      humidity: "Relative Humidity",
      soilMoisture: "Soil Moisture",
      heatIndex: "Heat Index",
      motion: "Intrusion / Motion",
      noMotion: "Secure (No Motion)",
      motionAlert: "Movement in Field!",
      safe: "Safe & Optimal",
      warning: "Advisory Warning",
      danger: "Critical Microclimate Alert",
      listenBtn: "Listen in English",
      speaking: "Speaking Advisory...",
      simulatedMode: "Demo Simulation Mode",
      testHeat: "Simulate Heat Stress",
      testNormal: "Simulate Normal",
      testFrost: "Simulate Frost Risk"
    },

    // Price Prediction Tab
    prices: {
      title: "30-Day Mandi Price Projections",
      subtitle: "Machine learning price forecasts to time your harvest sales and maximize profits",
      selectCrop: "Select Crop Commodity",
      currentRate: "Current Mandi Rate",
      predictedRate: "Projected 30-Day Rate",
      targetDelta: "Expected Growth",
      trendBullish: "Rising (Bullish Trend)",
      trendBearish: "Cooling (Bearish Trend)",
      holdBadge: "⏳ HOLD STOCKS — HIGHER PRICE COMING",
      sellBadge: "✅ SELL NOW — PEAK MANDI RATE",
      bestWindow: "Optimal Selling Window",
      volatility: "Market Volatility",
      historyVsForecast: "Historical vs. Projected Price Curve",
      pastDays: "Past 20 Days",
      forecast30: "Next 30 Days Forecast",
      modelMetricsBtn: "🔬 View AI Model Diagnostics & Backtest",
      modelAccuracy: "89.4% Accuracy",
      mae: "MAE: ₹82.40 / quintal",
      rmse: "RMSE: ₹114.10"
    },

    // Crop Recommendation Tab
    crops: {
      title: "Smart Crop Suitability & Profit Planner",
      subtitle: "Match your soil characteristics & upcoming season to find top-profit, low-risk crops",
      state: "State / District",
      soilType: "Soil Type",
      season: "Farming Season",
      landArea: "Cultivation Area (Acres)",
      calculateBtn: "Find Best Crops for Field",
      calculating: "Analyzing Agro-Climatic Parameters...",
      topMatches: "Top Recommended Crops for Your Land",
      suitability: "Suitability Match",
      estYield: "Estimated Yield",
      estCost: "Production Cost",
      netProfit: "Projected Net Profit",
      riskLevel: "Risk Level",
      lowRisk: "🟢 Low Risk (Stable)",
      medRisk: "🟡 Medium Care Needed",
      highRisk: "🔴 High Care & Vigilance",
      reasons: "Why this crop?"
    },

    // Direct Marketplace Tab
    market: {
      title: "Direct Farmer-to-Buyer Marketplace",
      subtitle: "Sell harvest directly to verified wholesalers, millers, and retailers with transparent pricing",
      postProduceBtn: "+ Post Produce Listing",
      filterAll: "All Commodities",
      filterCereals: "Cereals & Grains",
      filterVegetables: "Vegetables",
      filterFibers: "Fibers (Cotton/Jute)",
      filterOilseeds: "Oilseeds & Pulses",
      mandiBenchmark: "Fair Mandi Benchmark",
      directBadge: "DIRECT FROM FARMER",
      contactFarmer: "Contact Seller",
      orderInquiry: "Direct Procurement Inquiry"
    },

    // AgroBot AI
    agrobot: {
      title: "AgroBot 24/7 AI Farming Assistant",
      subtitle: "Instant diagnosis for pest attacks, fertilizer dosages, and mandi rates",
      placeholder: "Ask AgroBot anything (e.g. wheat disease, urea dosage, tomato rates)...",
      micTooltip: "Click to speak query",
      online: "AgroBot Online",
      sampleQueries: [
        "How to treat yellow rust in wheat?",
        "What is the current tomato mandi price?",
        "How much NPK fertilizer for 2 acres of mustard?",
        "Latest PM-KISAN installment update"
      ]
    }
  },

  HI: {
    // Brand & Header
    brandTagline: "भारतीय किसान का डिजिटल साथी एवं मंडी भाव पूर्वानुमान",
    liveAi: "लाइव एआई",
    login: "लॉगिन / साइन अप",
    logout: "लॉग आउट",
    guestFarmer: "अतिथि किसान",
    farmer: "🌾 किसान",
    buyer: "🏢 खरीदार / व्यापारी",
    viewProfile: "प्रोफ़ाइल देखें",
    toggleTheme: "थीम बदलें",
    lightMode: "दिन की थीम (Light)",
    darkMode: "रात की थीम (Dark)",
    switchToHindi: "हिन्दी में बदलें",
    switchToEnglish: "Switch to English",

    // Navigation Tabs
    tabs: {
      home: "मुख्य पृष्ठ व खेत सलाह",
      prices: "मंडी भाव पूर्वानुमान",
      crops: "फसल चयन व लाभ योजना",
      market: "सीधा किसान बाज़ार",
      profile: "किसान प्रोफ़ाइल",
      agrobot: "एग्रोबॉट एआई सहायक"
    },

    // Sensor Banner & Telemetry
    sensor: {
      title: "खेत का लाइव सेंसर डेटा",
      subtitle: "खेत में लगे IoT नोड से तापमान, आर्द्रता व मौसम के सीधे संकेत",
      connected: "सेंसर सक्रिय जुड़ा है (USB/क्लाउड)",
      offline: "ऑफ़लाइन - मौसम पूर्वानुमान सक्रिय",
      temperature: "खेत का तापमान",
      humidity: "हवा में नमी (आर्द्रता)",
      soilMoisture: "मिट्टी की नमी",
      heatIndex: "गर्मी सूचकांक (Heat Index)",
      motion: "खेत में हलचल / निगरानी",
      noMotion: "सुरक्षित (कोई हलचल नहीं)",
      motionAlert: "खेत में हलचल देखी गई!",
      safe: "अनुकूल एवं सुरक्षित स्थिति",
      warning: "कृषि चेतावनी व सलाह",
      danger: "गंभीर चेतावनी - तुरंत ध्यान दें",
      listenBtn: "सलाह सुनें (आवाज़ में)",
      speaking: "सलाह सुनाई जा रही है...",
      simulatedMode: "डेमो सिमुलेशन मोड",
      testHeat: "गर्मी तनाव टेस्ट",
      testNormal: "सामान्य स्थिति",
      testFrost: "पाला/ठंड चेतावनी"
    },

    // Price Prediction Tab
    prices: {
      title: "30-दिवसीय मंडी भाव पूर्वानुमान",
      subtitle: "मशीन लर्निंग द्वारा जानें कब और किस मंडी में फसल बेचने पर मिलेगा सबसे ज्यादा दाम",
      selectCrop: "फसल चुनें",
      currentRate: "वर्तमान मंडी भाव",
      predictedRate: "30 दिन बाद संभावित भाव",
      targetDelta: "अपेक्षित बढ़ोत्तरी",
      trendBullish: "दाम बढ़ने के आसार (तेजी)",
      trendBearish: "दाम घटने के आसार (मंदी)",
      holdBadge: "⏳ फसल रोक कर रखें — आगे दाम बढ़ेंगे",
      sellBadge: "✅ अभी बेचें — उत्तम मंडी भाव",
      bestWindow: "बिक्री का सर्वोत्तम समय",
      volatility: "बाज़ार का उतार-चढ़ाव",
      historyVsForecast: "मंडी भाव का इतिहास व आगे का रुझान",
      pastDays: "पिछले 20 दिन",
      forecast30: "अगले 30 दिनों का अनुमान",
      modelMetricsBtn: "🔬 एआई मॉडल सटीकता व मेट्रिक्स देखें",
      modelAccuracy: "89.4% मॉडल सटीकता",
      mae: "त्रुटि दर (MAE): ₹82.40 / क्विंटल",
      rmse: "मानक विचलन: ₹114.10"
    },

    // Crop Recommendation Tab
    crops: {
      title: "खेत के लिए सबसे उपयुक्त फसल व लाभ",
      subtitle: "मिट्टी की किस्म और मौसम के आधार पर अधिकतम पैदावार व शुद्ध मुनाफे वाली फसल चुनें",
      state: "राज्य / ज़िला",
      soilType: "मिट्टी का प्रकार",
      season: "बुवाई का मौसम",
      landArea: "खेत का रकबा (एकड़ में)",
      calculateBtn: "सबसे उपयुक्त फसलें खोजें",
      calculating: "खेत के आंकड़ों का विश्लेषण जारी है...",
      topMatches: "आपके खेत के लिए सर्वश्रेष्ठ फसलें",
      suitability: "अनुकूलता स्कोर",
      estYield: "अनुमानित पैदावार",
      estCost: "लागत प्रति एकड़",
      netProfit: "अनुमानित शुद्ध मुनाफा",
      riskLevel: "जोखिम स्तर",
      lowRisk: "🟢 कम जोखिम (सुरक्षित)",
      medRisk: "🟡 मध्यम देखरेख आवश्यक",
      highRisk: "🔴 उच्च देखरेख व सतर्कता",
      reasons: "यह फसल क्यों चुनें?"
    },

    // Direct Marketplace Tab
    market: {
      title: "सीधा किसान-खरीदार बाज़ार (बिना बिचौलिए)",
      subtitle: "अपनी उपज को सीधे बड़े व्यापारियों, मिलों और प्रसंस्करण कंपनियों को पारदर्शी भाव में बेचें",
      postProduceBtn: "+ अपनी फसल बिक्री के लिए जोड़ें",
      filterAll: "सभी फसलें",
      filterCereals: "अनाज (गेहूं/चावल)",
      filterVegetables: "सब्जियां",
      filterFibers: "कपास / रेशेदार",
      filterOilseeds: "तिलहन व दालें",
      mandiBenchmark: "उचित मंडी आधार मूल्य",
      directBadge: "सीधे किसान के खेत से",
      contactFarmer: "किसान से संपर्क करें",
      orderInquiry: "खरीद पूछताछ भेजें"
    },

    // AgroBot AI
    agrobot: {
      title: "एग्रोबॉट 24/7 एआई किसान मित्र",
      subtitle: "फसल रोग, खाद की सही मात्रा और मंडी भाव का तुरंत समाधान पाएं",
      placeholder: "एग्रोबॉट से कुछ भी पूछें (उदा. गेहूं में पीला रतुआ, यूरिया की मात्रा, टमाटर का भाव)...",
      micTooltip: "बोलकर पूछने के लिए माइक दबाएं",
      online: "एग्रोबॉट सक्रिय है",
      sampleQueries: [
        "गेहूं में पीला रतुआ रोग का उपचार क्या है?",
        "आज टमाटर का मंडी भाव क्या चल रहा है?",
        "2 एकड़ सरसों के लिए NPK खाद की मात्रा कितनी डालें?",
        "पीएम-किसान योजना की अगली किस्त कब आएगी?"
      ]
    }
  }
};

export function getTranslation(lang = 'EN') {
  return TRANSLATIONS[lang] || TRANSLATIONS.EN;
}
