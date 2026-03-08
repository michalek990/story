import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '@/app/providers/auth-provider'
import { LoginForm } from './login-form'

const queryClient = new QueryClient()

const meta: Meta<typeof LoginForm> = {
  component: LoginForm,
  title: 'Features/Auth/LoginForm',
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthProvider>
            <div className="w-96">
              <Story />
            </div>
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof LoginForm>

export const Default: Story = {}