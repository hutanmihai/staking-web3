'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useAccount, useReadContract, useReadContracts, useWriteContract } from 'wagmi'
import { CONTRACT_ADDRESS, ABI } from '@/config'

function Staking() {
  const { address } = useAccount()

  const [withdrawPositionId, setWithdrawPositionId] = useState<number | null>(null)
  const [positions, setPositions] = useState<any[]>([])
  const [amount, setAmount] = useState<number>(0)
  const { writeContractAsync, isPending: isWriteContractPending } = useWriteContract()

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
      enabled: contractsConfig.length > 0,
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
    const wei = ethers.parseEther(amount.toString())
    const stakingLengthBigInt = BigInt(stakingLength)
    console.log('wei', wei)
    await writeContractAsync({
      address: CONTRACT_ADDRESS,
      functionName: 'stakeEther',
      args: [stakingLengthBigInt],
      abi: ABI,
      value: wei,
    })
  }

  const withDraw = async (id: number | null) => {
    if (id === null) return
    const idBigInt = BigInt(id)
    await writeContractAsync({
      address: CONTRACT_ADDRESS,
      functionName: 'closePosition',
      args: [idBigInt],
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
        <Input
          className="mt-5"
          onChange={(e) => setWithdrawPositionId(Number(e.target.value))}
          maxLength={120}
          type="number"
          placeholder="Position ID to withdraw"
          required
        />
        <Button className="mt-2 w-full" onClick={() => withDraw(withdrawPositionId)}>
          Withdraw
        </Button>
      </CardContent>
    </Card>
  )
}

export default Staking
