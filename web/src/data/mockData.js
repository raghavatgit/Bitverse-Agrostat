// Mock Data Repository for Agrostat Digital Farming Platform

export const MARKET_COMMODITIES = [
  {
    id: "wheat",
    name: "Wheat (Lok-1)",
    category: "Cereals",
    currentPrice: 2450,
    unit: "Quintal (100 kg)",
    change24h: 3.2,
    predictedPrice30d: 2680,
    predictedChange: 9.38,
    trend: "BULLISH",
    recommendation: "HOLD",
    recommendationText: "High demand expected in major wholesale mandis over next 14 days. Best time to sell: Sept 2 - Sept 8.",
    volatility: "Low (1.4%)",
    optimalWindow: "Sept 02 - Sept 10",
    topMandis: [
      { name: "Khanna Mandi, Punjab", price: 2480, distance: "18 km" },
      { name: "Karnal Grain Market, HR", price: 2465, distance: "35 km" },
      { name: "Indore Mandi, MP", price: 2440, distance: "110 km" }
    ],
    history: [
      { date: "Aug 01", price: 2320, predicted: 2320 },
      { date: "Aug 05", price: 2360, predicted: 2355 },
      { date: "Aug 10", price: 2390, predicted: 2400 },
      { date: "Aug 15", price: 2410, predicted: 2420 },
      { date: "Aug 20", price: 2450, predicted: 2450 },
      { date: "Aug 25 (F)", price: 2490, predicted: 2510 },
      { date: "Aug 30 (F)", price: 2540, predicted: 2570 },
      { date: "Sept 05 (F)", price: 2610, predicted: 2640 },
      { date: "Sept 10 (F)", price: 2680, predicted: 2680 }
    ],
    factors: [
      "Government MSP increase of 7.2% announced.",
      "Lower grain stock reserves in central warehouses.",
      "Favorable export demand signals from Southeast Asia."
    ]
  },
  {
    id: "paddy",
    name: "Paddy Basmati (PB-1121)",
    category: "Cereals",
    currentPrice: 3820,
    unit: "Quintal (100 kg)",
    change24h: -0.8,
    predictedPrice30d: 4150,
    predictedChange: 8.64,
    trend: "BULLISH",
    recommendation: "HOLD",
    recommendationText: "Export orders opening next week. Prices expected to surge by ₹330/quintal.",
    volatility: "Medium (2.8%)",
    optimalWindow: "Sept 05 - Sept 15",
    topMandis: [
      { name: "Tarn Taran Mandi, PB", price: 3860, distance: "24 km" },
      { name: "Kaithal Mandi, HR", price: 3840, distance: "42 km" }
    ],
    history: [
      { date: "Aug 01", price: 3700, predicted: 3700 },
      { date: "Aug 05", price: 3750, predicted: 3740 },
      { date: "Aug 10", price: 3800, predicted: 3790 },
      { date: "Aug 15", price: 3850, predicted: 3830 },
      { date: "Aug 20", price: 3820, predicted: 3820 },
      { date: "Aug 25 (F)", price: 3890, predicted: 3910 },
      { date: "Aug 30 (F)", price: 3980, predicted: 4000 },
      { date: "Sept 05 (F)", price: 4080, predicted: 4100 },
      { date: "Sept 10 (F)", price: 4150, predicted: 4150 }
    ],
    factors: [
      "Export duty relaxation on Basmati shipments.",
      "High quality harvest report in North India.",
      "Global rice market supply tightness."
    ]
  },
  {
    id: "cotton",
    name: "Raw Cotton (Kapas)",
    category: "Fiber",
    currentPrice: 7100,
    unit: "Quintal (100 kg)",
    change24h: 1.5,
    predictedPrice30d: 6850,
    predictedChange: -3.52,
    trend: "BEARISH",
    recommendation: "SELL",
    recommendationText: "New harvest arrivals entering southern mandis. Sell existing stocks within 5 days to avoid downward price pressure.",
    volatility: "High (4.1%)",
    optimalWindow: "IMMEDIATE (Next 3 days)",
    topMandis: [
      { name: "Rajkot APMC, Gujarat", price: 7150, distance: "30 km" },
      { name: "Warangal Mandi, TS", price: 7110, distance: "65 km" }
    ],
    history: [
      { date: "Aug 01", price: 6900, predicted: 6900 },
      { date: "Aug 05", price: 6980, predicted: 6950 },
      { date: "Aug 10", price: 7050, predicted: 7030 },
      { date: "Aug 15", price: 7120, predicted: 7100 },
      { date: "Aug 20", price: 7100, predicted: 7100 },
      { date: "Aug 25 (F)", price: 7040, predicted: 7020 },
      { date: "Aug 30 (F)", price: 6950, predicted: 6920 },
      { date: "Sept 05 (F)", price: 6890, predicted: 6870 },
      { date: "Sept 10 (F)", price: 6850, predicted: 6850 }
    ],
    factors: [
      "Heavy arrivals expected from new picking season.",
      "Weak international textile demand.",
      "Sufficient domestic spinning mill inventory."
    ]
  },
  {
    id: "tomato",
    name: "Tomato (Hybrid Red)",
    category: "Vegetables",
    currentPrice: 1850,
    unit: "Quintal (100 kg)",
    change24h: 5.7,
    predictedPrice30d: 2600,
    predictedChange: 40.54,
    trend: "BULLISH",
    recommendation: "HOLD",
    recommendationText: "Monsoon rain damage in key supplying clusters will drive prices sharp upward. High profit potential.",
    volatility: "Very High (8.5%)",
    optimalWindow: "Sept 01 - Sept 12",
    topMandis: [
      { name: "Kolar APMC, Karnataka", price: 1920, distance: "28 km" },
      { name: "Madanapalle, AP", price: 1880, distance: "50 km" }
    ],
    history: [
      { date: "Aug 01", price: 1400, predicted: 1400 },
      { date: "Aug 05", price: 1520, predicted: 1500 },
      { date: "Aug 10", price: 1680, predicted: 1650 },
      { date: "Aug 15", price: 1750, predicted: 1760 },
      { date: "Aug 20", price: 1850, predicted: 1850 },
      { date: "Aug 25 (F)", price: 2050, predicted: 2080 },
      { date: "Aug 30 (F)", price: 2280, predicted: 2300 },
      { date: "Sept 05 (F)", price: 2490, predicted: 2520 },
      { date: "Sept 10 (F)", price: 2600, predicted: 2600 }
    ],
    factors: [
      "Rain damage reported in Southern producing districts.",
      "Increased urban restaurant & processor demand.",
      "Short supply lifecycle creates rapid price spikes."
    ]
  },
  {
    id: "potato",
    name: "Potato (Jyoti Fresh)",
    category: "Vegetables",
    currentPrice: 1420,
    unit: "Quintal (100 kg)",
    change24h: 0.4,
    predictedPrice30d: 1580,
    predictedChange: 11.27,
    trend: "BULLISH",
    recommendation: "HOLD",
    recommendationText: "Cold storage withdrawals steady. Festive season demand beginning in late August.",
    volatility: "Low (1.8%)",
    optimalWindow: "Sept 10 - Sept 20",
    topMandis: [
      { name: "Agra APMC, UP", price: 1450, distance: "12 km" },
      { name: "Hooghly Market, WB", price: 1410, distance: "45 km" }
    ],
    history: [
      { date: "Aug 01", price: 1350, predicted: 1350 },
      { date: "Aug 05", price: 1370, predicted: 1365 },
      { date: "Aug 10", price: 1390, predicted: 1385 },
      { date: "Aug 15", price: 1410, predicted: 1410 },
      { date: "Aug 20", price: 1420, predicted: 1420 },
      { date: "Aug 25 (F)", price: 1460, predicted: 1470 },
      { date: "Aug 30 (F)", price: 1500, predicted: 1510 },
      { date: "Sept 05 (F)", price: 1540, predicted: 1550 },
      { date: "Sept 10 (F)", price: 1580, predicted: 1580 }
    ],
    factors: [
      "Consistent cold storage release pace.",
      "Upcoming festival surge across North India."
    ]
  }
];

