import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { Components } from '../../components';
import { html, TemplateResult } from 'lit';
import { getStoryHelpers, buildMultiFrameworkSource } from '../../internal/storybook-helpers';

type BreadcrumbItemArgs = Components.DvBreadcrumbItem;

type BreadcrumbItemSnippetOptions = {
	active?: boolean;
	disabled?: boolean;
};

const getBreadcrumbItemSnippetOptions = (storyId?: string): BreadcrumbItemSnippetOptions => ({
	active: storyId === 'components-breadcrumb-breadcrumb-item--active-state',
	disabled: storyId === 'components-breadcrumb-breadcrumb-item--disabled-state'
});

const buildReactBreadcrumbItemSnippet = (args: BreadcrumbItemArgs, options: BreadcrumbItemSnippetOptions = {}) => {
	const href = args.href || '#';
	const active = args.active || options.active ? ' active' : '';
	const disabled = args.disabled || options.disabled ? ' disabled' : '';
	const size = args.size !== 'md' ? ` size="${args.size}"` : '';

	return `import { DvBreadcrumb, DvBreadcrumbItem } from '@dv-uikit/react';

function App() {
  const handleBreadcrumbItemClick = (event) => {
    const breadcrumbItem = event.target;
    // Navigate using your router here (e.g. navigate(breadcrumbItem.href))
  };

  return (
    <DvBreadcrumb>
      <DvBreadcrumbItem href="${href}"${active}${disabled}${size} onBreadcrumbItemClick={handleBreadcrumbItemClick}>
        Breadcrumb Link
      </DvBreadcrumbItem>
    </DvBreadcrumb>
  );
}`;
};

const buildVueBreadcrumbItemSnippet = (args: BreadcrumbItemArgs, options: BreadcrumbItemSnippetOptions = {}) => {
	const href = args.href || '#';
	const active = args.active || options.active ? ' active' : '';
	const disabled = args.disabled || options.disabled ? ' disabled' : '';
	const size = args.size !== 'md' ? ` size="${args.size}"` : '';

	return `<template>
  <dv-breadcrumb>
    <dv-breadcrumb-item href="${href}"${active}${disabled}${size} @breadcrumb-item-click="handleBreadcrumbItemClick">
      Breadcrumb Link
    </dv-breadcrumb-item>
  </dv-breadcrumb>
</template>

<script setup>
import { DvBreadcrumb, DvBreadcrumbItem } from '@dv-uikit/vue';

const handleBreadcrumbItemClick = (event) => {
  const breadcrumbItem = event.target;
  // Navigate using your router here (e.g. router.push(breadcrumbItem.href))
};
</script>`;
};

const { argTypes } = getStoryHelpers<BreadcrumbItemArgs>('dv-breadcrumb-item', {
	excludeCategories: ['properties']
});

const meta: Meta<BreadcrumbItemArgs> = {
	title: 'Components/Breadcrumb/Breadcrumb Item',
	component: 'dv-breadcrumb-item',
	tags: ['autodocs'],
	parameters: {
		componentSubtitle: '<DvBreadcrumbItem> | <dv-breadcrumb-item>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: BreadcrumbItemArgs; id?: string }) => {
					const args = storyContext.args;
					const options = getBreadcrumbItemSnippetOptions(storyContext.id);
					return buildMultiFrameworkSource(
						buildReactBreadcrumbItemSnippet(args, options),
						buildVueBreadcrumbItemSnippet(args, options)
					);
				}
			}
		}
	},
	argTypes: {
		...argTypes
	},
	args: {
		active: false,
		disabled: false,
		href: '/home',
		size: 'md'
	}
};

export default meta;
type Story = StoryObj<BreadcrumbItemArgs>;

const renderWrapper = (content: TemplateResult) => html`
	<div style="padding: 1rem; background: var(--dv-color-surface);">${content}</div>
`;

export const Playground: Story = {
	render: (args) =>
		renderWrapper(html`
			<dv-breadcrumb-item href=${args.href} size=${args.size} ?active=${args.active} ?disabled=${args.disabled}>
				Breadcrumb Link
			</dv-breadcrumb-item>
		`)
};

export const DefaultState: Story = {
	parameters: {
		docs: {
			description: {
				story: 'A breadcrumb item in its default state, rendered as a navigable link.'
			}
		}
	},
	render: (args) =>
		renderWrapper(html`
			<dv-breadcrumb-item href="/home" size=${args.size} ?active=${args.active} ?disabled=${args.disabled}>
				Home
			</dv-breadcrumb-item>
		`)
};

export const ActiveState: Story = {
	args: {
		active: true
	},
	parameters: {
		docs: {
			description: {
				story:
					'An active breadcrumb item representing the current page. It is not interactive and sets `aria-current="page"`.'
			}
		}
	},
	render: (args) =>
		renderWrapper(html`
			<dv-breadcrumb-item href="/current" size=${args.size} ?active=${args.active} ?disabled=${args.disabled}>
				Current Page
			</dv-breadcrumb-item>
		`)
};

export const DisabledState: Story = {
	args: {
		disabled: true
	},
	parameters: {
		docs: {
			description: {
				story: 'A disabled breadcrumb item that prevents user interaction.'
			}
		}
	},
	render: (args) =>
		renderWrapper(html`
			<dv-breadcrumb-item href="/home" size=${args.size} ?active=${args.active} ?disabled=${args.disabled}>
				Disabled Item
			</dv-breadcrumb-item>
		`)
};


