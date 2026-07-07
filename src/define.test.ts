import { describe, expect, it } from 'vitest';
import { defineAllComponents } from './define';

describe('defineAllComponents', () => {
  it('defines components idempotently', async () => {
    await defineAllComponents();
    await defineAllComponents();

    expect(customElements.get('dv-button')).toBeDefined();
    expect(customElements.get('dv-card')).toBeDefined();
  });
});