export const CURRENT_WEATHER = {
  location: "Ludhiana District, Punjab",
  temp: 29,
  condition: "Partly Cloudy",
  humidity: 74,
  windSpeed: "14 km/h SW",
  rainProbability: 35,
  soilTemp: "24.5 °C",
  soilMoisture: "68% (Optimal)",
  uvIndex: "6 (Moderate)",
  forecast: [
    { day: "Today", temp: "30° / 24°", condition: "Partly Cloudy", rainProb: 35, icon: "cloud-sun", sprayWindow: "GOOD (07:00 - 11:00)" },
    { day: "Tomorrow", temp: "32° / 25°", condition: "Scattered Showers", rainProb: 70, icon: "cloud-rain", sprayWindow: "POOR (Rain expected)" },
    { day: "Saturday", temp: "31° / 23°", condition: "Heavy Thunderstorms", rainProb: 85, icon: "cloud-lightning", sprayWindow: "AVOID (High wind & rain)" },
    { day: "Sunday", temp: "28° / 22°", condition: "Light Rain", rainProb: 40, icon: "cloud-drizzle", sprayWindow: "MODERATE (After 14:00)" },
    { day: "Monday", temp: "29° / 23°", condition: "Sunny & Clear", rainProb: 10, icon: "sun", sprayWindow: "EXCELLENT" },
    { day: "Tuesday", temp: "31° / 24°", condition: "Sunny", rainProb: 5, icon: "sun", sprayWindow: "EXCELLENT" },
    { day: "Wednesday", temp: "32° / 25°", condition: "Partly Cloudy", rainProb: 20, icon: "cloud-sun", sprayWindow: "GOOD" }
  ],
  advisories: [
    {
      id: "adv-1",
      severity: "WARNING",
      title: "Pest Attack Warning: Yellow Rust & Aphids Risk",
      description: "High morning humidity (78%) and evening dew points create high vulnerability for wheat and vegetable crops.",
      action: "Apply prophylactic Neem oil (5ml/L) or Propiconazole 25% EC (1ml/L) during dry window on Monday."
    },
    {
      id: "adv-2",
      severity: "INFO",
      title: "Irrigation Advisory",
      description: "Scattered thunderstorms expected Saturday. Hold off field irrigation for the next 48 hours to prevent waterlogging.",
      action: "Ensure proper drainage channels are clear around low-lying field plots."
    }
  ]
};

