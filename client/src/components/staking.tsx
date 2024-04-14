'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toWei } from '@/utils'
import { useEffect, useState } from 'react'
import { useAccount, useReadContract, useReadContracts, useWriteContract } from 'wagmi'
import { CONTRACT_ADDRESS, ABI } from '@/config'

function Staking() {
  const { address } = useAccount()

  const [positions, setPositions] = useState<any[]>([])
  const [amount, setAmount] = useState<number>(0)
  const { writeContractAsync } = useWriteContract()

  const { data: positionsIds, isSuccess: positionsIdsFetched } = useReadContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
    functionName: 'getPositionsIdsByAddress',
    args: [address!],
    query: {
      enabled: !!address,
    },
  })

  const contractsConfig = positionsIdsFetched
    ? positionsIds.map((id) => ({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'getPositionById',
        args: [id],
      }))
    : []

  const { data } = useReadContracts({
    // @ts-ignore
    contracts: contractsConfig,
    query: {
      enabled: positionsIdsFetched && contractsConfig.length > 0,
    },
  })

  useEffect(() => {
    const _positions = data?.map((contract: any) => ({
      positionId: contract.result.positionId,
      address: contract.result.walletAddress,
      createdDate: contract.result.createdDate,
      unlockDate: contract.result.unlockDate,
      percentInterest: contract.result.percentInterest,
      weiStaked: contract.result.weiStaked,
      weiInterest: contract.result.weiInterest,
      open: contract.result.open,
    }))
    // @ts-ignore
    setPositions(_positions)
  }, [data])

  const stakeEther = async (stakingLength: number) => {
    const wei = toWei(amount.toString())
    console.log('wei', wei)
    console.log('stakingLength', stakingLength.toString())
    await writeContractAsync({
      address: CONTRACT_ADDRESS,
      functionName: 'stakeEther',
      // @ts-ignore
      args: [stakingLength.toString()],
      abi: ABI,
      value: wei,
    })
  }

  const withDraw = async (id: bigint) => {
    await writeContractAsync({
      address: CONTRACT_ADDRESS,
      functionName: 'closePosition',
      args: [id],
      abi: ABI,
    })
  }

  useEffect(() => {
    console.log('positionsIds', positionsIds)
    console.log('positions', positions)
    console.log('data', data)
  }, [amount, positions])

  return (
    <Card className="h-max bg-black text-center">
      <CardHeader>Staking</CardHeader>
      <CardContent>
        <Input
          onChange={(e) => setAmount(Number(e.target.value))}
          maxLength={120}
          type="number"
          placeholder="Amount to stake"
          required
        />
        <Button className="mt-2 w-full" onClick={() => stakeEther(60)}>
          Stake
        </Button>
      </CardContent>
    </Card>
  )
}

export default Staking
