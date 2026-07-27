import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getColorGroups } from '../../internal/color';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

type IconButtonArgs = Omit<Components.DvIconButton, 'setFocus'>;

const statusColors = getColorGroups(['status']);
const statusVariants = Object.keys(statusColors);

const iconButtonSnippets: ComponentSnippets<IconButtonArgs> = {
	react: (args) => {
		const size = args.size !== 'md' ? ` size="${args.size}"` : '';
		const type = args.type !== 'button' ? ` type="${args.type}"` : '';
		const disabled = args.disabled ? ' disabled' : '';
		const color = args.color ? ` color="${args.color}"` : '';
		return `import { DvIconButton } from '@dv-uikit/react';

function App() {
  return (
    <DvIconButton name="${args.name}" label="${args.label}"${size}${type}${disabled}${color} onClick={handleClick} />
  );
}`;
	},
	vue: (args) => {
		const size = args.size !== 'md' ? ` size="${args.size}"` : '';
		const type = args.type !== 'button' ? ` type="${args.type}"` : '';
		const disabled = args.disabled ? ' disabled' : '';
		const color = args.color ? ` color="${args.color}"` : '';
		return `<template>
  <dv-icon-button name="${args.name}" label="${args.label}"${size}${type}${disabled}${color} @click="handleClick" />
</template>

<script setup>
import { DvIconButton } from '@dv-uikit/vue';

const handleClick = () => {};
</script>`;
	}
};

const { argTypes } = getStoryHelpers<IconButtonArgs>('dv-icon-button', {
	excludeCategories: ['properties']
});

const meta: Meta<IconButtonArgs> = {
	title: 'Components/Icon Button',
	component: 'dv-icon-button',
	tags: ['autodocs'],
	parameters: {
		componentSubtitle: '<DvIconButton> | <dv-icon-button>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: IconButtonArgs }) => {
					const args = storyContext.args;
					return buildMultiFrameworkSource(iconButtonSnippets.react(args), iconButtonSnippets.vue(args));
				}
			}
		}
	},
	argTypes: {
		...argTypes,
		color: {
			...argTypes.color,
			control: 'select',
			options: statusVariants
		}
	},
	args: {
		name: 'house',
		size: 'md',
		type: 'button',
		disabled: false,
		label: 'house-icon',
		color: undefined
	}
};

export default meta;
type Story = StoryObj<IconButtonArgs>;

function renderIconButton(args: IconButtonArgs, sizeOverride?: IconButtonArgs['size']) {
	return html`<dv-icon-button
		name=${args.name}
		size=${sizeOverride ?? args.size}
		type=${args.type}
		?disabled=${args.disabled}
		label=${args.label}
		.color=${args.color}
	></dv-icon-button>`;
}

export const Playground: Story = {
	render: (args) => renderIconButton(args)
};

export const Default: Story = {
	parameters: { docs: { description: { story: 'A simple icon button displayed directly in the container.' } } },
	render: (args) => renderIconButton(args)
};

export const Sizing: Story = {
	parameters: { docs: { description: { story: 'Display all available icon button sizes.' } } },
	render: (args) => html`
		<div style="display: flex; align-items: flex-end; gap: 0.5rem;">
			${renderIconButton(args, 'xs')} ${renderIconButton(args, 'sm')} ${renderIconButton(args, 'md')}
			${renderIconButton(args, 'lg')} ${renderIconButton(args, 'xl')}
		</div>
	`
};

export const Disabled: Story = {
	args: { disabled: true, size: 'lg' },
	parameters: { docs: { description: { story: 'Disabled icon button state.' } } },
	render: (args) => renderIconButton(args)
};


