import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { UsersTable } from './users-table'
import { mockUsers } from '@/app/shared/mocks/mock-data'

const queryClient = new QueryClient()

const meta: Meta<typeof UsersTable> = {
  component: UsersTable,
  title: 'Features/Users/UsersTable',
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </QueryClientProvider>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof UsersTable>

export const ZDanymi: Story = {
  args: {
    data: mockUsers,
    isLoading: false,
    isError: false,
  },
}

export const Ladowanie: Story = {
  args: {
    data: undefined,
    isLoading: true,
    isError: false,
  },
}

export const Blad: Story = {
  args: {
    data: undefined,
    isLoading: false,
    isError: true,
  },
}

export const BrakDanych: Story = {
  args: {
    data: [],
    isLoading: false,
    isError: false,
  },
}