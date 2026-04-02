import { QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import type { PropsWithChildren } from 'react'
import { queryClient } from '@/shared/config/queryClient'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1f6feb',
          borderRadius: 10,
        },
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ConfigProvider>
  )
}
