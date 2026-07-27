import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { Components } from '../../components';
import { getColorGroups } from '../../internal/color';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

type CalloutArgs = Components.DvCallout;

type CalloutSnippetOptions = {
	Footer?: boolean;
};

const statusColors = getColorGroups(['status']);
const availableVariants = Object.keys(statusColors);

const getCalloutSnippetOptions = (storyId?: string): CalloutSnippetOptions => ({
	Footer: storyId === 'components-callout--footer'
});

const buildReactCalloutSnippet = (args: CalloutArgs, options: CalloutSnippetOptions = {}) => {
	const imports = ['DvCallout'];
	const color = args.color ?? 'info';

	const props = [
		color !== 'info' ? ` color="${String(color)}"` : '',
		args.label ? ` label="${args.label}"` : '',
		args.icon ? '' : ' icon="false"',
		args.closable ? '' : ' closable="false"',
		' onClick={handleClick}'
	].join('');

	const content = [
		'      <span>This is some more information about the callout.</span>',
		options.Footer ? '      <a slot="footer" href="#">Learn more</a>' : ''
	]
		.filter(Boolean)
		.join('\n');

	return `import { ${imports.join(', ')} } from '@dv-uikit/react';

	function App() {
		const handleClick = () => {};

		return (
			<DvCallout${props}>
	${content}
			</DvCallout>
		);
	}`;
};

const buildVueCalloutSnippet = (args: CalloutArgs, options: CalloutSnippetOptions = {}) => {
	const imports = ['DvCallout'];
	const color = args.color ?? 'info';

	const props = [
		color !== 'info' ? ` color="${String(color)}"` : '',
		args.label ? ` label="${args.label}"` : '',
		args.icon ? '' : ' icon="false"',
		args.closable ? '' : ' closable="false"',
		' @click={handleClick}'
	].join('');

	const content = [
		'    <span>This is some more information about the callout.</span>',
		options.Footer ? '    <template #footer>\n      <a href="#">Learn more</a>\n    </template>' : ''
	]
		.filter(Boolean)
		.join('\n');

	return `<template>
  <dv-callout${props}>
${content}
  </dv-callout>
</template>

<script setup>
import { ${imports.join(', ')} } from '@dv-uikit/vue';

const handleClick = () => {};
</script>`;
};

const { argTypes } = getStoryHelpers<CalloutArgs>('dv-callout', {
	excludeCategories: ['properties']
});

const meta: Meta<CalloutArgs> = {
	title: 'Components/Callout',
	component: 'dv-callout',
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		componentSubtitle: '<DvCallout> | <dv-callout>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: CalloutArgs; id?: string }) => {
					const args = storyContext.args;
					const options = getCalloutSnippetOptions(storyContext.id);
					return buildMultiFrameworkSource(
						buildReactCalloutSnippet(args, options),
						buildVueCalloutSnippet(args, options)
					);
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
		label: '',
		icon: true,
		closable: true
	}
};

export default meta;
type Story = StoryObj<CalloutArgs>;

function renderCallout(args: CalloutArgs, content?: unknown) {
	return html`
		<dv-callout color=${args.color} label=${args.label} icon=${args.icon} closable=${args.closable}
			>${content}</dv-callout
		>
	`;
}

export const Playground: Story = {
	render: (args) => renderCallout(args, html`<span>This is some more information about the callout.</span>`)
};

export const Information: Story = {
	args: {
		label: 'Information Callout!'
	},
	parameters: {
		docs: {
			description: {
				story: 'An Info Callout. Used to display important information.'
			}
		}
	},
	render: (args) => renderCallout(args, html`<span>This is some more information about the callout.</span>`)
};

export const Success: Story = {
	args: {
		color: 'success',
		label: 'Success!'
	},
	parameters: {
		docs: {
			description: {
				story: 'A Success Callout. Used to indicate successful actions.'
			}
		}
	},
	render: (args) => renderCallout(args, html`<span>Your order has been submitted!</span>`)
};

export const Warning: Story = {
	args: {
		color: 'warning',
		label: 'Warning!'
	},
	parameters: {
		docs: {
			description: {
				story: 'A Warning Callout. Used to indicate potential issues.'
			}
		}
	},
	render: (args) => renderCallout(args, html`<span>Please review your information before proceeding.</span>`)
};

export const Error: Story = {
	args: {
		color: 'error',
		label: 'Error!'
	},
	parameters: {
		docs: {
			description: {
				story: 'An Error Callout. Used to indicate critical issues or errors.'
			}
		}
	},
	render: (args) => renderCallout(args, html`<span>Something went wrong. Please try again.</span>`)
};

export const Neutral: Story = {
	args: {
		color: 'neutral',
		label: 'Information!'
	},
	parameters: {
		docs: {
			description: {
				story: 'A Neutral Callout. Used for general information.'
			}
		}
	},
	render: (args) => renderCallout(args, html`<span>Here is some general information for your reference.</span>`)
};

export const MultipleLines: Story = {
	args: {
		color: 'info',
		label: 'Information!'
	},
	parameters: {
		docs: {
			description: {
				story: 'A Multiple Lines Callout. Demonstrates the callout with multiple lines.'
			}
		}
	},
	render: (args) =>
		renderCallout(
			args,
			html`<span>This is some more information about the callout.</span><br />
				<span>This is a second line with more information.</span>`
		)
};

export const WithoutIcons: Story = {
	args: {
		label: 'No Icons',
		icon: false
	},
	parameters: {
		docs: {
			description: {
				story: 'A callout with no status indicator icon.'
			}
		}
	},
	render: (args) => renderCallout(args, html`<span>This callout has no icon.</span>`)
};

export const WithoutLabel: Story = {
	parameters: {
		docs: {
			description: {
				story: 'A callout with no label.'
			}
		}
	},
	render: (args) => renderCallout(args, html`<span>This callout has no label.</span>`)
};

export const NotClosable: Story = {
	args: {
		color: 'neutral',
		label: 'Non-closable Callout',
		closable: false
	},
	parameters: {
		docs: {
			description: {
				story: 'A callout with no close icon.'
			}
		}
	},
	render: (args) => renderCallout(args, html`<span>This callout is not closable.</span>`)
};

export const Footer: Story = {
	args: {
		color: 'neutral',
		label: 'Call to Action'
	},
	parameters: {
		docs: {
			description: {
				story: "A callout with a call to action in the 'footer' slot."
			}
		}
	},
	render: (args) =>
		renderCallout(
			args,
			html`<span>This callout contains a call to action link.</span>
				<a href="#" slot="footer" class="body-sm">Learn more</a>`
		)
};

export const Actions: Story = {
	args: {
		color: 'info',
		label: 'Actions Callout'
	},
	parameters: {
		docs: {
			description: {
				story: "A callout with a link in the 'actions' slot."
			}
		}
	},
	render: (args) =>
		renderCallout(
			args,
			html`<span>This callout contains an actions link.</span>
				<a href="#" slot="actions" class="body-sm">Actions link</a>`
		)
};


