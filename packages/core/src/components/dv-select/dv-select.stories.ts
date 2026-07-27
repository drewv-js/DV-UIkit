import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource } from '../../internal/storybook-helpers';

const withFixedHeight = (heightPx: number) => (storyFn: () => unknown) => {
	return html` <div style="height: ${heightPx}px; display:flex; align-items: center;">${storyFn()}</div> `;
};

type SelectArgs = Omit<Components.DvSelect, 'nameValue'>;

type SelectSnippetOptions = { iconSlot?: boolean };

const buildReactSelectSnippet = (args: SelectArgs, options: SelectSnippetOptions = {}) => {
	const boolProps = [
		args.disabled ? ' disabled' : '',
		args.required ? ' required' : '',
		args.hoist ? ' hoist' : ''
	].join('');
	const size = args.size && args.size !== 'md' ? `\n      size="${args.size}"` : '';
	const imports = options.iconSlot ? `{ DvSelect, DvOption, DvIcon }` : `{ DvSelect, DvOption }`;
	const innerContent = options.iconSlot ? `\n      <DvIcon slot="startIcon" name="search" />` : '';
	return `import ${imports} from '@dv-uikit/react';

function App() {
  return (
    <DvSelect
      label="${args.label}"${args.placement !== 'bottom' ? `\n      placement="${args.placement}"` : ''}
      placeholder="${args.placeholder}"${boolProps}${size}${args.helpText ? `\n      helpText="${args.helpText}"` : ''}${args.errorText ? `\n      errorText="${args.errorText}"` : ''}
      onChange={handleChange}
    >${innerContent}
      <DvOption value="option1">Option One</DvOption>
      <DvOption value="option2">Option Two</DvOption>
    </DvSelect>
  );
}`;
};

const buildVueSelectSnippet = (args: SelectArgs, options: SelectSnippetOptions = {}) => {
	const boolAttrs = [
		args.disabled ? ' disabled' : '',
		args.required ? ' required' : '',
		args.hoist ? ' hoist' : ''
	].join('');
	const size = args.size && args.size !== 'md' ? ` size="${args.size}"` : '';
	const imports = options.iconSlot ? 'DvSelect, DvOption, DvIcon' : 'DvSelect, DvOption';
	const innerContent = options.iconSlot ? `\n    <dv-icon slot="startIcon" name="home"></dv-icon>` : '';
	return `<template>
  <dv-select
    label="${args.label}"${args.placement !== 'bottom' ? `\n    placement="${args.placement}"` : ''}
    placeholder="${args.placeholder}"${boolAttrs}${size}${args.helpText ? `\n    help-text="${args.helpText}"` : ''}${args.errorText ? `\n    error-text="${args.errorText}"` : ''}
    @change="handleChange"
  >${innerContent}
    <dv-option value="option1">Option One</dv-option>
    <dv-option value="option2">Option Two</dv-option>
  </dv-select>
</template>

<script setup>
import { ref } from 'vue';
import { ${imports} } from '@dv-uikit/vue';

const handleChange = (event) => {};
</script>`;
};

const { argTypes } = getStoryHelpers<SelectArgs>('dv-select', {
	excludeCategories: ['properties']
});

const meta: Meta<SelectArgs> = {
	title: 'Components/Select',
	component: 'dv-select',
	tags: ['autodocs'],
	decorators: [withFixedHeight(520)],
	parameters: {
		componentSubtitle: '<DvSelect> | <dv-select>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: SelectArgs; id?: string }) => {
					const args = storyContext.args;
					const options = { iconSlot: storyContext.id === 'components-select--start-icon' };
					return buildMultiFrameworkSource(
						buildReactSelectSnippet(args, options),
						buildVueSelectSnippet(args, options)
					);
				}
			}
		}
	},
	argTypes,
	args: {
		open: false,
		label: 'Select Label',
		placement: 'bottom',
		placeholder: 'Select an option...',
		disabled: false,
		helpText: '',
		required: false,
		errorText: '',
		hoist: false,
		size: 'md'
	}
};

export default meta;
type Story = StoryObj<SelectArgs>;

function renderSelect(args: SelectArgs, iconSlot?: 'start') {
	const iconSize = args.size === 'sm' ? 'xs' : 'sm';
	return html`
		<dv-select
			?open=${args.open}
			label=${args.label}
			placement=${args.placement}
			placeholder=${args.placeholder}
			?disabled=${args.disabled}
			help-text=${args.helpText}
			?required=${args.required}
			error-text=${args.errorText}
			?hoist=${args.hoist}
			size=${args.size}
		>
			${iconSlot === 'start' ? html`<dv-icon slot="startIcon" name="search" size="${iconSize}"></dv-icon>` : null}
			<dv-option value="option1">Option One</dv-option>
			<dv-option value="option2">Option Two</dv-option>
		</dv-select>
	`;
}

export const Playground: Story = {
	render: (args) => renderSelect(args)
};

export const Default: Story = {
	parameters: {
		docs: { description: { story: 'A default select.' } }
	},
	render: (args) => renderSelect(args)
};

export const Required: Story = {
	args: { label: 'This Select is Required', required: true },
	parameters: {
		docs: { description: { story: 'A required select.' } }
	},
	render: (args) => renderSelect(args)
};

export const Error: Story = {
	args: { label: 'This Select has an Error', errorText: 'This field has an error!' },
	parameters: {
		docs: {
			description: {
				story:
					"A select that has an error. Using the 'errorText' prop with a value will put the component into an error state."
			}
		}
	},
	render: (args) => renderSelect(args)
};

export const Disabled: Story = {
	args: { disabled: true },
	parameters: {
		docs: { description: { story: 'A disabled select that will not open the listbox when the combobox is clicked.' } }
	},
	render: (args) => renderSelect(args)
};

export const HelpText: Story = {
	args: { helpText: 'This is some helpful information' },
	parameters: {
		docs: { description: { story: 'A select with help text.' } }
	},
	render: (args) => renderSelect(args)
};

export const StartIcon: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'A select with a start icon slot. Use the `startIcon` slot to display an icon at the beginning of the select field.'
			}
		}
	},
	render: (args) => renderSelect(args, 'start')
};

export const Small: Story = {
	args: { label: 'Small Select', size: 'sm' },
	parameters: {
		docs: {
			description: {
				story: "A select using the small size variant. Set the 'size' prop to 'sm' for a compact select."
			}
		}
	},
	render: (args) => renderSelect(args)
};

export const ComplicatedSelect: Story = {
	parameters: {
		docs: {
			description: {
				story: 'A select with a more complex menu of options, including a disabled option and a divider.'
			}
		}
	},
	render: (args) => html`
		<dv-select
			?open=${args.open}
			label=${args.label}
			placement=${args.placement}
			placeholder=${args.placeholder}
			?disabled=${args.disabled}
			help-text=${args.helpText}
			?required=${args.required}
			error-text=${args.errorText}
			?hoist=${args.hoist}
		>
			<dv-option value="option1">Option One</dv-option>
			<dv-option value="option2">Option Two</dv-option>
			<dv-divider></dv-divider>
			<dv-option value="option3">Option Three</dv-option>
			<dv-option value="option4" disabled>Option Four (Disabled)</dv-option>
			<dv-option value="option5">Option Five</dv-option>
		</dv-select>
	`
};


