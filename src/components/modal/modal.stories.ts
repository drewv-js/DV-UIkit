import type { Meta, StoryObj } from '@storybook/web-components-vite';

type DvModalArgs = {
  label: string;
};

const meta: Meta<DvModalArgs> = {
  title: 'Components/Modal',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' }
  },
  args: {
    label: 'DvModal'
  },
  render: ({ label }) => `<dv-modal label="${label}"></dv-modal>`
};

export default meta;

type Story = StoryObj<DvModalArgs>;

export const Default: Story = {
  args: {}
};
