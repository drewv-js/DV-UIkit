import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { Components } from '../../components';
import { html } from 'lit';
import { getStoryHelpers, buildMultiFrameworkSource } from '../../internal/storybook-helpers';

type NavigationItemArgs = Components.DvNavigationItem;

type NavigationItemSnippetOptions = {
	withIcon?: boolean;
	active?: boolean;
	disabled?: boolean;
	size?: 'sm' | 'md';
};

const getNavigationItemSnippetOptions = (storyId?: string): NavigationItemSnippetOptions => ({
	withIcon: storyId === 'components-navigation-navigation-item--with-icon',
	active: storyId === 'components-navigation-navigation-item--active-state',
	disabled: storyId === 'components-navigation-navigation-item--disabled-state',
	size: storyId === 'components-navigation-navigation-item--small-size' ? 'sm' : 'md'
});

const buildReactNavigationItemSnippet = (args: NavigationItemArgs, options: NavigationItemSnippetOptions = {}) => {
	const imports = options.withIcon ? ['DvNavigationItem', 'DvIcon'] : ['DvNavigationItem'];
	const href = args.href || '#';
	const active = args.active || options.active ? ' active' : '';
	const disabled = args.disabled || options.disabled ? ' disabled' : '';
	const size = (args.size || options.size) !== 'md' ? ` size="${args.size || options.size}"` : '';
	const supportingText = args.supportingText ? ` supportingText="${args.supportingText}"` : '';

	if (options.withIcon) {
		return `import { ${imports.join(', ')} } from '@dv-uikit/react';
import { useState } from 'react';

function App() {
  const [activePath, setActivePath] = useState('${href}');

  const handleNavigationItemClick = (event) => {
    const navigationItem = event.target;
    setActivePath(navigationItem.href);
    // Navigate using your router here
  };

  return (
    <DvNavigationItem href="/${href}"${active}${disabled}${size}${supportingText} onNavigationItemClick={handleNavigationItemClick}>
      <DvIcon slot="startIcon" name="home" />
      Home
    </DvNavigationItem>
  );
}`;
	}

	return `import { ${imports.join(', ')} } from '@dv-uikit/react';
import { useState } from 'react';

function App() {
  const [activePath, setActivePath] = useState('${href}');

  const handleNavigationItemClick = (event) => {
    const navigationItem = event.target;
    setActivePath(navigationItem.href);
    // Navigate using your router here
  };

  return (
    <DvNavigationItem href="/${href}"${active}${disabled}${size}${supportingText} onNavigationItemClick={handleNavigationItemClick}>
      Navigation Link
    </DvNavigationItem>
  );
}`;
};

const buildVueNavigationItemSnippet = (args: NavigationItemArgs, options: NavigationItemSnippetOptions = {}) => {
	const imports = options.withIcon ? ['DvNavigationItem', 'DvIcon'] : ['DvNavigationItem'];
	const href = args.href || '#';
	const active = args.active || options.active ? ` :active="activePath === '${href}'"` : '';
	const disabled = args.disabled || options.disabled ? ' disabled' : '';
	const size = (args.size || options.size) !== 'md' ? ` size="${args.size || options.size}"` : '';
	const supportingText = args.supportingText ? ` supporting-text="${args.supportingText}"` : '';

	if (options.withIcon) {
		return `<template>
  <dv-navigation-item href="/${href}"${active}${disabled}${size}${supportingText} @navigation-item-click="handleNavigationItemClick">
    <dv-icon slot="startIcon" name="home" />
    Home
  </dv-navigation-item>
</template>

<script setup>
import { ref } from 'vue';
import { ${imports.join(', ')} } from '@dv-uikit/vue';

const activePath = ref('${href}');

const handleNavigationItemClick = (event) => {
  const navigationItem = event.target;
  activePath.value = navigationItem.href;
  // Navigate using your router here
};
</script>`;
	}

	return `<template>
  <dv-navigation-item href="/${href}"${active}${disabled}${size}${supportingText} @navigation-item-click="handleNavigationItemClick">
    Navigation Link
  </dv-navigation-item>
</template>

<script setup>
import { ref } from 'vue';
import { ${imports.join(', ')} } from '@dv-uikit/vue';

const activePath = ref('${href}');

const handleNavigationItemClick = (event) => {
  const navigationItem = event.target;
  activePath.value = navigationItem.href;
  // Navigate using your router here
};
</script>`;
};

