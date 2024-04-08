'use client'

import { ethers } from 'ethers'
import { useState } from 'react'
import {
  useAccount,
  useBalance,
  useClient,
  useConnectorClient,
  useReadContract,
  useWriteContract,
} from 'wagmi'

function Staking() {
  const { isConnected, address } = useAccount()
  const account = useAccount()
  const provider = useClient()
  const signer = useConnectorClient()
  const balance = useBalance(account)

  const [stakingTab, setStakingTab] = useState(true)
  const [unstakingTab, setUnstakingTab] = useState(false)
  const [unstakeValue, setUnstakeValue] = useState(0)

  const [assetIds, setAssetIds] = useState([])
  const [assets, setAssets] = useState([])
  const [amount, setAmount] = useState(0)

  const toEther = (ether: any) => ethers.parseEther(ether)
  const fromWei = (wei: any) => ethers.formatEther(wei)

  const { writeContract } = useWriteContract()
  const { data: contract } = useReadContract()

  const switchToUnstake = async () => {
    if (!unstakingTab) {
      setStakingTab(false)
      setUnstakingTab(true)
      const assetIds = await getAssetIds(address, signer)
      setAssetIds(assetIds)
      getAssets(assetIds, signer)
    }
  }

  const getAssetIds = async (address: any, signer: any) => {
    const assetIds = await contract.getPositionIdsForAddress(address)
    return assetIds
  }

  const calcDaysRemaining = async (unlockDate: any) => {
    const timeNow = Date.now() / 1000
    const secondsRemaining = unlockDate - timeNow
    return Math.max(Number((secondsRemaining / 60 / 60 / 24).toFixed(0)), 0)
  }

  const getAssets = async (assetIds: any) => {
    const queriedAssets = await Promise.all(assets.map((id: any) => contract.getPositionById(id)))
    queriedAssets.map(async (asset: any) => {
      const parsedAsset = {
        positionId: asset.positionId,
        percentInterest: Number(asset.percentInterest) / 100,
        daysRemaining: await calcDaysRemaining(asset.unlockDate),
        etherInterest: toEther(asset.weiInterest),
        etherStaked: toEther(asset.weiStaked),
        open: asset.open,
      }

      setAssets((prev: any) => [...prev, parsedAsset])
    })
  }

  const stakeEther = async (stakingLength: any) => {
    const wei = toWei(amount)
    const data = { value: wei }
    await contract.stakeEther(stakingLength, data)
  }

  const withDraw = async (positionId: any) => {
    contract.closePosition(positionId)
  }

  return (
    <div>
      <h1>Staking</h1>
    </div>
  )
}

export default Staking
