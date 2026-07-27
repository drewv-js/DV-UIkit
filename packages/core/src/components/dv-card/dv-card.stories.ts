import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { Components } from '../../components';
import { html } from 'lit';
import { getStoryHelpers, buildMultiFrameworkSource } from '../../internal/storybook-helpers';

type CardArgs = Components.DvCard;

type CardSnippetOptions = {
	withHeader?: boolean;
	content?: string;
};

const getCardSnippetOptions = (storyId?: string): CardSnippetOptions => {
	const noHeader =
		storyId === 'components-card--subtle-no-header-card' || storyId === 'components-card--no-header-card';

	return {
		withHeader: !noHeader,
		content: noHeader
			? 'This is a basic card that has a no header title or icon, just a description in the content area.'
			: 'This is a basic card that has a header title, an icon and a description in the content area.'
	};
};

const buildReactCardSnippet = (args: CardArgs, options: CardSnippetOptions = {}) => {
	const imports = options.withHeader ? ['DvCard', 'DvIconButton'] : ['DvCard'];
	const color = args.color !== 'default' ? ` color="${args.color}"` : '';
	const header = options.withHeader
		? `\n      <div slot="header-text">Header title</div>\n      <DvIconButton slot="header-icon" name="gear" />`
		: '';

	return `import { ${imports.join(', ')} } from '@dv-uikit/react';

function App() {
  return (
    <DvCard${color}>${header}
      <div>
        ${options.content}
      </div>
    </DvCard>
  );
}`;
};

const buildVueCardSnippet = (args: CardArgs, options: CardSnippetOptions = {}) => {
	const imports = options.withHeader ? ['DvCard', 'DvIconButton'] : ['DvCard'];
	const color = args.color !== 'default' ? ` color="${args.color}"` : '';
	const header = options.withHeader
		? `\n    <template #header-text>Header title</template>\n    <template #header-icon>\n      <dv-icon-button name="gear" />\n    </template>`
		: '';

	return `<template>
  <dv-card${color}>${header}
    <div>
      ${options.content}
    </div>
  </dv-card>
</template>

<script setup>
import { ${imports.join(', ')} } from '@dv-uikit/vue';
</script>`;
};

const { argTypes } = getStoryHelpers<CardArgs>('dv-card', {
	excludeCategories: ['properties']
});

const meta: Meta<CardArgs> = {
	title: 'Components/Card',
	component: 'dv-card',
	tags: ['autodocs'],
	parameters: {
		componentSubtitle: '<DvCard> | <dv-card>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: CardArgs; id?: string }) => {
					const args = storyContext.args;
					const options = getCardSnippetOptions(storyContext.id);
					return buildMultiFrameworkSource(buildReactCardSnippet(args, options), buildVueCardSnippet(args, options));
				}
			}
		}
	},
	argTypes: {
		...argTypes,
		color: {
			...argTypes['color'],
			control: 'select',
			options: ['default', 'subtle']
		}
	},
	args: {
		color: 'default'
	}
};

export default meta;
type Story = StoryObj<CardArgs>;

function renderBasicCard(args: CardArgs) {
	return html`
		<dv-card color=${args.color}>
			<div slot="header-text">Header title</div>
			<div slot="header-icon"><dv-icon-button name="gear"></dv-icon-button></div>
			<div>
				This is a basic card that has a header title, an icon and a description in the content area. If you add more
				information in this content area the content area will scroll vertically (as shown in the scrollable story
				below).
			</div>
		</dv-card>
	`;
}

function renderNoHeaderCard(args: CardArgs) {
	return html`
		<dv-card color=${args.color}>
			<div>This is a basic card that has a no header title or icon, just a description in the content area.</div>
		</dv-card>
	`;
}

export const Playground: Story = {
	render: (args) => renderBasicCard(args)
};

export const BasicCard: Story = {
	parameters: {
		docs: {
			description: {
				story: 'A basic card with a custom header and body content.'
			}
		}
	},
	render: (args) => renderBasicCard(args)
};

export const SubtleCard: Story = {
	args: {
		color: 'subtle'
	},
	parameters: {
		docs: {
			description: {
				story: 'A card with a subtle background color.'
			}
		}
	},
	render: (args) => renderBasicCard(args)
};

export const SubtleNoHeaderCard: Story = {
	args: {
		color: 'subtle'
	},
	parameters: {
		docs: {
			description: {
				story: 'A card without a header using the subtle background color.'
			}
		}
	},
	render: (args) => renderNoHeaderCard(args)
};

export const NoHeaderCard: Story = {
	parameters: {
		docs: {
			description: {
				story: 'A card without a header, showcasing a minimal design.'
			}
		}
	},
	render: (args) => renderNoHeaderCard(args)
};


