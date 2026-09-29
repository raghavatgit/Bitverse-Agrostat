#include <stdint.h>

static uint16_t last_power = 0;
static uint16_t pwm_duty = 128;
static int8_t direction = 1;

void mppt_perturb_and_observe(uint16_t voltage_mv, uint16_t current_ma) {
    uint32_t power = ((uint32_t)voltage_mv * current_ma) / 1000;
    if (power > last_power) {
        pwm_duty += direction * 2;
    } else {
        direction = -direction;
        pwm_duty += direction * 2;
    }
    last_power = (uint16_t)power;
}
