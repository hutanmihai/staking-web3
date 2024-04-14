'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { ethers } from 'ethers'
import { useState } from 'react'
import { useWriteContract } from 'wagmi'
import { CONTRACT_ADDRESS, ABI } from '@/config'

function Staking() {
  const [withdrawPositionId, setWithdrawPositionId] = useState<number | null>(null)
  const [amount, setAmount] = useState<number>(0)
  const { toast } = useToast()
  const { writeContractAsync, error: writeContractError, isError } = useWriteContract()

  const stakeEther = async (stakingLength: number) => {
    const wei = ethers.parseEther(amount.toString())
    const stakingLengthBigInt = BigInt(stakingLength)
    console.log('wei', wei)
    await writeContractAsync(
      {
        address: CONTRACT_ADDRESS,
        functionName: 'stakeEther',
        args: [stakingLengthBigInt],
        abi: ABI,
        value: wei,
      },
      {
        onError: (error) => {
          toast({
            title: 'Error',
            // @ts-ignore
            description: error.shortMessage,
            variant: 'destructive',
          })
        },
      }
    )
  }

  const withDraw = async (id: number | null) => {
    if (id === null) return
    const idBigInt = BigInt(id)
    await writeContractAsync(
      {
        address: CONTRACT_ADDRESS,
        functionName: 'closePosition',
        args: [idBigInt],
        abi: ABI,
      },
      {
        onError: (error) => {
          toast({
            title: 'Error',
            // @ts-ignore
            description: error.shortMessage,
            variant: 'destructive',
          })
        },
      }
    )
  }

  // useEffect(() => {
  //   console.log('writeContractError', writeContractError)
  //   if (isError) {
  //     toast({
  //       title: 'Error',
  //       description: writeContractError.message,
  //       variant: 'destructive',
  //     })
  //   }
  // }, [writeContractError, writeContractAsync])

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
