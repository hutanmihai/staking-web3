'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toWei } from '@/utils'
import { useEffect, useState } from 'react'
import { useAccount, useReadContract, useReadContracts, useWriteContract } from 'wagmi'
import { CONTRACT_ADDRESS, ABI } from '@/config'

function Staking() {
  const { address, status, addresses, chainId, chain } = useAccount()

  const [isStakeTabOpen, setIsStakeTabOpen] = useState(true)
  const [unstakeValue, setUnstakeValue] = useState(0)

  const [assetIds, setAssetIds] = useState<any[]>([])
  const [assets, setAssets] = useState([])
  const [amount, setAmount] = useState<number>(0)

  const { writeContract } = useWriteContract()

  const { data: assetsIds, refetch } = useReadContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
    functionName: 'getPositionIdsByAddress',
    args: [address!],
    query: {
      enabled: !!address,
    },
  })

  useEffect(() => {
    refetch()
    if (assetsIds) {
      setAssetIds(assetsIds)
    }
    console.log('assetsIds', assetsIds)
  }, [address, assetsIds])

  const toggleStakeTab = () => {
    setIsStakeTabOpen((prev) => !prev)
  }

  const contractConfig = assetIds.map((id) => ({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: ABI,
    functionName: 'getPositionById',
    args: [id],
    query: {
      enabled: !!assetIds,
    },
  }))

  const { data: contracts } = useReadContracts({
    contracts: contractConfig,
    query: {
      enabled: !!assetIds,
    },
  })

  useEffect(() => {
    if (contracts) {
      setAssets(contracts)
    }
    console.log('contracts', contracts)
  }, [contracts, assetsIds])

  const stakeEther = (stakingLength: number) => {
    const wei = toWei(amount.toString())
    writeContract({
      address: CONTRACT_ADDRESS,
      functionName: 'stakeEther',
      args: [BigInt(stakingLength)],
      abi: ABI,
      value: wei,
    })
  }

  const withDraw = (positionId: string) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      functionName: 'closePosition',
      args: [BigInt(positionId)],
      abi: ABI,
    })
  }

  return (
    <div>
      <h1>
        Status: {status}
        <br />
        Addresses: {JSON.stringify(addresses)}
        <br />
        Chain: {JSON.stringify(chain)}
        <br />
        chainId: {chainId}
      </h1>
      {isStakeTabOpen ? (
        <Card className="bg-black">
          <CardHeader>
            <Button onClick={toggleStakeTab} variant="secondary">
              {isStakeTabOpen ? 'Unstake' : 'Stake'}
            </Button>
          </CardHeader>
          <CardContent>
            <Input
              onChange={(e) => setAmount(Number(e.target.value))}
              maxLength={120}
              type="number"
              placeholder="Amount to stake"
              required
            />
            <Button className="mt-2 w-full" onClick={() => stakeEther(0)}>
              Stake
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-black">
          <CardHeader>
            <Button onClick={toggleStakeTab} variant="secondary">
              {isStakeTabOpen ? 'Unstake' : 'Stake'}
            </Button>
          </CardHeader>
          <CardContent>
            <Button className="mt-2 w-full" onClick={() => console.log('Unstake Clicked!')}>
              Unstake
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Staking
