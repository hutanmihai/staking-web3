'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { mainnet, sepolia, localhost } from 'wagmi/chains'

const config = createConfig({
  chains: [mainnet, sepolia, localhost],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [localhost.id]: http(),
  },
})
const queryClient = new QueryClient()

type TGlobalProvidersProps = {
  children: ReactNode
}

function GlobalProviders({ children }: TGlobalProvidersProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default GlobalProviders
