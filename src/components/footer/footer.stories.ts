import type { Meta, StoryObj } from '@storybook/web-components-vite';

type DvFooterArgs = {
  leftText: string;
  rightText: string;
};

const meta: Meta<DvFooterArgs> = {
  title: 'Components/Footer',
  tags: ['autodocs'],
  argTypes: {
    leftText: { control: 'text' },
    rightText: { control: 'text' }
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
  args: {}
};

export const Compact: Story = {
  args: {
    leftText: 'Untitled Footer',
    rightText: 'v1.0.0'
  }
};
