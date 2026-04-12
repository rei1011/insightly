import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { RankingChart } from './RankingChart';

const meta = {
  title: 'Components/RankingChart',
  component: RankingChart,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RankingChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = Array.from({ length: 30 }, (_, i) => ({
  rank: i + 1,
  companyName: `株式会社サンプル${String.fromCharCode(65 + (i % 26))}${i >= 26 ? String(Math.floor(i / 26)) : ''}`,
  avgSalary: 1500 - i * 30,
  count: 80 - i * 2,
}));

export const Default: Story = {
  args: {
    data: sampleData,
  },
};

export const WithFewItems: Story = {
  args: {
    data: sampleData.slice(0, 5),
  },
};

export const Empty: Story = {
  args: {
    data: [],
  },
};
