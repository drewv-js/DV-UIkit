import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getColorGroups } from '../../internal/color';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

type AlertArgs = Omit<Components.DvAlert, 'alertHide' | 'alertShow'>;

type AlertSnippetOptions = {
	Footer?: boolean;
};

const statusColors = getColorGroups(['status']);
const availableVariants = Object.keys(statusColors);

const getAlertSnippetOptions = (storyId?: string): AlertSnippetOptions => ({
	Footer: storyId === 'components-alert--footer'
});

const buildReactAlertSnippet = (args: AlertArgs, options: AlertSnippetOptions = {}) => {
	const imports = ['DvAlert'];
	const color = args.color ?? 'info';

	const props = [
		color !== 'info' ? ` color="${String(color)}"` : '',
		args.label ? ` label="${args.label}"` : '',
		args.icon ? '' : ' icon="false"',
		args.variant === 'global' ? ' variant="global"' : '',
		args.closable ? '' : ' closable="false"',
		' onClick={handleClick}'
	].join('');

	const content = [
		'      <span>This is some more information about the alert.</span>',
		options.Footer ? '      <a slot="footer" href="#">Learn more</a>' : ''
	]
		.filter(Boolean)
		.join('\n');

	return `import { ${imports.join(', ')} } from '@dv-uikit/react';

	function App() {
		const handleClick = () => {};

		return (
			<DvAlert${props}>
	${content
		.split('\n')
		.map((line) => '      ' + line)
		.join('\n')}
			</DvAlert>
		);
	}`;
};

const buildVueAlertSnippet = (args: AlertArgs, options: AlertSnippetOptions = {}) => {
	const imports = ['DvAlert'];
	const color = args.color ?? 'info';

	const props = [
		color !== 'info' ? ` color="${String(color)}"` : '',
		args.label ? ` label="${args.label}"` : '',
		args.icon ? '' : ' icon="false"',
		args.variant === 'global' ? ' variant="global"' : '',
		args.closable ? '' : ' closable="false"',
		' @click={handleClick}'
	].join('');

	const content = [
		'    <span>This is some more information about the alert.</span>',
		options.Footer ? '    <template #footer>\n      <a href="#">Learn more</a>\n    </template>' : ''
	]
		.filter(Boolean)
		.join('\n');

	return `<template>
  <dv-alert${props}>
${content}
  </dv-alert>
</template>

<script setup>
import { ${imports.join(', ')} } from '@dv-uikit/vue';

const handleClick = () => {};
</script>`;
};

const { argTypes } = getStoryHelpers<AlertArgs>('dv-alert', {
	excludeCategories: ['properties']
});

const meta: Meta<AlertArgs> = {
	title: 'Components/Alert',
	component: 'dv-alert',
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		componentSubtitle: '<DvAlert> | <dv-alert>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: AlertArgs; id?: string }) => {
					const args = storyContext.args;
					const options = getAlertSnippetOptions(storyContext.id);
					return buildMultiFrameworkSource(buildReactAlertSnippet(args, options), buildVueAlertSnippet(args, options));
				}
			}
		}
	},
	argTypes: {
		...argTypes,
		color: {
			...argTypes['color'],
			control: 'select',
			options: availableVariants
		}
	},
	args: {
		color: 'info',
		open: true,
		label: '',
		variant: 'local',
		icon: true,
		closable: true
	}
};

export default meta;
type Story = StoryObj<AlertArgs>;

function renderAlert(args: AlertArgs, content?: unknown) {
	return html`
		<dv-alert
			color=${args.color}
			?open=${args.open}
			label=${args.label}
			variant=${args.variant}
			icon=${args.icon}
			closable=${args.closable}
			>${content}</dv-alert
		>
	`;
}

export const Playground: Story = {
	render: (args) => renderAlert(args, html`<span>This is some more information about the alert.</span>`)
};

export const Information: Story = {
	args: {
		open: true,
		label: 'Information Alert!'
	},
	parameters: {
		docs: {
			description: {
				story: 'An Info Alert. Used to display important information.'
			}
		}
	},
	render: (args) => renderAlert(args, html`<span>This is some more information about the alert.</span>`)
};

