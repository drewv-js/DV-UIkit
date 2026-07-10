import { newSpecPage } from '@stencil/core/testing';
import { DvTextarea } from './textarea';

describe('dv-textarea', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DvTextarea],
      html: '<dv-textarea></dv-textarea>'
    });

    expect(page.root).toBeTruthy();
  });
});
