-- feat(db): configure automated chunk retention and compression policies

CREATE TABLE IF NOT EXISTS BitverseAgrostat_telemetry_log (
    log_id BIGSERIAL PRIMARY KEY,
    subsystem_label VARCHAR(64) NOT NULL,
    metric_reading DOUBLE PRECISION NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_BitverseAgrostat_recorded_at 
ON BitverseAgrostat_telemetry_log (recorded_at DESC);
