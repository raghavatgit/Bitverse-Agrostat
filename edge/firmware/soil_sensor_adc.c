#include <stdint.h>

#define OVERSAMPLE_SAMPLES 16

uint16_t sample_capacitive_probe(uint16_t (*adc_read_fn)(void)) {
    uint32_t accumulator = 0;
    for (int i = 0; i < OVERSAMPLE_SAMPLES; i++) {
        accumulator += adc_read_fn();
    }
    return (uint16_t)(accumulator / OVERSAMPLE_SAMPLES);
}
