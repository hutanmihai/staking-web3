import { ethers } from 'ethers'

export const calcDaysRemaining = async (unlockDate: number) => {
  const timeNow = Date.now() / 1000
  const secondsRemaining = unlockDate - timeNow
  return Math.max(Number((secondsRemaining / 60 / 60 / 24).toFixed(0)), 0)
}

export const toWei = (ether: any) => ethers.parseEther(ether)
export const toEther = (wei: any) => ethers.formatEther(wei)
