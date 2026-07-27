import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

type CheckboxArgs = Omit<Components.DvCheckbox, 'nameValue'>;

const checkboxSnippets: ComponentSnippets<CheckboxArgs> = {
	react: (args) => {
		const checked = args.checked ? ' checked' : '';
		const disabled = args.disabled ? ' disabled' : '';
		const indeterminate = args.indeterminate ? ' indeterminate' : '';
		const required = args.required ? ' required' : '';
		const helpText = args.helpText ? ` helpText="${args.helpText}"` : '';
		const errorText = args.errorText ? ` errorText="${args.errorText}"` : '';
		return `import { useState } from 'react';
import { DvCheckbox } from '@dv-uikit/react';

function App() {
  const [checked, setChecked] = useState(${args.checked});

  return (
    <DvCheckbox label="${args.label}"${disabled}${indeterminate}${required}${helpText}${errorText} checked={checked} onChange={(event) => setChecked(event.target.checked)} />
  );
}`;
	},
	vue: (args) => {
		const disabled = args.disabled ? ' disabled' : '';
		const indeterminate = args.indeterminate ? ' indeterminate' : '';
		const required = args.required ? ' required' : '';
		const helpText = args.helpText ? ` help-text="${args.helpText}"` : '';
		const errorText = args.errorText ? ` error-text="${args.errorText}"` : '';
		return `<template>
  <dv-checkbox label="${args.label}"${disabled}${indeterminate}${required}${helpText}${errorText} :checked="checked" @change="checked = $event.target.checked" />
</template>

<script setup>
import { ref } from 'vue';
import { DvCheckbox } from '@dv-uikit/vue';

const checked = ref(${args.checked});
</script>`;
	}
};

const { argTypes } = getStoryHelpers<CheckboxArgs>('dv-checkbox', {
	excludeCategories: ['properties']
});

const meta: Meta<CheckboxArgs> = {
	title: 'Components/Checkbox',
	component: 'dv-checkbox',
	tags: ['autodocs'],
	parameters: {
		componentSubtitle: '<DvCheckbox> | <dv-checkbox>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: CheckboxArgs }) => {
					const args = storyContext.args;
					return buildMultiFrameworkSource(checkboxSnippets.react(args), checkboxSnippets.vue(args));
				}
			}
		}
	},
	argTypes,
	args: {
		checked: false,
		disabled: false,
		indeterminate: false,
		label: 'Default Checkbox',
		required: false,
		helpText: '',
		errorText: ''
	}
};

export default meta;
type Story = StoryObj<CheckboxArgs>;

function renderCheckbox(args: CheckboxArgs) {
	return html`<dv-checkbox
		name-value="checkboxfield"
		label=${args.label}
		?checked=${args.checked}
		?disabled=${args.disabled}
		?indeterminate=${args.indeterminate}
		?required=${args.required}
		help-text=${args.helpText}
		error-text=${args.errorText}
	></dv-checkbox>`;
}

export const Playground: Story = {
	render: (args) => renderCheckbox(args)
};

export const Default: Story = {
	args: { label: 'Default Checkbox' },
	parameters: {
		docs: {
			description: {
				story: 'The default state of the checkbox, <strong>unchecked</strong> and <strong>enabled</strong>.'
			}
		}
	},
	render: (args) => renderCheckbox(args)
};

export const Checked: Story = {
	args: { checked: true, label: 'Checked Checkbox' },
	parameters: {
		docs: {
			description: {
				story: 'A checkbox in the checked state, indicating a <strong>selected</strong> option.'
			}
		}
	},
	render: (args) => renderCheckbox(args)
};

export const Required: Story = {
	args: { required: true, label: 'Required Checkbox' },
	parameters: {
		docs: {
			description: {
				story: 'A checkbox is required to be checked before form submission.'
			}
		}
	},
	render: (args) => renderCheckbox(args)
};

export const Error: Story = {
	args: { errorText: 'This checkbox has an error', label: 'Error Checkbox' },
	parameters: {
		docs: {
			description: {
				story:
					"A checkbox has an error. Using the 'errorText' prop with a value will put the component into an error state."
			}
		}
	},
	render: (args) => renderCheckbox(args)
};

export const HelpText: Story = {
	args: { helpText: 'This checkbox has help text', label: 'Help Text Checkbox' },
	parameters: {
		docs: {
			description: {
				story: "A checkbox with help text. Using the 'helpText' prop displays descriptive text below the checkbox."
			}
		}
	},
	render: (args) => renderCheckbox(args)
};

export const Indeterminate: Story = {
	args: { indeterminate: true, label: 'Indeterminate Checkbox' },
	parameters: {
		docs: {
			description: {
				story: 'A checkbox in the indeterminate state, indicating a <strong>indeterminate</strong> option.'
			}
		}
	},
	render: (args) => renderCheckbox(args)
};

export const Disabled: Story = {
	args: { disabled: true, label: 'Disabled Checkbox' },
	parameters: {
		docs: {
			description: {
				story: 'A <strong>disabled</strong> checkbox that cannot be interacted with.'
			}
		}
	},
	render: (args) => renderCheckbox(args)
};

export const CustomLabel: Story = {
	args: { label: 'Custom Label Checkbox' },
	parameters: {
		docs: {
			description: {
				story: 'A checkbox with a <strong>custom label text</strong>.'
			}
		}
	},
	render: (args) => renderCheckbox(args)
};


