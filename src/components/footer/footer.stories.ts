import type { Meta, StoryObj } from '@storybook/web-components-vite';

type DvFooterArgs = {
  label: string;
};

const meta: Meta<DvFooterArgs> = {
  title: 'Components/Footer',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' }
  },
  args: {
    label: 'DvFooter'
  },
  render: ({ label }) => `<dv-footer label="${label}"></dv-footer>`
};

export default meta;

type Story = StoryObj<DvFooterArgs>;

export const Default: Story = {
  args: {}
};
