import type { Meta, StoryObj } from '@storybook/web-components-vite';

type DvTextareaArgs = {
  label: string;
};

const meta: Meta<DvTextareaArgs> = {
  title: 'Components/Textarea',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' }
  },
  args: {
    label: 'DvTextarea'
  },
  render: ({ label }) => `<dv-textarea label="${label}"></dv-textarea>`
};

export default meta;

type Story = StoryObj<DvTextareaArgs>;

export const Default: Story = {
  args: {}
};