export const Success: Story = {
	args: {
		color: 'success',
		open: true,
		label: 'Success!'
	},
	parameters: {
		docs: {
			description: {
				story: 'A Success Alert. Used to indicate successful actions.'
			}
		}
	},
	render: (args) => renderAlert(args, html`<span>Your order has been submitted!</span>`)
};

export const Warning: Story = {
	args: {
		color: 'warning',
		open: true,
		label: 'Warning!'
	},
	parameters: {
		docs: {
			description: {
				story: 'A Warning Alert. Used to indicate potential issues.'
			}
		}
	},
	render: (args) => renderAlert(args, html`<span>Please review your information before proceeding.</span>`)
};

export const Error: Story = {
	args: {
		color: 'error',
		open: true,
		label: 'Error!'
	},
	parameters: {
		docs: {
			description: {
				story: 'An Error Alert. Used to indicate critical issues or errors.'
			}
		}
	},
	render: (args) => renderAlert(args, html`<span>Something went wrong. Please try again.</span>`)
};

export const Neutral: Story = {
	args: {
		color: 'neutral',
		open: true,
		label: 'Information!'
	},
	parameters: {
		docs: {
			description: {
				story: 'A Neutral Alert. Used for general information.'
			}
		}
	},
	render: (args) => renderAlert(args, html`<span>Here is some general information for your reference.</span>`)
};

export const MultipleLines: Story = {
	args: {
		color: 'info',
		open: true,
		label: 'Information!'
	},
	parameters: {
		docs: {
			description: {
				story: 'A Multiple Lines Alert. Demonstrates the alert with multiple lines.'
			}
		}
	},
	render: (args) =>
		renderAlert(
			args,
			html`<span>This is some more information about the alert.</span><br />
				<span>This is a second line with more information.</span>`
		)
};

export const WithoutIcons: Story = {
	args: {
		open: true,
		label: 'No Icons',
		icon: false
	},
	parameters: {
		docs: {
			description: {
				story: 'An alert with no status indicator icon.'
			}
		}
	},
	render: (args) => renderAlert(args, html`<span>This alert has no icon.</span>`)
};

export const WithoutLabel: Story = {
	args: {
		open: true
	},
	parameters: {
		docs: {
			description: {
				story: 'An alert with no label.'
			}
		}
	},
	render: (args) => renderAlert(args, html`<span>This alert has no label.</span>`)
};

export const NotClosable: Story = {
	args: {
		color: 'neutral',
		open: true,
		label: 'Non-closable Alert',
		closable: false
	},
	parameters: {
		docs: {
			description: {
				story: 'An alert with no close icon.'
			}
		}
	},
	render: (args) => renderAlert(args, html`<span>This alert is not closable.</span>`)
};

export const Footer: Story = {
	args: {
		color: 'neutral',
		open: true,
		label: 'Call to Action'
	},
	parameters: {
		docs: {
			description: {
				story: "An alert with a call to action in the 'footer' slot."
			}
		}
	},
	render: (args) =>
		renderAlert(
			args,
			html`<span>This alert contains a call to action link.</span>
				<a href="#" slot="footer" class="body-sm">Learn more</a>`
		)
};

export const Local: Story = {
	args: {
		open: true,
		label: 'Unsaved Changes',
		variant: 'local'
	},
	parameters: {
		docs: {
			description: {
				story:
					'An alert in the local scope variant - these are used to provide feedback tied to a specific section or task on the page.  These alerts should be embedded within the page content, and should share the same width as the content, following the layout grid.  Use case examples: local validation, confirmations, section-level warnings/errors'
			}
		}
	},
	render: (args) =>
		renderAlert(args, html`<span>You have unsaved changes - please save before exiting the page.</span>`)
};

export const Global: Story = {
	args: {
		color: 'warning',
		open: true,
		label: 'Scheduled Downtime',
		variant: 'global'
	},
	parameters: {
		docs: {
			description: {
				story:
					'An alert in the global scope variant - these are used to communicate environment-level information that affects the account or overall system.  The placement for these alerts should be at the top of the page or top of a primary section, and should typically be full width.  Use case examples: outages, policy updates, account/billing issues'
			}
		}
	},
	render: (args) =>
		renderAlert(
			args,
			html`<span>The site will be down for scheduled mainenance on March 3rd from 12:00 AM to 4:00 AM EST</span>`
		)
};


