import { render, screen } from '@testing-library/react'
import { describe, expect, it } from '@jest/globals'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('renders initialized title and antd button', () => {
    render(<HomePage />)

    expect(screen.getByRole('heading', { name: /react 19 app initialized/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /ant design ready/i })).toBeTruthy()
  })
})
