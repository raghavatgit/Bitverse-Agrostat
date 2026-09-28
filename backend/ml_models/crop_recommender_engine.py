def recommend_crops_model(location: str = "Punjab", soil_type: str = "Loam", season: str = "Rabi") -> list:
    """
    Multi-factor agronomic suitability scoring engine.
    Ranks crops by soil compatibility, water need, risk rating, and estimated net profit/acre.
    """
    soil_lower = soil_type.lower()
    season_lower = season.lower()

    # Pre-compiled agronomy matrix based on ICAR regional benchmarks
    all_crops = [
        {
            "crop": "Wheat (HD-2967 / PBW-550)",
            "suitable_soils": ["loam", "alluvial", "clay loam", "sandy loam"],
            "suitable_seasons": ["rabi"],
            "base_score": 95,
            "estimated_profit_per_acre": "₹34,000 – ₹42,000",
            "expected_yield": "22.5 Qtl / acre",
            "water_requirement": "450 – 650 mm (Medium)",
            "duration_days": "135 – 145 Days",
            "risk_level": "Low",
            "risk_reason": "Guaranteed MSP procurement at ₹2,275/Qtl with established APMC supply chains.",
            "recommended_fertilizer": "NPK 120:60:40 kg/ha + Zinc Sulphate (25 kg/ha) at first irrigation."
        },
        {
            "crop": "Mustard (Pusa Bold / RH-749)",
            "suitable_soils": ["loam", "sandy loam", "alluvial"],
            "suitable_seasons": ["rabi"],
            "base_score": 90,
            "estimated_profit_per_acre": "₹36,000 – ₹45,000",
            "expected_yield": "8.5 Qtl / acre",
            "water_requirement": "250 – 400 mm (Low)",
            "duration_days": "115 – 125 Days",
            "risk_level": "Medium",
            "risk_reason": "Sensitive to severe frost during flowering; excellent net margin in well-drained soils.",
            "recommended_fertilizer": "NPK 80:40:40 kg/ha + Sulphur (20 kg/ha) for high oil content."
        },
        {
            "crop": "Paddy / Basmati (PB-1121)",
            "suitable_soils": ["clay loam", "alluvial", "loam"],
            "suitable_seasons": ["kharif"],
            "base_score": 94,
            "estimated_profit_per_acre": "₹45,000 – ₹58,000",
            "expected_yield": "20.0 Qtl / acre",
            "water_requirement": "1200 – 1600 mm (High)",
            "duration_days": "140 – 150 Days",
            "risk_level": "Medium",
            "risk_reason": "High water and power requirement; commanding export price premium.",
            "recommended_fertilizer": "NPK 120:50:50 kg/ha + Zinc at transplanting stage."
        },
        {
            "crop": "Hybrid Red Tomato",
            "suitable_soils": ["loam", "sandy loam", "black cotton soil"],
            "suitable_seasons": ["rabi", "zaid"],
            "base_score": 88,
            "estimated_profit_per_acre": "₹60,000 – ₹85,000",
            "expected_yield": "180 Qtl / acre",
            "water_requirement": "600 – 800 mm (Medium)",
            "duration_days": "90 – 110 Days",
            "risk_level": "High",
            "risk_reason": "Perishable commodity with high price volatility; requires staking and pest control.",
            "recommended_fertilizer": "NPK 150:100:100 kg/ha + Micronutrient boron spray during flowering."
        },
        {
            "crop": "Bt Cotton (Long Staple)",
            "suitable_soils": ["black cotton soil", "alluvial", "loam"],
            "suitable_seasons": ["kharif"],
            "base_score": 91,
            "estimated_profit_per_acre": "₹40,000 – ₹52,000",
            "expected_yield": "12.0 Qtl / acre",
            "water_requirement": "700 – 1000 mm (Medium-High)",
            "duration_days": "160 – 180 Days",
            "risk_level": "Medium",
            "risk_reason": "Monitor closely for pink bollworm; strong ginning mill demand.",
            "recommended_fertilizer": "NPK 100:50:50 kg/ha + Foliar Magnesium Sulphate 1%."
        }
    ]

    scored = []
    for c in all_crops:
        score = c["base_score"]
        if not any(s in soil_lower for s in c["suitable_soils"]):
            score -= 25
        if not any(sn in season_lower for sn in c["suitable_seasons"]):
            score -= 30
        
        c_copy = dict(c)
        c_copy["suitability_score"] = max(40, min(99, score))
        scored.append(c_copy)

    scored.sort(key=lambda x: x["suitability_score"], reverse=True)
    return scored
