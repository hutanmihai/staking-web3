'use client'

import { wagmiConfig } from '@/wagmi-config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'

const queryClient = new QueryClient()

type TGlobalProvidersProps = {
  children: ReactNode
}

function GlobalProviders({ children }: TGlobalProvidersProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default GlobalProviders
