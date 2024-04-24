'use client'

import MaxWidthWrapper from '@/components/max-width-wrapper'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi'

function Navbar() {
  const account = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <nav className="sticky inset-x-0 top-0 z-30 h-14 w-full border-b border-zinc-700 bg-black/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-700">
          <Link href="/" className="z-40 flex font-semibold">
            StakingWeb3.
          </Link>

          <div className="hidden items-center space-x-4 sm:flex">
            {!account.isConnected ? (
              <>
                {connectors.map((connector) => (
                  <Button key={connector.uid} onClick={() => connect({ connector })}>
                    CONNECT WALLET
                  </Button>
                ))}
              </>
            ) : (
              <Button onClick={() => disconnect()}>DISCONNECT WALLET</Button>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar
