import type { Meta, StoryObj } from '@storybook/web-components-vite';

type DvFooterArgs = {
  leftText: string;
  rightText: string;
};

const meta: Meta<DvFooterArgs> = {
  title: 'Components/Footer',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Page footer container for secondary information such as copyright, legal links, or build metadata.'
      }
    }
  },
  argTypes: {
    leftText: {
      control: 'text',
      description: 'Text displayed on the left side of the footer.'
    },
    rightText: {
      control: 'text',
      description: 'Text displayed on the right side of the footer.'
    }
  },
  args: {
    leftText: '© 2026 DV UI Kit',
    rightText: 'All rights reserved'
  },
  render: ({ leftText, rightText }) =>
    `<dv-footer><span>${leftText}</span><span>${rightText}</span></dv-footer>`
};

export default meta;

type Story = StoryObj<DvFooterArgs>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Standard footer content with legal copy and supporting information.'
      }
    }
  }
};

export const Compact: Story = {
  args: {
    leftText: 'Untitled Footer',
    rightText: 'v1.0.0'
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact metadata-focused footer often used in app shells and internal tools.'
      }
    }
  }
};
