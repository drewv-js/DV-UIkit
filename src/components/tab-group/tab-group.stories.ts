import type { Meta, StoryObj } from '@storybook/web-components-vite';

type DvTabGroupArgs = {
  label: string;
};

const meta: Meta<DvTabGroupArgs> = {
  title: 'Components/TabGroup',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' }
  },
  args: {
    label: 'DvTabGroup'
  },
  render: ({ label }) => `<dv-tab-group label="${label}"></dv-tab-group>`
};

export default meta;

type Story = StoryObj<DvTabGroupArgs>;

export const Default: Story = {
  args: {}
};
