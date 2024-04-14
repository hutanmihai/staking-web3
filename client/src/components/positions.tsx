import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ABI, CONTRACT_ADDRESS } from '@/config'
import { timestampToDateString } from '@/utils'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'

function Positions() {
  const { address } = useAccount()
  const [positions, setPositions] = useState<any[]>([])

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

  return (
    <Card className="h-max bg-black text-center">
      <CardHeader>Positions</CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of all your positions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>PositionID</TableHead>
              <TableHead>CreatedDate</TableHead>
              <TableHead>UnlockDate</TableHead>
              <TableHead>PercentInterest</TableHead>
              <TableHead>ETHStaked</TableHead>
              <TableHead>ETHInterest</TableHead>
              <TableHead>Open</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions?.map((position) => (
              <TableRow key={position.positionId}>
                <TableCell>{Number(position.positionId)}</TableCell>
                <TableCell>{timestampToDateString(position.createdDate)}</TableCell>
                <TableCell>{timestampToDateString(position.unlockDate)}</TableCell>
                <TableCell>{Number(position.percentInterest)}%</TableCell>
                <TableCell>{ethers.formatEther(Number(position.weiStaked).toString())}</TableCell>
                <TableCell>{ethers.formatEther(Number(position.weiInterest).toString())}</TableCell>
                <TableCell>{position.open ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default Positions
