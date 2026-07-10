import type { Meta, StoryObj } from '@storybook/web-components-vite';

type DvAvatarArgs = {
  label: string;
};

const meta: Meta<DvAvatarArgs> = {
  title: 'Components/Avatar',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' }
  },
  args: {
    label: 'DvAvatar'
  },
  render: ({ label }) => `<dv-avatar label="${label}"></dv-avatar>`
};

export default meta;

type Story = StoryObj<DvAvatarArgs>;

export const Default: Story = {
  args: {}
};
