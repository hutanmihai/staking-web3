'use client'

import AccountDetails from '@/components/account-details'
import MaxWidthWrapper from '@/components/max-width-wrapper'
import Positions from '@/components/positions'
import Staking from '@/components/staking'
import { Card } from '@/components/ui/card'

export default function RootPage() {
  return (
    <MaxWidthWrapper className="max-h-screen">
      <div className="mt-10 grid grid-rows-2 gap-10">
        <div className="row-span-1 grid grid-cols-4 gap-10">
          <section className="col-span-2">
            <AccountDetails />
          </section>
          <section className="col-span-2">
            <Staking />
          </section>
        </div>
        <div className="row-span-1">
          <Positions />
        </div>
      </div>
    </MaxWidthWrapper>
  )
}
