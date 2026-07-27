import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { Components } from '../../components';
import { getStoryHelpers, buildMultiFrameworkSource, type ComponentSnippets } from '../../internal/storybook-helpers';

type AvatarArgs = Components.DvAvatar;

const avatarSnippets: ComponentSnippets<AvatarArgs> = {
	react: (args) => {
		const initials = args.initials ? ` initials="${args.initials}"` : '';
		const size = args.size !== 'md' ? ` size="${args.size}"` : '';
		const knockout = args.knockout ? ' knockout' : '';
		const image = args.image ? ` image="${args.image}"` : '';
		return `import { DvAvatar } from '@dv-uikit/react';

function App() {
  return (
    <DvAvatar label="${args.label}"${initials}${size}${knockout}${image} />
  );
}`;
	},
	vue: (args) => {
		const initials = args.initials ? ` initials="${args.initials}"` : '';
		const size = args.size !== 'md' ? ` size="${args.size}"` : '';
		const knockout = args.knockout ? ' knockout' : '';
		const image = args.image ? ` image="${args.image}"` : '';
		return `<template>
  <dv-avatar label="${args.label}"${initials}${size}${knockout}${image} />
</template>

<script setup>
import { DvAvatar } from '@dv-uikit/vue';
</script>`;
	}
};

const { argTypes } = getStoryHelpers<AvatarArgs>('dv-avatar', {
	excludeCategories: ['properties']
});

const meta: Meta<AvatarArgs> = {
	title: 'Components/Avatar',
	component: 'dv-avatar',
	tags: ['autodocs'],
	parameters: {
		componentSubtitle: '<DvAvatar> | <dv-avatar>',
		docs: {
			source: {
				transform: (_code: string, storyContext: { args: AvatarArgs }) => {
					const args = storyContext.args;
					return buildMultiFrameworkSource(avatarSnippets.react(args), avatarSnippets.vue(args));
				}
			}
		}
	},
	argTypes,
	args: {
		initials: '',
		label: 'Default Label',
		size: 'md',
		knockout: false,
		image: ''
	}
};

export default meta;
type Story = StoryObj<AvatarArgs>;

function renderAvatar(args: AvatarArgs) {
	return html`
		<dv-avatar
			initials=${ifDefined(args.initials || undefined)}
			label=${args.label}
			size=${args.size}
			?knockout=${args.knockout}
			image=${ifDefined(args.image || undefined)}
		></dv-avatar>
	`;
}

export const Playground: Story = {
	render: (args) => renderAvatar(args)
};

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'The default Avatar when not signed in or no name is used.'
			}
		}
	},
	render: (args) => renderAvatar(args)
};

export const DefaultKnockout: Story = {
	args: {
		knockout: true
	},
	parameters: {
		docs: {
			description: {
				story: 'The default Avatar using knockout styling when not signed in or no name is used.'
			}
		}
	},
	render: (args) => renderAvatar(args)
};

export const Small: Story = {
	args: {
		size: 'sm'
	},
	parameters: {
		docs: {
			description: {
				story: 'A small Avatar when not signed in or no name is used.'
			}
		}
	},
	render: (args) => renderAvatar(args)
};

export const SmallKnockout: Story = {
	args: {
		size: 'sm',
		knockout: true
	},
	parameters: {
		docs: {
			description: {
				story: 'A small Avatar with knockout styling when not signed in or no name is used.'
			}
		}
	},
	render: (args) => renderAvatar(args)
};

export const Initials: Story = {
	args: {
		initials: 'FM'
	},
	parameters: {
		docs: {
			description: {
				story: 'A medium Avatar using initials.'
			}
		}
	},
	render: (args) => renderAvatar(args)
};

export const InitialsKnockout: Story = {
	args: {
		initials: 'FM',
		knockout: true
	},
	parameters: {
		docs: {
			description: {
				story: 'A medium Avatar using initials with knockout styling.'
			}
		}
	},
	render: (args) => renderAvatar(args)
};

export const InitialsSmall: Story = {
	args: {
		initials: 'F',
		size: 'sm'
	},
	parameters: {
		docs: {
			description: {
				story: 'A small Avatar using initials.'
			}
		}
	},
	render: (args) => renderAvatar(args)
};

export const InitialsSmallKnockout: Story = {
	args: {
		initials: 'F',
		size: 'sm',
		knockout: true
	},
	parameters: {
		docs: {
			description: {
				story: 'A small Avatar using initials with knockout styling.'
			}
		}
	},
	render: (args) => renderAvatar(args)
};

export const Image: Story = {
	args: {
		image: 'https://images.unsplash.com/photo-1591871937573-74dbba515c4c'
	},
	parameters: {
		docs: {
			description: {
				story: 'An Avatar displaying a user image.'
			}
		}
	},
	render: (args) => renderAvatar(args)
};

export const ImageSmall: Story = {
	args: {
		size: 'sm',
		image: 'https://images.unsplash.com/photo-1591871937573-74dbba515c4c'
	},
	parameters: {
		docs: {
			description: {
				story: 'A small Avatar displaying a user image.'
			}
		}
	},
	render: (args) => renderAvatar(args)
};