const { argTypes } = getStoryHelpers<NavigationItemArgs>('dv-navigation-item', {
	excludeCategories: ['properties']
});

const meta: Meta<NavigationItemArgs> = {
	title: 'Components/Navigation/Navigation Item',
	component: 'dv-navigation-item',
	tags: ['autodocs'],
	parameters: {
		componentSubtitle: '<DvNavigationItem> | <dv-navigation-item>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: NavigationItemArgs; id?: string }) => {
					const args = storyContext.args;
					const options = getNavigationItemSnippetOptions(storyContext.id);
					return buildMultiFrameworkSource(
						buildReactNavigationItemSnippet(args, options),
						buildVueNavigationItemSnippet(args, options)
					);
				}
			}
		}
	},
	argTypes: {
		...argTypes,
		size: {
			...argTypes['size'],
			control: 'select',
			options: ['sm', 'md']
		}
	},
	args: {
		active: false,
		disabled: false,
		size: 'md'
	}
};

export default meta;
type Story = StoryObj<NavigationItemArgs>;

const renderWrapper = (content: any) => html`
	<div style="width: 16rem; padding: 1rem; background: var(--dv-color-surface);">${content}</div>
`;

export const Playground: Story = {
	render: (args) =>
		renderWrapper(html`
			<dv-navigation-item
				href="/Navigation"
				?active=${args.active}
				?disabled=${args.disabled}
				size=${args.size}
				.supportingText=${args.supportingText}
			>
				Navigation Link
			</dv-navigation-item>
		`)
};

export const DefaultState: Story = {
	parameters: {
		docs: {
			description: {
				story: 'A navigation item in its default state with text only.'
			}
		}
	},
	render: (args) =>
		renderWrapper(html`
			<dv-navigation-item href="/Navigation" ?active=${args.active} ?disabled=${args.disabled} size=${args.size}>
				Navigation Link
			</dv-navigation-item>
		`)
};

export const WithIcon: Story = {
	parameters: {
		docs: {
			description: {
				story: 'A navigation item with a start icon using the startIcon slot.'
			}
		}
	},
	render: (args) =>
		renderWrapper(html`
			<dv-navigation-item href="/Home" ?active=${args.active} ?disabled=${args.disabled} size=${args.size}>
				<dv-icon slot="startIcon" name="home"></dv-icon>
				Home
			</dv-navigation-item>
		`)
};

export const ActiveState: Story = {
	args: {
		active: true
	},
	parameters: {
		docs: {
			description: {
				story: 'An active/selected navigation item with distinct styling to indicate the current page or section.'
			}
		}
	},
	render: (args) =>
		renderWrapper(html`
			<dv-navigation-item href="/Navigation" ?active=${args.active} ?disabled=${args.disabled} size=${args.size}>
				Active Item
			</dv-navigation-item>
		`)
};

export const DisabledState: Story = {
	args: {
		disabled: true
	},
	parameters: {
		docs: {
			description: {
				story: 'A disabled navigation item that prevents user interaction.'
			}
		}
	},
	render: (args) =>
		renderWrapper(html`
			<dv-navigation-item href="/Navigation" ?active=${args.active} ?disabled=${args.disabled} size=${args.size}>
				Disabled Item
			</dv-navigation-item>
		`)
};

export const SmallSize: Story = {
	args: {
		size: 'sm'
	},
	parameters: {
		docs: {
			description: {
				story: 'A navigation item with small size, featuring reduced padding and text size.'
			}
		}
	},
	render: (args) =>
		renderWrapper(html`
			<dv-navigation-item href="/Navigation" ?active=${args.active} ?disabled=${args.disabled} size=${args.size}>
				Small Item
			</dv-navigation-item>
		`)
};

export const WithSupportingText: Story = {
	args: {
		supportingText: 'Additional context'
	},
	parameters: {
		docs: {
			description: {
				story: 'A navigation item with supporting text displayed below the main label for additional context.'
			}
		}
	},
	render: (args) =>
		renderWrapper(html`
			<dv-navigation-item
				href="/projects"
				?active=${args.active}
				?disabled=${args.disabled}
				size=${args.size}
				.supportingText=${args.supportingText}
			>
				Projects
			</dv-navigation-item>
		`)
};


