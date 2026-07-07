import * as React from 'react';
import { createComponent } from '@lit/react';
import { DvCard } from '../components/card/dv-card';

type CardElement = HTMLElementTagNameMap['dv-card'];

export const DvCardReact = createComponent({
  tagName: 'dv-card',
  elementClass: DvCard,
  react: React,
  events: {}
});

export type DvCardProps = React.ComponentProps<typeof DvCardReact> & {
  ref?: React.Ref<CardElement>;
};
