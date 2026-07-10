import type { Meta, StoryObj } from '@storybook/web-components-vite';

type AppBarArgs = {
  label: string;
};

const meta: Meta<AppBarArgs> = {
  title: 'Components/AppBar',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' }
  },
  args: {
    label: 'My App'
  },
  render: ({ label }) => `<dv-app-bar label="${label}"></dv-app-bar>`
};

export default meta;

type Story = StoryObj<AppBarArgs>;

export const Default: Story = {
  args: {}
};

export const CustomLabel: Story = {
  args: {
    label: 'Custom Title'
  }
};
