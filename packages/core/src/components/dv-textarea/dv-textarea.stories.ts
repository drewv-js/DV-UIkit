import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

type TextareaArgs = Omit<Components.DvTextarea, 'nameValue'>;

const formatStringProp = (name: string, value?: string) => (value ? ` ${name}=${JSON.stringify(value)}` : '');

const textareaSnippets: ComponentSnippets<TextareaArgs> = {
	react: (args) => {
		const placeholder = formatStringProp('placeholder', args.placeholder);
		const required = args.required ? ' required' : '';
		const disabled = args.disabled ? ' disabled' : '';
		const errorText = formatStringProp('errorText', args.errorText);
		const helpText = formatStringProp('helpText', args.helpText);
		const rows = args.rows !== 3 ? ` rows={${args.rows}}` : '';
		const maxLength = args.maxLength !== undefined ? ` maxLength={${args.maxLength}}` : '';
		return `import { useState } from 'react';
import { DvTextarea } from '@dv-uikit/react';

function App() {
  const [value, setValue] = useState('');

  return (
    <DvTextarea label=${JSON.stringify(args.label ?? '')}${placeholder}${rows}${required}${disabled}${errorText}${helpText}${maxLength} value={value} onInput={(event) => setValue(event.target.value)} />
  );
}`;
	},
	vue: (args) => {
		const placeholder = formatStringProp('placeholder', args.placeholder);
		const required = args.required ? ' required' : '';
		const disabled = args.disabled ? ' disabled' : '';
		const errorText = formatStringProp('error-text', args.errorText);
		const helpText = formatStringProp('help-text', args.helpText);
		const rows = args.rows !== 3 ? ` rows="${args.rows}"` : '';
		const maxLength = args.maxLength !== undefined ? ` max-length="${args.maxLength}"` : '';
		return `<template>
  <dv-textarea label=${JSON.stringify(args.label ?? '')}${placeholder}${rows}${required}${disabled}${errorText}${helpText}${maxLength} :value="value" @input="value = $event.target.value" />
</template>

<script setup>
import { ref } from 'vue';
import { DvTextarea } from '@dv-uikit/vue';

const value = ref('');
</script>`;
	}
};

const { argTypes } = getStoryHelpers<TextareaArgs>('dv-textarea', {
	excludeCategories: ['properties']
});

const meta: Meta<TextareaArgs> = {
	title: 'Components/Textarea',
	component: 'dv-textarea',
	tags: ['autodocs'],
	parameters: {
		componentSubtitle: '<DvTextarea> | <dv-textarea>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: TextareaArgs }) => {
					const args = storyContext.args;
					return buildMultiFrameworkSource(textareaSnippets.react(args), textareaSnippets.vue(args));
				}
			}
		}
	},
	argTypes,
	args: {
		label: 'Default Textarea',
		placeholder: 'Enter text here',
		value: '',
		rows: 3,
		required: false,
		disabled: false,
		errorText: '',
		helpText: ''
		// maxLength intentionally omitted so counter is hidden by default
	}
};

export default meta;
type Story = StoryObj<TextareaArgs>;

function renderTextarea(args: TextareaArgs) {
	return html`<dv-textarea
		name-value="textarea-field"
		label=${args.label}
		placeholder=${args.placeholder}
		value=${args.value}
		.rows=${args.rows}
		?required=${args.required}
		?disabled=${args.disabled}
		error-text=${args.errorText}
		help-text=${args.helpText}
		.maxLength=${args.maxLength}
	></dv-textarea>`;
}

export const Playground: Story = {
	render: (args) => renderTextarea(args)
};

export const Default: Story = {
	parameters: { docs: { description: { story: 'A default Textarea.' } } },
	render: (args) => renderTextarea(args)
};

export const Required: Story = {
	args: { label: 'Required Textarea', required: true },
	parameters: {
		docs: { description: { story: 'A Textarea that includes required asterisk to indicate required content.' } }
	},
	render: (args) => renderTextarea(args)
};

export const Error: Story = {
	args: { label: 'Error Textarea', errorText: 'This field has an error!' },
	parameters: {
		docs: {
			description: {
				story:
					"An textarea that has a error. Using the 'errorText' prop with a value will put the component into an error state."
			}
		}
	},
	render: (args) => renderTextarea(args)
};

export const Disabled: Story = {
	args: { label: 'Disabled Textarea', disabled: true },
	parameters: { docs: { description: { story: 'A Textarea that has been disabled.' } } },
	render: (args) => renderTextarea(args)
};

export const HelpText: Story = {
	args: { label: 'Textarea with Help Text', helpText: 'This is some helpful information' },
	parameters: { docs: { description: { story: 'A Textarea with some help text below.' } } },
	render: (args) => renderTextarea(args)
};

export const CharacterCount: Story = {
	args: { label: 'Textarea with Character Count', maxLength: 200 },
	parameters: {
		docs: {
			description: {
				story:
					"A Textarea with a character counter displayed below the input. Setting the 'maxLength' prop enforces the limit natively and shows a live '0 / 200' counter."
			}
		}
	},
	render: (args) => renderTextarea(args)
};


