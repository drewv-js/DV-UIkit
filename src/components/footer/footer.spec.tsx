import { newSpecPage } from '@stencil/core/testing';
import { DvFooter } from './footer';

describe('dv-footer', () => {
  it('renders valid tailwind utility classes', async () => {
    const page = await newSpecPage({
      components: [DvFooter],
      html: '<dv-footer></dv-footer>'
    });

    const outer = page.root?.shadowRoot?.querySelector('footer > div');
    const inner = page.root?.shadowRoot?.querySelector('footer > div > div');

    expect(outer?.className).toContain('p-6');
    expect(outer?.className).toContain('border-t');
    expect(outer?.className).toContain('bg-neutral-50');
    expect(outer?.className).toContain('border-neutral-200');
    expect(inner?.className).toContain('flex');
    expect(inner?.className).toContain('justify-between');
    expect(inner?.className).toContain('text-sm');
    expect(inner?.className).toContain('text-neutral-500');
  });

  it('renders slot content', async () => {
    const page = await newSpecPage({
      components: [DvFooter],
      html: '<dv-footer><span>Left</span><span>Right</span></dv-footer>'
    });

    expect(page.root?.textContent).toContain('Left');
    expect(page.root?.textContent).toContain('Right');
  });
});
