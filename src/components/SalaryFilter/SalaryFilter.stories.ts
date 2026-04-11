import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SalaryFilter } from './SalaryFilter';

const meta = {
  title: 'Components/SalaryFilter',
  component: SalaryFilter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SalaryFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithFromOnly: Story = {
  args: {
    salaryFrom: 500,
  },
};

export const WithToOnly: Story = {
  args: {
    salaryTo: 1000,
  },
};

export const WithRange: Story = {
  args: {
    salaryFrom: 600,
    salaryTo: 1200,
  },
};

export const WithBaseSalaryRange: Story = {
  args: {
    baseSalaryFrom: 400,
    baseSalaryTo: 800,
  },
};

export const WithAllFilters: Story = {
  args: {
    salaryFrom: 600,
    salaryTo: 1200,
    baseSalaryFrom: 400,
    baseSalaryTo: 800,
  },
};
