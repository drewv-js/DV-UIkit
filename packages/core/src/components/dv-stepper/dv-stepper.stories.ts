import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

const withFixedHeight = (heightPx: number) => (storyFn: () => unknown) => {
	return html`<div style="height: ${heightPx}px;">${storyFn()}</div>`;
};

type StepperArgs = Omit<Components.DvStepper, 'stepperSetSelectedIndex'>;

const stepperSnippets: ComponentSnippets<StepperArgs> = {
	react: (args) => {
		const clickable = args.clickable ? ' clickable' : '';
		return `import { DvStepper, DvStep } from '@dv-uikit/react';

function App() {
  return (
    <DvStepper${clickable} onStepSelected={handleStepSelected}>
      <DvStep variant="completed" position="first">Step 1</DvStep>
      <DvStep variant="active" position="inner">Step 2</DvStep>
      <DvStep variant="default" position="inner">Step 3</DvStep>
      <DvStep variant="error" position="last">Step 4</DvStep>
    </DvStepper>
  );
}`;
	},
	vue: (args) => {
		const clickable = args.clickable ? ' clickable' : '';
		return `<template>
  <dv-stepper${clickable} @step-selected="handleStepSelected">
    <dv-step variant="completed" position="first">Step 1</dv-step>
    <dv-step variant="active" position="inner">Step 2</dv-step>
    <dv-step variant="default" position="inner">Step 3</dv-step>
    <dv-step variant="error" position="last">Step 4</dv-step>
  </dv-stepper>
</template>

<script setup>
import { DvStepper, DvStep } from '@dv-uikit/vue';

const handleStepSelected = (event) => {};
</script>`;
	}
};

const { argTypes } = getStoryHelpers<StepperArgs>('dv-stepper', {
	excludeCategories: ['properties']
});

const meta: Meta<StepperArgs> = {
	title: 'Components/Stepper',
	component: 'dv-stepper',
	tags: ['autodocs'],
	decorators: [withFixedHeight(350)],
	parameters: {
		componentSubtitle: '<DvStepper> | <dv-stepper>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: StepperArgs }) => {
					const args = storyContext.args;
					return buildMultiFrameworkSource(stepperSnippets.react(args), stepperSnippets.vue(args));
				}
			}
		}
	},
	argTypes,
	args: {
		selectedIndex: 0,
		clickable: false
	}
};

export default meta;
type Story = StoryObj<StepperArgs>;

export const Playground: Story = {
	render: () => html`
		<dv-stepper>
			<dv-step variant="completed" position="first">Step 1</dv-step>
			<dv-step variant="active" position="inner">Step 2</dv-step>
			<dv-step variant="default" position="inner">Step 3</dv-step>
			<dv-step variant="error" position="last">Step 4</dv-step>
		</dv-stepper>
	`
};

export const Default: Story = {
	parameters: { docs: { description: { story: 'A stepper with steps in various states.' } } },
	render: () => html`
		<dv-stepper>
			<dv-step variant="completed" position="first">Step 1</dv-step>
			<dv-step variant="active" position="inner">Step 2</dv-step>
			<dv-step variant="default" position="inner">Step 3</dv-step>
			<dv-step variant="error" position="last">Step 4</dv-step>
		</dv-stepper>
	`
};


