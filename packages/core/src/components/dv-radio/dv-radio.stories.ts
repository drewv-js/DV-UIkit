import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

type RadioArgs = Omit<Components.DvRadio, 'name' | 'nameValue'>;

const radioSnippets: ComponentSnippets<RadioArgs> = {
	react: (args) => {
		const disabled = args.disabled ? ' disabled' : '';
		const checked = args.checked ? ' checked' : '';
		return `import { DvRadio } from '@dv-uikit/react';

function App() {
  return (
    <DvRadio label="${args.label}" value="${args.value}"${disabled}${checked} />
  );
}`;
	},
	vue: (args) => {
		const disabled = args.disabled ? ' disabled' : '';
		const checked = args.checked ? ' checked' : '';
		return `<template>
  <dv-radio label="${args.label}" value="${args.value}"${disabled}${checked} />
</template>

<script setup>
import { DvRadio } from '@dv-uikit/vue';
</script>`;
	}
};

const { argTypes } = getStoryHelpers<RadioArgs>('dv-radio', {
	excludeCategories: ['properties']
});

const meta: Meta<RadioArgs> = {
	title: 'Components/Radio Group/Radio',
	component: 'dv-radio',
	tags: ['autodocs'],
	parameters: {
		componentSubtitle: '<DvRadio> | <dv-radio>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: RadioArgs }) => {
					const args = storyContext.args;
					return buildMultiFrameworkSource(radioSnippets.react(args), radioSnippets.vue(args));
				}
			}
		}
	},
	argTypes,
	args: {
		label: 'Default Radio',
		value: 'value',
		disabled: false,
		checked: false
	}
};

export default meta;
type Story = StoryObj<RadioArgs>;

function renderRadio(args: RadioArgs) {
	return html`<dv-radio
		id="idValue"
		name="radio-group"
		label=${args.label}
		value=${args.value}
		?disabled=${args.disabled}
		?checked=${args.checked}
	></dv-radio>`;
}

export const Playground: Story = {
	render: (args) => renderRadio(args)
};

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'The default state of the radio, unchecked and enabled.'
			}
		}
	},
	render: (args) => renderRadio(args)
};

export const Checked: Story = {
	args: { checked: true, label: 'Checked Radio' },
	parameters: { docs: { description: { story: 'A radio in selected state.' } } },
	render: (args) => renderRadio(args)
};

export const Disabled: Story = {
	args: { disabled: true, label: 'Disabled Radio' },
	parameters: { docs: { description: { story: 'A disabled radio option.' } } },
	render: (args) => renderRadio(args)
};

export const CustomLabel: Story = {
	args: { label: 'Custom Label Radio' },
	parameters: {
		docs: {
			description: {
				story: 'A radio with a custom label text.'
			}
		}
	},
	render: (args) => renderRadio(args)
};


