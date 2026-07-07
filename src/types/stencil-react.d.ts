import type * as React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'dv-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        variant?: 'primary' | 'secondary' | 'danger';
        disabled?: boolean;
        label?: string;
      };
      'dv-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        heading?: string;
      };
    }
  }
}
