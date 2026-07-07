import type { Preview } from '@storybook/web-components-vite';
import '../src/styles/tokens.css';
import { defineCustomElements } from '../dist/loader';

void defineCustomElements();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    layout: 'centered'
  }
};

export default preview;
