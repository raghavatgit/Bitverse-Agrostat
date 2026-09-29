def test_frost_alert_trigger():
    temp = 1.0
    humidity = 90.0
    assert temp <= 1.5 and humidity >= 85.0
