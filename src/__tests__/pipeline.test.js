import { describe, it, expect } from 'vitest';
import { runPipeline } from '../services/pipeline.js';

describe('Pipeline Service Engine', () => {
  it('should run pipeline for known SKU HEX-M12-50 and return structured product record', async () => {
    let lastState = null;
    const record = await runPipeline(
      { sku: 'HEX-M12-50', description: '', notes: '' },
      (updatedState) => {
        lastState = updatedState;
      },
      { skipAnimation: true }
    );

    expect(record).toBeDefined();
    expect(record.sku).toBe('HEX-M12-50');
    expect(record.attributes).toBeDefined();
    expect(record.attributes.thread_size.value).toBe('M12');
  });

  it('should generate fallback product record for unknown custom SKU', async () => {
    const record = await runPipeline(
      { sku: 'CUSTOM-PUMP-99', description: 'Industrial hydraulic pump', notes: '' },
      () => {},
      { skipAnimation: true }
    );

    expect(record).toBeDefined();
    expect(record.sku).toBe('CUSTOM-PUMP-99');
    expect(record.attributes.material).toBeDefined();
  });
});
