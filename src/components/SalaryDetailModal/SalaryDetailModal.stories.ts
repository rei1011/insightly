import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SalaryDetailModalView } from './SalaryDetailModal';

const meta = {
  title: 'Components/SalaryDetailModal',
  component: SalaryDetailModalView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SalaryDetailModalView>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = [
  { age: 35, occupationName: 'ソフトウェアエンジニア', annualSalary: 1200 },
  { age: 30, occupationName: 'プロダクトマネージャー', annualSalary: 1100 },
  { age: 28, occupationName: 'ソフトウェアエンジニア', annualSalary: 950 },
  { age: 40, occupationName: 'データサイエンティスト', annualSalary: 900 },
  { age: 33, occupationName: 'デザイナー', annualSalary: 800 },
];

export const Default: Story = {
  args: {
    companyName: '株式会社サンプル',
    data: sampleData,
    loading: false,
    error: false,
    onClose: () => {},
  },
};

export const Loading: Story = {
  args: {
    companyName: '株式会社サンプル',
    data: [],
    loading: true,
    error: false,
    onClose: () => {},
  },
};

export const Empty: Story = {
  args: {
    companyName: '株式会社サンプル',
    data: [],
    loading: false,
    error: false,
    onClose: () => {},
  },
};

export const Error: Story = {
  args: {
    companyName: '株式会社サンプル',
    data: [],
    loading: false,
    error: true,
    onClose: () => {},
  },
};