export const SAMPLE_SOIL_RECOMMENDATIONS = [
  {
    crop: "Chickpea (Desi Chana)",
    suitability: 96,
    yieldEstimate: "9 - 11 Quintals / Acre",
    marketPriceAvg: "₹5,400 / Quintal",
    expectedRevenuePerAcre: "₹54,000",
    waterRequirement: "Low (2-3 Irrigations)",
    duration: "110 - 120 Days",
    keyBenefits: "Fixes atmospheric nitrogen into soil. Requires minimal chemical fertilizer. Ideal for low rain forecasts.",
    fertilizerPlan: "DAP: 40 kg/acre at sowing; Zinc Sulphate: 10 kg/acre.",
    matchingSoilTypes: ["Sandy Loam", "Loam", "Black Soil"]
  },
  {
    crop: "Mustard (Pusa Bold)",
    suitability: 91,
    yieldEstimate: "7 - 9 Quintals / Acre",
    marketPriceAvg: "₹5,850 / Quintal",
    expectedRevenuePerAcre: "₹46,800",
    waterRequirement: "Low to Moderate",
    duration: "125 - 135 Days",
    keyBenefits: "High oil content (42%), excellent market demand, low pest resistance risk.",
    fertilizerPlan: "Urea: 35 kg/acre (split dosage); Single Super Phosphate (SSP): 100 kg/acre.",
    matchingSoilTypes: ["Loam", "Clay Loam", "Alluvial"]
  },
  {
    crop: "Wheat (HD-2967)",
    suitability: 84,
    yieldEstimate: "18 - 22 Quintals / Acre",
    marketPriceAvg: "₹2,450 / Quintal",
    expectedRevenuePerAcre: "₹49,000",
    waterRequirement: "High (5-6 Irrigations)",
    duration: "140 - 150 Days",
    keyBenefits: "Staple crop, guaranteed government MSP purchase, high straw biomass value.",
    fertilizerPlan: "Urea: 90 kg/acre (3 splits); DAP: 55 kg/acre; MOP: 20 kg/acre.",
    matchingSoilTypes: ["Alluvial", "Clay Loam", "Deep Loam"]
  }
];

