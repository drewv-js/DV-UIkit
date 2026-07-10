import type { Meta, StoryObj } from '@storybook/web-components-vite';

type DvTextfieldArgs = {
  label: string;
};

const meta: Meta<DvTextfieldArgs> = {
  title: 'Components/Textfield',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' }
  },
  args: {
    label: 'DvTextfield'
  },
  render: ({ label }) => `<dv-textfield label="${label}"></dv-textfield>`
};

export default meta;

type Story = StoryObj<DvTextfieldArgs>;

export const Default: Story = {
  args: {}
};
