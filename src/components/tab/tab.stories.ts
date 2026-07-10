import type { Meta, StoryObj } from '@storybook/web-components-vite';

type DvTabArgs = {
  label: string;
};

const meta: Meta<DvTabArgs> = {
  title: 'Components/Tab',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' }
  },
  args: {
    label: 'DvTab'
  },
  render: ({ label }) => `<dv-tab label="${label}"></dv-tab>`
};

export default meta;

type Story = StoryObj<DvTabArgs>;

export const Default: Story = {
  args: {}
};
