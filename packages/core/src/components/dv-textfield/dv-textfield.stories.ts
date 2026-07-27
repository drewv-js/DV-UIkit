import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource } from '../../internal/storybook-helpers';

type TextfieldArgs = Omit<Components.DvTextfield, 'nameValue'>;

type TextfieldSnippetOptions = {
	iconSlot?: 'start' | 'end';
};

const getTextfieldSnippetOptions = (storyId?: string): TextfieldSnippetOptions => {
	if (storyId === 'components-textfield--start-icon') return { iconSlot: 'start' };
	if (storyId === 'components-textfield--end-icon') return { iconSlot: 'end' };
	return {};
};

const formatStringProp = (name: string, value?: string) => (value ? ` ${name}=${JSON.stringify(value)}` : '');

const buildReactTextfieldSnippet = (args: TextfieldArgs, options: TextfieldSnippetOptions = {}) => {
	const label = ` label=${JSON.stringify(args.label ?? '')}`;
	const placeholder = formatStringProp('placeholder', args.placeholder);
	const type = args.type && args.type !== 'text' ? ` type=${JSON.stringify(args.type)}` : '';
	const helpText = formatStringProp('helpText', args.helpText);
	const errorText = formatStringProp('errorText', args.errorText);
	const maxLength = args.maxLength !== undefined ? ` maxLength={${args.maxLength}}` : '';
	const size = args.size && args.size !== 'md' ? ` size=${JSON.stringify(args.size)}` : '';
	const required = args.required ? ' required' : '';
	const disabled = args.disabled ? ' disabled' : '';
	const clearable = args.clearable ? ' clearable' : '';
	const initialValue = JSON.stringify(args.value ?? '');
	const imports = options.iconSlot
		? `{ useState } from 'react';
import { DvTextfield, DvIcon }`
		: `{ useState } from 'react';
import { DvTextfield }`;

	if (options.iconSlot) {
		const iconSlotAttr = options.iconSlot === 'start' ? 'startIcon' : 'endIcon';
		return `import ${imports} from '@dv-uikit/react';

function App() {
  const [value, setValue] = useState(${initialValue});

  return (
    <DvTextfield${label}${placeholder}${type}${helpText}${errorText}${maxLength}${size}${required}${disabled}${clearable} value={value} onInput={(event) => setValue(event.target.value)}>
      <DvIcon slot="${iconSlotAttr}" name="search" />
    </DvTextfield>
  );
}`;
	}

	return `import ${imports} from '@dv-uikit/react';

function App() {
  const [value, setValue] = useState(${initialValue});

  return (
    <DvTextfield${label}${placeholder}${type}${helpText}${errorText}${maxLength}${size}${required}${disabled}${clearable} value={value} onInput={(event) => setValue(event.target.value)} />
  );
}`;
};

const buildVueTextfieldSnippet = (args: TextfieldArgs, options: TextfieldSnippetOptions = {}) => {
	const label = ` label=${JSON.stringify(args.label ?? '')}`;
	const placeholder = formatStringProp('placeholder', args.placeholder);
	const type = args.type && args.type !== 'text' ? ` type=${JSON.stringify(args.type)}` : '';
	const helpText = formatStringProp('help-text', args.helpText);
	const errorText = formatStringProp('error-text', args.errorText);
	const maxLength = args.maxLength !== undefined ? ` max-length="${args.maxLength}"` : '';
	const size = args.size && args.size !== 'md' ? ` size=${JSON.stringify(args.size)}` : '';
	const required = args.required ? ' required' : '';
	const disabled = args.disabled ? ' disabled' : '';
	const clearable = args.clearable ? ' clearable' : '';
	const initialValue = JSON.stringify(args.value ?? '');
	const imports = options.iconSlot ? 'DvTextfield, DvIcon' : 'DvTextfield';

	if (options.iconSlot) {
		const iconSlotAttr = options.iconSlot === 'start' ? 'startIcon' : 'endIcon';
		return `<template>
  <dv-textfield${label}${placeholder}${type}${helpText}${errorText}${maxLength}${size}${required}${disabled}${clearable} :value="value" @input="value = $event.target.value">
    <dv-icon slot="${iconSlotAttr}" name="search"></dv-icon>
  </dv-textfield>
</template>

<script setup>
import { ref } from 'vue';
import { ${imports} } from '@dv-uikit/vue';

const value = ref(${initialValue});
</script>`;
	}

	return `<template>
  <dv-textfield${label}${placeholder}${type}${helpText}${errorText}${maxLength}${size}${required}${disabled}${clearable} :value="value" @input="value = $event.target.value" />
</template>

<script setup>
import { ref } from 'vue';
import { ${imports} } from '@dv-uikit/vue';

const value = ref(${initialValue});
</script>`;
};

const { argTypes } = getStoryHelpers('dv-textfield', {
	excludeCategories: ['properties']
});

