CREATE MATERIALIZED VIEW IF NOT EXISTS hourly_agro_telemetry
WITH (timescaledb.continuous) AS
SELECT time_bucket('1 hour', time) AS bucket,
       sensor_id,
       AVG(temperature) as avg_temp,
       AVG(humidity) as avg_humidity
FROM sensor_telemetry
GROUP BY bucket, sensor_id;
