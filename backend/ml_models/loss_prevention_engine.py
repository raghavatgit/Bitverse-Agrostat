import math
import json
import os

# Load ICAR disease matrix
DATASET_PATH = os.path.join(os.path.dirname(__file__), '..', 'datasets', 'icar_disease_vpd_matrix.json')

def calculate_vpd(temp_c: float, humidity_pct: float) -> float:
    """
    Calculates Vapor Pressure Deficit (VPD) in kiloPascals (kPa).
    VPD is the absolute standard in precision agronomy for predicting fungal spore germination.
    Low VPD (<0.4 kPa) with high humidity indicates water condensation on leaf surface.
    """
    vp_sat = 0.61078 * math.exp((17.27 * temp_c) / (temp_c + 237.3))
    vp_act = vp_sat * (humidity_pct / 100.0)
    vpd = max(0.0, vp_sat - vp_act)
    return round(vpd, 3)

def evaluate_crop_loss_risk(temp_c: float, humidity_pct: float, soil_raw: int = 2100, crop_name: str = "Wheat") -> dict:
    """
    Fuses ESP32 sensor telemetry with ICAR disease incubation curves.
    Outputs: Risk level, VPD, Spoilage index, and Financial Loss Risk in INR.
    """
    vpd = calculate_vpd(temp_c, humidity_pct)
    soil_pct = max(0, min(100, round(100 - (soil_raw / 4095.0) * 100)))

    # Load matrix
    try:
        with open(DATASET_PATH, 'r', encoding='utf-8') as f:
            matrix = json.load(f).get("crop_thresholds", {})
    except Exception:
        matrix = {}

    crop_data = matrix.get(crop_name, matrix.get("Wheat", {}))
    heat_thresh = crop_data.get("heat_stress_threshold_c", 34.0)
    frost_thresh = crop_data.get("frost_risk_threshold_c", 5.0)
    diseases = crop_data.get("diseases", [])

    active_disease_alert = None
    risk_score = 15  # Base low risk
    financial_loss_inr = 0
    severity = "NORMAL"

    # 1. Thermal Stress Checks
    if temp_c >= heat_thresh:
        severity = "DANGER"
        risk_score = 88
        financial_loss_inr = 12000
        alert_title_en = "High Heat Evaporative Stress"
        alert_title_hi = "अत्यधिक तापमान वाष्पीकरण तनाव"
        alert_desc_en = f"Ambient field temp ({temp_c}°C) exceeds thermal threshold for {crop_name}. Cellular respiration rate spiking."
        alert_desc_hi = f"खेत का तापमान ({temp_c}°C) {crop_name} की फसल के लिए सुरक्षित सीमा से अधिक है।"
        action_en = "Apply light pulse irrigation during cooler twilight hours. Avoid applying chemical fertilizers in direct sun."
        action_hi = "शाम के समय हल्की सिंचाई करें। तेज धूप में किसी भी उर्वरक का छिड़काव न करें।"
    elif temp_c <= frost_thresh:
        severity = "DANGER"
        risk_score = 92
        financial_loss_inr = 16000
        alert_title_en = "Frost & Ice Crystal Formation Risk"
        alert_title_hi = "पाला व शीत लहर जोखिम"
        alert_desc_en = f"Freezing microclimate ({temp_c}°C) risks cellular bursting in tender crop tissues."
        alert_desc_hi = f"खेत का तापमान ({temp_c}°C) पाला पड़ने के स्तर पर पहुंच गया है।"
        action_en = "Create mild smoke cover around field perimeter and maintain root moisture by light night irrigation."
        action_hi = "खेत की मेड़ों पर हल्का धुआं करें और रात में हल्की सिंचाई कर नमी बनाए रखें।"
    else:
        # 2. Fungal Pathogen & VPD Checks
        for d in diseases:
            t_min, t_max = d.get("trigger_temp_min", 10), d.get("trigger_temp_max", 25)
            h_min = d.get("trigger_humidity_min", 75)
            vpd_min, vpd_max = d.get("vpd_risk_range_kpa", [0.1, 0.6])

            if (t_min <= temp_c <= t_max) and (humidity_pct >= h_min) and (vpd_min <= vpd <= vpd_max):
                severity = "WARNING"
                risk_score = 78
                financial_loss_inr = d.get("financial_loss_inr_per_acre", 14500)
                active_disease_alert = d.get("name")
                alert_title_en = f"Imminent Risk: {active_disease_alert}"
                alert_title_hi = f"रोग चेतावनी: {active_disease_alert}"
                alert_desc_en = f"Microclimate (VPD {vpd} kPa, Humidity {humidity_pct}%) creates high-risk spore incubation conditions for {active_disease_alert} within 36 hours."
                alert_desc_hi = f"खेत की नमी ({humidity_pct}%) एवं सूक्ष्म-जलवायु {active_disease_alert} के फैलाव के लिए अनुकूल बन रही है।"
                action_en = d.get("cure_en")
                action_hi = d.get("cure_hi")
                break
        else:
            alert_title_en = "Optimal Microclimate Environment"
            alert_title_hi = "अनुकूल एवं सुरक्षित सूक्ष्म-जलवायु"
            alert_desc_en = f"Field conditions ({temp_c}°C, {humidity_pct}% RH, VPD {vpd} kPa) are in the healthy photosynthetic growth zone."
            alert_desc_hi = f"खेत का तापमान ({temp_c}°C) व नमी ({humidity_pct}%) फसल के लिए पूर्णतः अनुकूल है।"
            action_en = "Maintain regular monitoring schedule. Safe window for foliar nutrient applications."
            action_hi = "नियमित निगरानी रखें। सामान्य खाद व सिंचाई कार्य जारी रखें।"

    return {
        "status": severity,
        "crop": crop_name,
        "temperature_c": temp_c,
        "humidity_pct": humidity_pct,
        "soil_moisture_pct": soil_pct,
        "vpd_kpa": vpd,
        "pathogen_spore_risk_index": risk_score,
        "potential_financial_loss_inr_per_acre": financial_loss_inr,
        "disease_detected": active_disease_alert,
        "title_en": alert_title_en,
        "title_hi": alert_title_hi,
        "description_en": alert_desc_en,
        "description_hi": alert_desc_hi,
        "action_en": action_en,
        "action_hi": action_hi
    }
