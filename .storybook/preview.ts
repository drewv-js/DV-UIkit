import type { Preview } from '@storybook/web-components-vite';
import { setCustomElements } from '@storybook/web-components';
import '../src/styles/tokens.css';
import { defineCustomElements } from '../dist/loader';
import customElements from '../dist/custom-elements.json';

void defineCustomElements();

type StencilDocsJson = {
  components?: Array<{
    tag: string;
    docs?: string;
    props?: Array<{
      name: string;
      docs?: string;
      type?: string;
      attr?: string;
      default?: string;
    }>;
    events?: Array<{
      event: string;
      docs?: string;
      complexType?: {
        original?: string;
      };
    }>;
    slots?: Array<{
      name?: string;
      docs?: string;
    }>;
    methods?: Array<{
      name: string;
      docs?: string;
      signature?: string;
    }>;
  }>;
};

const toStorybookMeta = (stencilMeta: StencilDocsJson) => ({
  version: 'experimental',
  tags: (stencilMeta.components ?? []).map((component) => ({
    name: component.tag,
    description: component.docs ?? '',
    attributes: (component.props ?? [])
      .filter((prop) => Boolean(prop.attr))
      .map((prop) => ({
        name: prop.attr as string,
        description: prop.docs ?? '',
        type: { text: prop.type ?? 'unknown' },
        default: prop.default
      })),
    properties: (component.props ?? []).map((prop) => ({
      name: prop.name,
      description: prop.docs ?? '',
      type: { text: prop.type ?? 'unknown' },
      default: prop.default
    })),
    events: (component.events ?? []).map((event) => ({
      name: event.event,
      description: event.docs ?? '',
      type: { text: event.complexType?.original ?? 'CustomEvent' }
    })),
    slots: (component.slots ?? []).map((slot) => ({
      name: slot.name ?? '',
      description: slot.docs ?? ''
    })),
    members: (component.methods ?? []).map((method) => ({
      kind: 'method',
      name: method.name,
      description: method.docs ?? '',
      type: { text: method.signature ?? '() => void' }
    }))
  }))
});

setCustomElements(toStorybookMeta(customElements as StencilDocsJson));

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
