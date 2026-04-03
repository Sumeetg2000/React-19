import { render, screen } from '@testing-library/react'
import { describe, expect, it } from '@jest/globals'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('renders blog title and navigation actions', () => {
    const queryClient = new QueryClient()

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(screen.getByRole('heading', { name: /blog studio/i })).toBeTruthy()
    expect(screen.getByRole('link', { name: /create blog/i })).toBeTruthy()
  })
})
