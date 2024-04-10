'use client'

import MaxWidthWrapper from '@/components/max-width-wrapper'
import Staking from '@/components/staking'
import { Card } from '@/components/ui/card'
import { useAccount } from 'wagmi'

export default function RootPage() {
  return (
    <MaxWidthWrapper className="max-h-screen">
      <div className="mt-10 grid grid-rows-2 gap-10">
        <div className="row-span-1 grid grid-cols-4 gap-10">
          <section className="col-span-2">
            <Staking />
          </section>
          <section className="col-span-2">
            <Card className="h-max bg-black text-center">
              <p>TODO</p>
            </Card>
          </section>
        </div>
        <div className="row-span-1">
          <Card className="h-max bg-black text-center">
            <p>TODO</p>
          </Card>
        </div>
      </div>
    </MaxWidthWrapper>
  )
}
