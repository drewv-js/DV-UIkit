import * as React from 'react';
import { createComponent } from '@lit/react';
import { DvButton } from '../components/button/dv-button';

type ButtonElement = HTMLElementTagNameMap['dv-button'];

export const DvButtonReact = createComponent({
  tagName: 'dv-button',
  elementClass: DvButton,
  react: React,
  events: {}
});

export type DvButtonProps = React.ComponentProps<typeof DvButtonReact> & {
  ref?: React.Ref<ButtonElement>;
};
