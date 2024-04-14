import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useAccount, useBalance, useEnsName } from 'wagmi'

function AccountDetails() {
  const account = useAccount()
  const balance = useBalance(account)

  const balanceFormatted = balance.data
    ? `${Number(balance?.data?.formatted).toFixed(4)} ETH`
    : 'Loading...'

  return (
    <Card className="h-max bg-black text-center">
      <CardHeader>Account Details</CardHeader>
      <CardContent>
        <div className="flex-shrink-0">
          {account.address ? (
            <h4 className="text-lg font-medium leading-tight text-primary">{account.address}</h4>
          ) : (
            <p className="text-gray-300">No account connected</p>
          )}
        </div>
        <div className="mt-2 text-sm text-gray-300">
          <p>Status: {account.status}</p>
          <p>Balance: {balanceFormatted}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default AccountDetails
