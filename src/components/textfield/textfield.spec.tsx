import { newSpecPage } from '@stencil/core/testing';
import { DvTextfield } from './textfield';

describe('dv-textfield', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DvTextfield],
      html: '<dv-textfield></dv-textfield>'
    });

    expect(page.root).toBeTruthy();
  });
});
