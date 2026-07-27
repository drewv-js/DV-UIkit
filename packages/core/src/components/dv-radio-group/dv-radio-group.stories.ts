import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

type RadioGroupArgs = Components.DvRadioGroup;

const radioGroupSnippets: ComponentSnippets<RadioGroupArgs> = {
	react: (args) => {
		const value = args.value ? `\n      value="${args.value}"` : '';
		const helpText = args.helpText ? `\n      helpText="${args.helpText}"` : '';
		const errorText = args.errorText ? `\n      errorText="${args.errorText}"` : '';
		const required = args.required ? ' required' : '';
		return `import { DvRadioGroup, DvRadio } from '@dv-uikit/react';

function App() {
  return (
    <DvRadioGroup
      name="${args.name}"
      label="${args.label}"${value}${helpText}${errorText}${required}
      onChange={handleChange}
    >
      <DvRadio value="1" label="This is option one" />
      <DvRadio value="2" label="This is option two" />
      <DvRadio value="3" label="This is option three" />
    </DvRadioGroup>
  );
}`;
	},
	vue: (args) => {
		const value = args.value ? `\n    value="${args.value}"` : '';
		const helpText = args.helpText ? `\n    help-text="${args.helpText}"` : '';
		const errorText = args.errorText ? `\n    error-text="${args.errorText}"` : '';
		const required = args.required ? ' required' : '';
		return `<template>
  <dv-radio-group
    name="${args.name}"
    label="${args.label}"${value}${helpText}${errorText}${required}
    @change="handleChange"
  >
    <dv-radio value="1" label="This is option one"></dv-radio>
    <dv-radio value="2" label="This is option two"></dv-radio>
    <dv-radio value="3" label="This is option three"></dv-radio>
  </dv-radio-group>
</template>

<script setup>
import { DvRadioGroup, DvRadio } from '@dv-uikit/vue';

const handleChange = (event) => {};
</script>`;
	}
};

const { argTypes } = getStoryHelpers<RadioGroupArgs>('dv-radio-group', {
	excludeCategories: ['properties']
});

const meta: Meta<RadioGroupArgs> = {
	title: 'Components/Radio Group',
	component: 'dv-radio-group',
	tags: ['autodocs'],
	parameters: {
		componentSubtitle: '<DvRadioGroup> | <dv-radio-group>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: RadioGroupArgs }) => {
					const args = storyContext.args;
					return buildMultiFrameworkSource(radioGroupSnippets.react(args), radioGroupSnippets.vue(args));
				}
			}
		}
	},
	argTypes,
	args: {
		label: 'Select one of the options:',
		name: 'options',
		value: '',
		helpText: '',
		errorText: '',
		required: false
	}
};

export default meta;
type Story = StoryObj<RadioGroupArgs>;

function renderRadioGroup(args: RadioGroupArgs) {
	return html`
		<dv-radio-group
			name=${args.name}
			label=${args.label}
			value=${args.value}
			help-text=${args.helpText}
			error-text=${args.errorText}
			?required=${args.required}
		>
			<dv-radio value="1" label="This is option one"></dv-radio>
			<dv-radio value="2" label="This is option two"></dv-radio>
			<dv-radio value="3" label="This is option three"></dv-radio>
		</dv-radio-group>
	`;
}

export const Playground: Story = {
	render: (args) => renderRadioGroup(args)
};

export const Default: Story = {
	args: { label: 'Default radio group:' },
	parameters: { docs: { description: { story: 'A default radio group with three radios.' } } },
	render: (args) => renderRadioGroup(args)
};

export const PreSelected: Story = {
	args: { label: 'Radio group with preselected value:', value: '1' },
	parameters: { docs: { description: { story: 'A radio group with three radios where one is preselected.' } } },
	render: (args) => renderRadioGroup(args)
};

export const Required: Story = {
	args: { label: 'Radio group that is required:', required: true },
	parameters: { docs: { description: { story: 'A radio group where a selection is required.' } } },
	render: (args) => renderRadioGroup(args)
};

export const Error: Story = {
	args: { label: 'Radio group that has an error:', errorText: 'This field has an error' },
	parameters: {
		docs: {
			description: {
				story:
					"This radio group has an error. Using the 'errorText' prop with a value will put the component into an error state."
			}
		}
	},
	render: (args) => renderRadioGroup(args)
};

export const HelpText: Story = {
	args: { label: 'Radio group with help text:', helpText: 'This is some helpful information' },
	parameters: { docs: { description: { story: 'A radio group with help text displayed below.' } } },
	render: (args) => renderRadioGroup(args)
};