export const MARKETPLACE_ITEMS = [
  {
    id: "item-1",
    type: "INPUT",
    title: "Certified Hybrid Maize Seeds (Bio-737)",
    category: "Seeds",
    price: 850,
    unit: "4 kg Bag",
    rating: 4.8,
    reviewsCount: 142,
    seller: "AgriTech Certified Seeds Co.",
    verifiedSeller: true,
    location: "Karnal, Haryana",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80",
    description: "High germination rate (>90%), drought resistant hybrid maize seed suitable for Kharif & Rabi season.",
    inStock: true,
    badge: "BESTSELLER"
  },
  {
    id: "item-2",
    type: "INPUT",
    title: "Organic Bio-NPK Granular Fertilizer",
    category: "Fertilizers",
    price: 620,
    unit: "50 kg Bag",
    rating: 4.9,
    reviewsCount: 98,
    seller: "GreenEarth Organics",
    verifiedSeller: true,
    location: "Ludhiana, Punjab",
    image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80",
    description: "Enriched with Mycorrhiza and bio-decomposers. Boosts soil microbial activity and root expansion.",
    inStock: true,
    badge: "ORGANIC"
  },
  {
    id: "item-3",
    type: "INPUT",
    title: "Solar Automatic Drip Irrigation Controller Kit",
    category: "Machinery & Equipment",
    price: 4990,
    unit: "Complete Kit (1 Acre)",
    rating: 4.7,
    reviewsCount: 54,
    seller: "SunSmart Irrigation",
    verifiedSeller: true,
    location: "Jaipur, Rajasthan",
    image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80",
    description: "Smart smartphone-controlled solenoid valve with moisture sensor trigger. Saves up to 55% water.",
    inStock: true,
    badge: "50% SUBSIDY ELIGIBLE"
  },
  {
    id: "item-4",
    type: "PRODUCE",
    title: "Organic Premium Basmati Paddy (A-Grade)",
    category: "Farm Output Produce",
    price: 3950,
    unit: "Quintal",
    rating: 5.0,
    reviewsCount: 19,
    seller: "Sardar Gurmail Singh (Farmer)",
    verifiedSeller: true,
    location: "Amritsar, Punjab",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    description: "Direct farm produce. Grain length 8.3mm, zero chemical pesticide spray residue. Moisture 12.5%. Available quantity: 120 Quintals.",
    inStock: true,
    badge: "DIRECT FROM FARMER"
  },
  {
    id: "item-5",
    type: "PRODUCE",
    title: "Fresh Harvest Farm Tomatoes (Red Hybrid)",
    category: "Farm Output Produce",
    price: 1800,
    unit: "Quintal",
    rating: 4.6,
    reviewsCount: 31,
    seller: "Ramesh Agriculture Farm",
    verifiedSeller: true,
    location: "Nashik, Maharashtra",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
    description: "Firm skin, long shelf life tomatoes ready for wholesale bulk dispatch. Packed in 25kg crates.",
    inStock: true,
    badge: "FRESH HARVEST"
  }
];

export const AGROBOT_FAQS = [
  {
    question: "How do I control yellowing of leaves in my wheat crop?",
    answer: "Leaf yellowing can be due to Nitrogen deficiency or Yellow Rust fungal attack. Check if there are powdery yellow streaks on the underside. If streaks exist, spray Propiconazole 25% EC @ 200 ml in 200 Liters of water per acre. If uniform yellowing, apply top-dressing Urea @ 25 kg/acre with 1 kg Zinc Sulphate."
  },
  {
    question: "What is the PM-KISAN scheme eligibility and how to check status?",
    answer: "PM-KISAN provides ₹6,000 annually in three equal installments of ₹2,000 to landholding farmer families. You can check your status using your Aadhaar number or Mobile number on the official pmkisan.gov.in portal or via Agrostat's scheme tracker."
  },
  {
    question: "How do I calculate recommended NPK fertilizer dosage for my field?",
    answer: "Use Agrostat's Crop Recommendation module! Input your soil test values (N, P, K in kg/ha). Generally, standard Rabi Wheat requires 120 kg N, 60 kg P2O5, and 40 kg K2O per hectare (approx 50kg Urea, 30kg DAP per acre)."
  }
];
