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

  const [assets, setAssets] = useState([])
  const [amount, setAmount] = useState<number>(0)
  const { writeContract } = useWriteContract()

  const {
    data: assetsIds,
    isSuccess: assetsIdsFetched,
    isPending,
  } = useReadContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
    functionName: 'getPositionIdsByAddress',
    args: [address!],
    query: {
      enabled: !!address,
    },
  })

  const contractsConfig = assetsIdsFetched
    ? assetsIds.map((id) => ({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'positions',
        args: [id],
      }))
    : []

  const { data: contracts } = useReadContracts({
    // @ts-ignore
    contracts: contractsConfig,
    query: {
      enabled: assetsIdsFetched && contractsConfig.length > 0,
    },
  })

  useEffect(() => {
    const newAssets = contracts?.map((contract: any) => ({
      positionId: contract.result[0],
      address: contract.result[1],
      createdDate: contract.result[2],
      unlockDate: contract.result[3],
      percentInterest: contract.result[4],
      weiStaked: contract.result[5],
      weiInterest: contract.result[6],
      open: contract.result[7],
    }))
    setAssets(newAssets)
  }, [contracts])

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

  const toggleStakeTab = () => {
    setIsStakeTabOpen((prev) => !prev)
  }

  if (isPending) {
    return <p>Loading...</p>
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
            <Button className="mt-2 w-full" onClick={() => stakeEther(5184000)}>
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
