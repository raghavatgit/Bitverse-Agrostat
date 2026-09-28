import sys
import os
import threading
from typing import Optional

# Ensure local module directory is in python search path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ml_models.loss_prevention_engine import evaluate_crop_loss_risk
from ml_models.mandi_arbitrage_engine import calculate_mandi_arbitrage
from ml_models.kcc_agrobot_engine import answer_farmer_query
from ml_models.crop_recommender_engine import recommend_crops_model
from iot_serial_bridge import start_serial_bridge, push_to_firebase_cloud

app = FastAPI(
    title="Agrostat AI & IoT Loss Prevention Engine",
    description="Backend service powered by AIKosh KCC, AGMARKNET, and ESP32 Microclimate Telemetry",
    version="1.0.0"
)

# Enable CORS for the Vite React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global in-memory cache for latest telemetry
LATEST_TELEMETRY = {
    "device_id": "AGRO_ESP32_NODE_01",
    "temperature": 28.4,
    "humidity": 62.0,
    "soil_moisture_raw": 2100,
    "soil_moisture_pct": 49,
    "motion_detected": False,
    "heat_index": 34.6,
    "status": "NORMAL",
    "alert_code": "NONE",
    "timestamp": "2026-08-22T00:00:00Z"
}

def update_telemetry_cache(packet):
    global LATEST_TELEMETRY
    LATEST_TELEMETRY = packet

# Start background serial bridge listener
threading.Thread(target=start_serial_bridge, args=(update_telemetry_cache,), daemon=True).start()

# ── Pydantic Request Models ───────────────────────────────────────────────────

class LossEvaluationRequest(BaseModel):
    temperature: Optional[float] = 28.4
    humidity: Optional[float] = 62.0
    soil_moisture_raw: Optional[int] = 2100
    crop_name: Optional[str] = "Wheat"
    crop: Optional[str] = None

class MandiArbitrageRequest(BaseModel):
    crop: str = "Wheat"
    lot_size_quintals: float = 100.0
    current_mandi_price: float = 2450.0

class AgroBotQueryRequest(BaseModel):
    query: str
    language: str = "EN"

class CropRecommendationRequest(BaseModel):
    location: str = "Punjab"
    soil_type: str = "Loam"
    season: str = "Rabi"

# ── API Endpoints ─────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "platform": "Agrostat AI Loss Prevention Platform",
        "version": "1.0.0",
        "status": "OPERATIONAL",
        "active_datasets": [
            "AIKosh KCC Transcripts (aikosh.indiaai.gov.in)",
            "AGMARKNET Daily Mandi Prices (data.gov.in)",
            "AMI Cold Storage Infrastructure Registry",
            "ICAR Agro-Ecological Disease & VPD Matrix"
        ]
    }

@app.get("/api/telemetry/latest")
def get_latest_telemetry():
    """Returns real-time or latest cached ESP32 sensor readings."""
    return LATEST_TELEMETRY

@app.post("/api/telemetry/push")
def push_telemetry(packet: dict):
    """Allows direct HTTP ingestion of sensor packets from ESP32 or test scripts."""
    global LATEST_TELEMETRY
    if "timestamp" not in packet:
        packet["timestamp"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    LATEST_TELEMETRY = packet
    # Sync to Firebase RTDB in background
    threading.Thread(target=push_to_firebase_cloud, args=(packet,), daemon=True).start()
    return {"status": "success", "received": packet}

@app.post("/api/loss-prevention/evaluate")
def evaluate_loss(req: LossEvaluationRequest):
    """Calculates Vapor Pressure Deficit (VPD) and ₹/Acre disease loss risk."""
    target_crop = req.crop or req.crop_name or "Wheat"
    temp = req.temperature if req.temperature is not None else 28.4
    humidity = req.humidity if req.humidity is not None else 62.0
    soil = req.soil_moisture_raw if req.soil_moisture_raw is not None else 2100
    return evaluate_crop_loss_risk(
        temp_c=temp,
        humidity_pct=humidity,
        soil_raw=soil,
        crop_name=target_crop
    )

@app.post("/api/arbitrage/optimize")
def get_mandi_arbitrage(req: MandiArbitrageRequest):
    """Calculates inter-mandi price arbitrage minus transport + Cold Storage ROI."""
    return calculate_mandi_arbitrage(
        crop=req.crop,
        lot_size_quintals=req.lot_size_quintals,
        current_mandi_price=req.current_mandi_price
    )

@app.post("/api/agrobot/query")
def query_agrobot(req: AgroBotQueryRequest):
    """Grounded NLP resolution against AIKosh Kisan Call Centre corpus."""
    return answer_farmer_query(
        user_query=req.query,
        language=req.language
    )

@app.post("/api/crops/recommend")
def recommend_crops(req: CropRecommendationRequest):
    """Multi-factor crop ranking by suitability, water need, and net profit per acre."""
    return recommend_crops_model(
        location=req.location,
        soil_type=req.soil_type,
        season=req.season
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
