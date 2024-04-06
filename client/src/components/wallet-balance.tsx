"use client"

import { ethers } from 'ethers'
import { useState } from 'react'

function WalletBalance() {
  const [balance, setBalance] = useState('')

  const getBalance = async () => {
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const provider = new ethers.BrowserProvider(window.ethereum)
    const balance = await provider.getBalance(account)
    setBalance(ethers.formatEther(balance))
  }

  return (
    <div>
      <button onClick={getBalance}>Get Balance</button>
      <p>Balance: {balance}</p>
    </div>
  )
}

export default WalletBalance
