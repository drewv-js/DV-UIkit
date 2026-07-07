import * as React from 'react';
export type ButtonVariant = 'primary' | 'secondary' | 'danger';

type DvButtonElement = HTMLElement & {
	variant?: ButtonVariant;
	disabled?: boolean;
	label?: string;
};

type DvCardElement = HTMLElement & {
	heading?: string;
};

export type DvButtonProps = React.HTMLAttributes<DvButtonElement> & {
	variant?: ButtonVariant;
	disabled?: boolean;
	label?: string;
	children?: React.ReactNode;
};

export type DvCardProps = React.HTMLAttributes<DvCardElement> & {
	heading?: string;
	children?: React.ReactNode;
};

export const DvButtonReact = React.forwardRef<DvButtonElement, DvButtonProps>(
	({ children, ...rest }, ref) => React.createElement('dv-button', { ...rest, ref }, children)
);

export const DvCardReact = React.forwardRef<DvCardElement, DvCardProps>(
	({ children, ...rest }, ref) => React.createElement('dv-card', { ...rest, ref }, children)
);

DvButtonReact.displayName = 'DvButtonReact';
DvCardReact.displayName = 'DvCardReact';
