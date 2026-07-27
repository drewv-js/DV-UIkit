import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

type AppBarArgs = Components.DvAppBar & {
	label: NonNullable<Components.DvAppBar['label']>;
};

const withFixedHeight = (heightPx: number) => (storyFn: () => unknown) => {
	return html`<div style="height: ${heightPx}px;">${storyFn()}</div>`;
};

const appBarSnippets: ComponentSnippets<AppBarArgs> = {
	react: (args) => `import { DvAppBar, DvAvatar } from '@dv-uikit/react';
function App() {
  return (
    <DvAppBar label="${args.label}">
	      <DvAvatar slot="right" label="User avatar" />
    </DvAppBar>
  );
}`,
	vue: (args) => `<template>
  <dv-app-bar label="${args.label}">
	<template #right>
		<dv-avatar label="User avatar" />
	</template>
  </dv-app-bar>
</template>
<script setup>
	import { DvAppBar, DvAvatar } from '@dv-uikit/vue';
</script>`
};

const { argTypes } = getStoryHelpers<AppBarArgs>('dv-app-bar', {
	excludeCategories: ['properties']
});

const meta: Meta<AppBarArgs> = {
	title: 'Components/App Bar',
	component: 'dv-app-bar',
	tags: ['autodocs'],
	decorators: [withFixedHeight(200)],
	parameters: {
		layout: 'fullscreen',
		componentSubtitle: '<DvAppBar> | <dv-app-bar>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: AppBarArgs }) => {
					const args = storyContext.args;
					return buildMultiFrameworkSource(appBarSnippets.react(args), appBarSnippets.vue(args));
				}
			}
		}
	},
	argTypes,
	args: {
		label: 'Application header'
	}
};

export default meta;

type Story = StoryObj<AppBarArgs>;

function renderAppBar(args: AppBarArgs) {
	return html`
		<dv-app-bar label=${args.label}>
			<div slot="right"><dv-avatar label="User avatar"></dv-avatar></div>
		</dv-app-bar>
	`;
}

export const Playground: Story = {
	render: (args) => renderAppBar(args)
};

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'The default App Bar component.'
			}
		}
	},
	render: (args) => renderAppBar(args)
};


