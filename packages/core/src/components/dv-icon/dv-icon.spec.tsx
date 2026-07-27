import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvIcon } from './dv-icon';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
  root?: HTMLElement & T;
}

describe('dv-icon', () => {
  let icon: TypedSpecPage<DvIcon>;

  beforeEach(async () => {
    icon = (await newSpecPage({
      components: [DvIcon],
      html: '<dv-icon></dv-icon>',
      supportsShadowDom: false
    })) as TypedSpecPage<DvIcon>;
  });

  afterEach(() => {
    icon = null as unknown as TypedSpecPage<DvIcon>;
  });

  it('renders default placeholder icon token', async () => {
    await icon.waitForChanges();
    const wrapper = icon.root?.querySelector('div');
    const mark = icon.root?.querySelector('span');

    expect(wrapper).toBeTruthy();
    expect(mark?.classList.contains('size-4')).toBe(true);
  });

  it('applies semantic status class for success color', async () => {
    icon.root?.setAttribute('color', 'success');
    await icon.waitForChanges();

    const wrapper = icon.root?.querySelector('div');
    expect(wrapper?.classList.contains('text-status-success')).toBe(true);
  });

  it('renders placeholder from icon name', async () => {
    if (!icon.root) return;
    icon.root.name = 'notes' as any;
    await icon.waitForChanges();

    const mark = icon.root.querySelector('span');
    expect(mark?.textContent).toBe('NO');
  });

  it('updates size class', async () => {
    if (!icon.root) return;
    icon.root.size = 'xl';
    await icon.waitForChanges();

    const mark = icon.root.querySelector('span');
    expect(mark?.classList.contains('size-10')).toBe(true);
  });
});
