'use client'

import AccountDetails from '@/components/account-details'
import MaxWidthWrapper from '@/components/max-width-wrapper'
import Positions from '@/components/positions'
import Staking from '@/components/staking'
import { Card } from '@/components/ui/card'

export default function RootPage() {
  return (
    <MaxWidthWrapper className="max-h-screen">
      <div className="mt-10 flex flex-col items-center justify-center gap-10">
        <div className="grid w-full grid-cols-4 gap-10">
          <section className="col-span-2">
            <AccountDetails />
          </section>
          <section className="col-span-2">
            <Staking />
          </section>
        </div>
        <div className="w-full">
          <Positions />
        </div>
      </div>
    </MaxWidthWrapper>
  )
}
