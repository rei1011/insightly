import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { CompanyFilter } from './CompanyFilter';

const meta = {
  title: 'Components/CompanyFilter',
  component: CompanyFilter,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CompanyFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithValue: Story = {
  args: {
    companyName: 'トヨタ',
  },
};
