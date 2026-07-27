import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

type StepArgs = Pick<Components.DvStep, 'variant'>;

const stepSnippets: ComponentSnippets<StepArgs> = {
	react: (args) => {
		const variant = args.variant !== 'default' ? ` variant="${args.variant}"` : '';
		return `import { DvStepper, DvStep } from '@dv-uikit/react';

function App() {
  return (
    <DvStepper>
      <DvStep${variant} onSelectedChanged={handleSelectedChanged}>
        Step Label
      </DvStep>
    </DvStepper>
  );
}`;
	},
	vue: (args) => {
		const variant = args.variant !== 'default' ? ` variant="${args.variant}"` : '';
		return `<template>
  <dv-stepper>
    <dv-step${variant} @selected-changed="handleSelectedChanged">
      Step Label
    </dv-step>
  </dv-stepper>
</template>

<script setup>
import { DvStepper, DvStep } from '@dv-uikit/vue';

const handleSelectedChanged = (event) => {};
</script>`;
	}
};

const { argTypes } = getStoryHelpers<StepArgs>('dv-step', {
	excludeCategories: ['properties']
});

const meta: Meta<StepArgs> = {
	title: 'Components/Step',
	component: 'dv-step',
	tags: ['autodocs'],
	parameters: {
		componentSubtitle: '<DvStep> | <dv-step>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: StepArgs }) => {
					const args = storyContext.args;
					return buildMultiFrameworkSource(stepSnippets.react(args), stepSnippets.vue(args));
				}
			}
		}
	},
	argTypes,
	args: {
		variant: 'default'
	}
};

export default meta;
type Story = StoryObj<StepArgs>;

export const Playground: Story = {
	args: { variant: 'default' },
	render: (args) => html`<dv-step variant=${args.variant}>Default</dv-step>`
};

export const Default: Story = {
	args: { variant: 'default' },
	render: (args) => html`<dv-step variant=${args.variant}>Default</dv-step>`
};

export const Active: Story = {
	args: { variant: 'active' },
	render: (args) => html`<dv-step variant=${args.variant}>Active</dv-step>`
};

export const Completed: Story = {
	args: { variant: 'completed' },
	render: (args) => html`<dv-step variant=${args.variant}>Complete</dv-step>`
};

export const Error: Story = {
	args: { variant: 'error' },
	render: (args) => html`<dv-step variant=${args.variant}>Error</dv-step>`
};


