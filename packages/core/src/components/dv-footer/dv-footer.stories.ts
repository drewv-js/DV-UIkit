import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

type FooterArgs = Record<string, never>;

const footerSnippets: ComponentSnippets<FooterArgs> = {
	react: () => `import { DvFooter } from '@dv-uikit/react';

function App() {
  return <DvFooter>© 2024 DvEConnection. All rights reserved. (6.0.1)</DvFooter>;
}`,
	vue: () => `<template>
  <dv-footer>© 2024 DvEConnection. All rights reserved. (6.0.1)</dv-footer>
</template>

<script setup>
import { DvFooter } from '@dv-uikit/vue';
</script>`
};

const { argTypes } = getStoryHelpers('dv-footer', {
	excludeCategories: ['properties']
});

const meta: Meta<FooterArgs> = {
	title: 'Components/Footer',
	component: 'dv-footer',
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		componentSubtitle: '<DvFooter> | <dv-footer>',
		docs: {
			source: {
				transform: () => buildMultiFrameworkSource(footerSnippets.react({}), footerSnippets.vue({}))
			}
		}
	},
	argTypes
};

export default meta;

type Story = StoryObj<FooterArgs>;

function renderFooter() {
	return html`
		<dv-footer>
			<div>© 2024 DvEConnection. All rights reserved. (6.0.1)</div>
		</dv-footer>
	`;
}

export const Playground: Story = {
	render: () => renderFooter()
};

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'A default footer.'
			}
		}
	},
	render: () => renderFooter()
};


