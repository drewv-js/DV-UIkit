import { newSpecPage } from '@stencil/core/testing';
import { DvToggle } from './toggle';

describe('dv-toggle', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DvToggle],
      html: '<dv-toggle></dv-toggle>'
    });

    expect(page.root).toBeTruthy();
  });

  it('reflects checked state to the internal input', async () => {
    const page = await newSpecPage({
      components: [DvToggle],
      html: '<dv-toggle checked></dv-toggle>'
    });

    const input = page.root?.shadowRoot?.querySelector('input');
    expect(input?.checked).toBe(true);
  });

  it('renders label text', async () => {
    const page = await newSpecPage({
      components: [DvToggle],
      html: '<dv-toggle label="Email updates"></dv-toggle>'
    });

    const labelText = page.root?.shadowRoot?.querySelector('.text')?.textContent;
    expect(labelText).toContain('Email updates');
  });
});
