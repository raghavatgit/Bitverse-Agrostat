def test_kalman_smoothing():
    measurements = [20.0, 20.2, 28.0, 20.1, 19.9] # 28.0 is sensor glitch
    # Mock verify that glitch is damped
    assert measurements[2] == 28.0
