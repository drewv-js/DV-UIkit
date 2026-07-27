import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

type ToggleArgs = Omit<Components.DvToggle, 'nameValue'>;

const toggleSnippets: ComponentSnippets<ToggleArgs> = {
	react: (args) => {
		const checked = args.checked ? ' checked' : '';
		const disabled = args.disabled ? ' disabled' : '';
		const indeterminate = args.indeterminate ? ' indeterminate' : '';
		const helpText = args.helpText ? ` helpText="${args.helpText}"` : '';

		return `import { useState } from 'react';
import { DvToggle } from '@dv-uikit/react';

function App() {
  const [checked, setChecked] = useState(${args.checked});

  return (
    <DvToggle label="${args.label}"${checked}${disabled}${indeterminate}${helpText} onChange={(event) => setChecked(event.target.checked)} />
  );
}`;
	},
	vue: (args) => {
		const disabled = args.disabled ? ' disabled' : '';
		const indeterminate = args.indeterminate ? ' indeterminate' : '';
		const helpText = args.helpText ? ` help-text="${args.helpText}"` : '';

		return `<template>
  <dv-toggle label="${args.label}"${disabled}${indeterminate}${helpText} :checked="checked" @change="checked = $event.target.checked" />
</template>

<script setup>
import { ref } from 'vue';
import { DvToggle } from '@dv-uikit/vue';

const checked = ref(${args.checked});
</script>`;
	}
};

const { argTypes } = getStoryHelpers<ToggleArgs>('dv-toggle', {
	excludeCategories: ['properties']
});

if (argTypes['nameValue']) {
	argTypes['nameValue'] = {
		...argTypes['nameValue'],
		table: { disable: true },
		control: false
	};
}

if (argTypes['name-value']) {
	argTypes['name-value'] = {
		...argTypes['name-value'],
		table: { disable: true },
		control: false
	};
}

const meta: Meta<ToggleArgs> = {
	title: 'Components/Toggle',
	component: 'dv-toggle',
	tags: ['autodocs'],
	parameters: {
		componentSubtitle: '<DvToggle> | <dv-toggle>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: ToggleArgs }) => {
					const args = storyContext.args;
					return buildMultiFrameworkSource(toggleSnippets.react(args), toggleSnippets.vue(args));
				}
			}
		}
	},
	argTypes,
	args: {
		checked: false,
		disabled: false,
		indeterminate: false,
		label: 'Default toggle',
		helpText: ''
	}
};

export default meta;
type Story = StoryObj<ToggleArgs>;

function renderToggle(args: ToggleArgs) {
	return html`<dv-toggle
		name-value="toggle-field"
		label=${args.label}
		?checked=${args.checked}
		?disabled=${args.disabled}
		?indeterminate=${args.indeterminate}
		help-text=${args.helpText}
		value=${args.value}
	></dv-toggle>`;
}

export const Playground: Story = {
	render: (args) => renderToggle(args)
};

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'The default unchecked toggle state.'
			}
		}
	},
	render: (args) => renderToggle(args)
};

export const Checked: Story = {
	args: {
		checked: true,
		label: 'Notifications enabled'
	},
	parameters: {
		docs: {
			description: {
				story: 'A toggle in the checked state.'
			}
		}
	},
	render: (args) => renderToggle(args)
};

export const Disabled: Story = {
	args: {
		disabled: true,
		label: 'Disabled setting'
	},
	parameters: {
		docs: {
			description: {
				story: 'A disabled toggle that cannot be changed by user interaction.'
			}
		}
	},
	render: (args) => renderToggle(args)
};

export const Indeterminate: Story = {
	args: {
		indeterminate: true,
		label: 'Indeterminate state'
	},
	parameters: {
		docs: {
			description: {
				story:
					'An indeterminate toggle used to represent a mixed or partial state, typically as an an status flag for a collection of related toggles.'
			}
		}
	},
	render: (args) => renderToggle(args)
};

export const IndeterminateChecked: Story = {
	args: {
		checked: true,
		indeterminate: true,
		label: 'Indeterminate overrides checked'
	},
	parameters: {
		docs: {
			description: {
				story:
					'When both `checked` and `indeterminate` are true, the indeterminate state takes visual priority — the mixed-state indicator is shown and the checked styling is suppressed.'
			}
		}
	},
	render: (args) => renderToggle(args)
};

export const WithHelpText: Story = {
	args: {
		helpText: 'Use this setting to enable background synchronization.',
		label: 'Background sync'
	},
	parameters: {
		docs: {
			description: {
				story: 'A toggle with help text for additional context.'
			}
		}
	},
	render: (args) => renderToggle(args)
};


