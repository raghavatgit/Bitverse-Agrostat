import json
import os

DATASET_PRICE_PATH = os.path.join(os.path.dirname(__file__), '..', 'datasets', 'agmarknet_mandi_time_series.json')
DATASET_STORAGE_PATH = os.path.join(os.path.dirname(__file__), '..', 'datasets', 'cold_storage_infrastructure.json')

def calculate_mandi_arbitrage(crop: str, lot_size_quintals: float = 100.0, current_mandi_price: float = 2450.0) -> dict:
    """
    Computes inter-mandi price spread minus transportation freight costs.
    Reveals exact net profit delta by routing to premium mandis.
    """
    try:
        with open(DATASET_PRICE_PATH, 'r', encoding='utf-8') as f:
            price_db = json.load(f).get("commodities", {})
    except Exception:
        price_db = {}

    crop_data = price_db.get(crop, price_db.get("Wheat", {}))
    mandis = crop_data.get("mandis", [])
    
    # Standard mini-truck transport model: ₹35 per km (covers diesel + driver)
    COST_PER_KM = 35.0

    arbitrage_routes = []
    best_route = None
    max_net_gain = 0.0

    for m in mandis:
        distance = m.get("distance_km", 10)
        target_price = m.get("current_price", current_mandi_price)
        transport_cost = distance * COST_PER_KM

        gross_value_local = current_mandi_price * lot_size_quintals
        gross_value_target = target_price * lot_size_quintals
        net_profit_gain = (gross_value_target - gross_value_local) - transport_cost

        route_info = {
            "mandi_name": m.get("name"),
            "state": m.get("state"),
            "distance_km": distance,
            "mandi_price_inr": target_price,
            "estimated_transport_cost_inr": round(transport_cost, 0),
            "net_gain_inr": round(net_profit_gain, 0),
            "recommendation": "RECOMMENDED" if net_profit_gain > 1500 else ("NEUTRAL" if net_profit_gain >= 0 else "AVOID")
        }
        arbitrage_routes.append(route_info)

        if net_profit_gain > max_net_gain:
            max_net_gain = net_profit_gain
            best_route = route_info

    # 2. Evaluate Cold Storage Holding ROI (Distress Sale Prevention)
    try:
        with open(DATASET_STORAGE_PATH, 'r', encoding='utf-8') as f:
            storage_db = json.load(f).get("storage_units", [])
    except Exception:
        storage_db = []

    storage_recommendation = None
    forecast_30d = crop_data.get("30_day_forecast", [])
    if forecast_30d and storage_db:
        # Check projected price at 21 days
        day21_forecast = forecast_30d[3].get("predicted_price", current_mandi_price * 1.08)
        price_gain_per_qtl = day21_forecast - current_mandi_price

        # Pick nearest eligible facility
        facility = storage_db[0]
        bags = lot_size_quintals * 2  # Approx 50kg bags
        monthly_rent = bags * facility.get("rate_per_bag_monthly_inr", 25.0)
        handling_fee = bags * 5.0  # ₹5 loading/unloading
        total_holding_cost = monthly_rent + handling_fee

        gross_holding_gain = price_gain_per_qtl * lot_size_quintals
        net_holding_roi = gross_holding_gain - total_holding_cost

        storage_recommendation = {
            "facility_name": facility.get("name"),
            "district": facility.get("district"),
            "distance_km": facility.get("distance_from_hub_km"),
            "holding_period_days": 21,
            "current_spot_price": current_mandi_price,
            "projected_price_21d": day21_forecast,
            "estimated_storage_cost_inr": round(total_holding_cost, 0),
            "net_profit_after_storage_inr": round(net_holding_roi, 0),
            "avoids_distress_sale": net_holding_roi > 2000,
            "action_en": f"Store {lot_size_quintals} Qtl for 21 days at {facility.get('name')} to capture post-harvest price recovery (+₹{int(net_holding_roi):,} net gain).",
            "action_hi": f"21 दिनों के लिए {facility.get('name')} में भंडारण करें ताकि फसल के भाव में सुधार का लाभ (+₹{int(net_holding_roi):,} शुद्ध लाभ) मिल सके।"
        }

    return {
        "crop": crop,
        "lot_size_quintals": lot_size_quintals,
        "local_mandi_price": current_mandi_price,
        "arbitrage_routes": arbitrage_routes,
        "top_route_opportunity": best_route,
        "storage_arbitrage_roi": storage_recommendation
    }
