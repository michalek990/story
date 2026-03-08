import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserForm } from './user-form'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

const meta: Meta<typeof UserForm> = {
  component: UserForm,
  title: 'Features/Users/UserForm',
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div className="w-[480px]">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof UserForm>

export const Tworzenie: Story = {
  args: {
    onSubmit: (data) => console.log('Submit:', data),
    submitLabel: 'Dodaj uzytkownika',
    isLoading: false,
  },
}

export const Edycja: Story = {
  args: {
    defaultValues: {
      firstName: 'Anna',
      lastName: 'Kowalska',
      email: 'anna.kowalska@szpital.pl',
      role: 'admin',
      institutionId: 'inst-1',
      facilityId: 'fac-1',
    },
    onSubmit: (data) => console.log('Submit:', data),
    submitLabel: 'Zapisz zmiany',
    isLoading: false,
  },
}

export const Zapisywanie: Story = {
  args: {
    onSubmit: () => {},
    submitLabel: 'Zapisz zmiany',
    isLoading: true,
  },
}