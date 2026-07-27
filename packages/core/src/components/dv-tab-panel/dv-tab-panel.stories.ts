import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

type TabPanelArgs = Components.DvTabPanel;

const tabPanelSnippets: ComponentSnippets<TabPanelArgs> = {
	react: (args) => {
		return `import { DvTabGroup, DvTab, DvTabPanel } from '@dv-uikit/react';

function App() {
  return (
    <DvTabGroup>
      <DvTab slot="nav" panel="panel-1">Tab 1</DvTab>
      <DvTabPanel name="panel-1" active={${args.active}}>
        Tab 1 content goes here.
      </DvTabPanel>
    </DvTabGroup>
  );
}`;
	},

	vue: (args) => {
		return `<template>
  <dv-tab-group>
    <dv-tab slot="nav" panel="panel-1">Tab 1</dv-tab>
    <dv-tab-panel name="panel-1" :active="${args.active}">
      Tab 1 content goes here.
    </dv-tab-panel>
  </dv-tab-group>
</template>

<script setup>
import { DvTabGroup, DvTab, DvTabPanel } from '@dv-uikit/vue';
</script>`;
	}
};

const { argTypes } = getStoryHelpers('dv-tab-panel', {
	excludeCategories: ['properties']
});

const meta: Meta<TabPanelArgs> = {
	title: 'Components/Tab Group/Tab Panel',
	component: 'dv-tab-panel',
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		componentSubtitle: '<DvTabPanel> | <dv-tab-panel>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: TabPanelArgs }) => {
					const args = storyContext.args;
					return buildMultiFrameworkSource(tabPanelSnippets.react(args), tabPanelSnippets.vue(args));
				}
			}
		}
	},
	argTypes,
	args: {
		name: 'panel-1',
		active: true
	}
};

export default meta;

type Story = StoryObj<TabPanelArgs>;

export const Playground: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Interactive tab group demonstrating `dv-tab-panel` content visibility controlled by `dv-tab-group`.'
			}
		}
	},
	render: (args) => html`
		<dv-tab-group>
			<dv-tab-panel name="panel-1" ?active=${args.active}>
				<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
			</dv-tab-panel>
		</dv-tab-group>
	`
};

export const Active: Story = {
	args: {
		active: true
	},
	parameters: {
		docs: {
			description: {
				story: 'Tab panel with `active` property set to true, displaying its content.'
			}
		}
	},
	render: (args) => html`
		<dv-tab-group>
			<dv-tab-panel name="panel-1" ?active=${args.active}>
				<p>This panel is currently active and visible.</p>
			</dv-tab-panel>
		</dv-tab-group>
	`
};