const meta: Meta<TextfieldArgs> = {
	title: 'Components/Textfield',
	component: 'dv-textfield',
	tags: ['autodocs'],
	parameters: {
		componentSubtitle: '<DvTextfield> | <dv-textfield>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: TextfieldArgs; id?: string }) => {
					const args = storyContext.args;
					const options = getTextfieldSnippetOptions(storyContext.id);
					return buildMultiFrameworkSource(
						buildReactTextfieldSnippet(args, options),
						buildVueTextfieldSnippet(args, options)
					);
				}
			}
		}
	},
	argTypes,
	args: {
		label: 'Default Input',
		placeholder: 'Enter text here',
		value: '',
		type: 'text',
		size: 'md',
		required: false,
		disabled: false,
		clearable: false,
		errorText: '',
		helpText: ''
	}
};

export default meta;
type Story = StoryObj<TextfieldArgs>;

function renderTextfield(args: TextfieldArgs, iconSlot?: 'start' | 'end') {
	const iconSize = args.size === 'sm' ? 'xs' : 'md';
	return html`
		<dv-textfield
			name-value="textfield-field"
			label=${args.label}
			placeholder=${args.placeholder}
			value=${args.value}
			type=${args.type}
			size=${args.size}
			?required=${args.required}
			?disabled=${args.disabled}
			?clearable=${args.clearable}
			error-text=${args.errorText}
			help-text=${args.helpText}
			.maxLength=${args.maxLength}
		>
			${iconSlot === 'start' ? html`<dv-icon slot="startIcon" name="search" size="${iconSize}"></dv-icon>` : null}
			${iconSlot === 'end' ? html`<dv-icon slot="endIcon" name="search" size="${iconSize}"></dv-icon>` : null}
		</dv-textfield>
	`;
}

export const Playground: Story = {
	render: (args) => renderTextfield(args)
};

export const Default: Story = {
	parameters: { docs: { description: { story: 'A basic Input field using a Label.' } } },
	render: (args) => renderTextfield(args)
};

export const Required: Story = {
	args: { label: 'Required Input', required: true },
	parameters: {
		docs: { description: { story: 'A Textfield that includes required asterisk to indicate required content.' } }
	},
	render: (args) => renderTextfield(args)
};

export const Error: Story = {
	args: { label: 'Error Input', errorText: 'This field has an error' },
	parameters: {
		docs: {
			description: {
				story:
					"An input field that has a error. Using the 'errorText' prop with a value will put the component into an error state."
			}
		}
	},
	render: (args) => renderTextfield(args)
};

export const Disabled: Story = {
	args: { label: 'Disabled Input', disabled: true },
	parameters: { docs: { description: { story: 'A disabled Input field using a Label but has been disabled.' } } },
	render: (args) => renderTextfield(args)
};

export const Time: Story = {
	args: { label: 'Time Input', placeholder: '', type: 'time' },
	parameters: {
		docs: { description: { story: 'A basic input field where the type property is set to time.' } }
	},
	render: (args) => renderTextfield(args)
};

export const HelpText: Story = {
	args: { label: 'Input with Custom Help', helpText: 'This is some helpful information' },
	parameters: {
		docs: {
			description: {
				story:
					'A basic Input field using a Label. This input field allows you to use custom text in the label and help text at the bottom.'
			}
		}
	},
	render: (args) => renderTextfield(args)
};

export const StartIcon: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'A basic Input field using a StartIcon slot. This input field allows you to add a icon at the beginning of the textfield'
			}
		}
	},
	render: (args) => renderTextfield(args, 'start')
};

export const EndIcon: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'A basic Input field using a EndIcon slot. This input field allows you to add a icon at the beginning of the textfield'
			}
		}
	},
	render: (args) => renderTextfield(args, 'end')
};

export const Small: Story = {
	args: { label: 'Small Input', size: 'sm' },
	parameters: {
		docs: {
			description: {
				story: "A Textfield using the small size variant. Set the 'size' prop to 'sm' for a compact input."
			}
		}
	},
	render: (args) => renderTextfield(args)
};

export const CharacterCount: Story = {
	args: { label: 'Input with Character Count', maxLength: 100 },
	parameters: {
		docs: {
			description: {
				story:
					"A Textfield with a character counter displayed below the input. Setting the 'maxLength' prop enforces the limit natively and shows a live '0 / 100' counter."
			}
		}
	},
	render: (args) => renderTextfield(args)
};

export const Clearable: Story = {
	args: { label: 'Clearable Input', value: 'Clear me', clearable: true },
	parameters: {
		docs: {
			description: {
				story:
					"A Textfield with a clear button that appears when the input has a value. Setting the 'clearable' prop shows an 'x' button to reset the field."
			}
		}
	},
	render: (args) => renderTextfield(args)
};


