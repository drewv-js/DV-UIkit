import type { Meta, StoryObj } from '@storybook/web-components-vite';

type CardArgs = {
  heading: string;
  content: string;
};

const meta: Meta<CardArgs> = {
  title: 'Components/Card',
  tags: ['autodocs'],
  argTypes: {
    heading: { control: 'text' },
    content: { control: 'text' }
  },
  args: {
    heading: 'Account',
    content: 'Manage your profile and settings.'
  },
  render: ({ heading, content }) =>
    `<dv-card heading="${heading}"><p>${content}</p></dv-card>`
};

export default meta;

type Story = StoryObj<CardArgs>;

export const Default: Story = {};

export const WithoutHeading: Story = {
  args: {
    heading: '',
    content: 'Card body without a heading.'
  }
};
