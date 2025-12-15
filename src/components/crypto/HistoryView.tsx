import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ClockCounterClockwise, ArrowUp, ArrowDown, ArrowsLeftRight, LockKey, ChartLineUp } from '@phosphor-icons/react'
import { formatCryptoAmount } from '@/lib/crypto-utils'

export function HistoryView() {
  const staticTransactions = [
    {
      id: 'deposit-open-4',
      type: 'deposit' as const,
      timestamp: new Date('2025-12-15T19:16:00').getTime(),
      amount: 6135,
      currency: 'USDT',
      status: 'completed' as const,
      label: 'Deposit',
      icon: 'deposit'
    },
    {
      id: 'stake-return-1',
      type: 'unstake' as const,
      timestamp: new Date('2025-12-11T00:00:00').getTime(),
      amount: 1801,
      currency: 'USDT',
      status: 'completed' as const,
      label: 'Unstake',
      icon: 'unstake'
    },
    {
      id: 'stake-open-1',
      type: 'stake' as const,
      timestamp: new Date('2025-06-18T10:30:00').getTime(),
      amount: 1652,
      currency: 'USDT',
      status: 'completed' as const,
      label: 'Staking',
      icon: 'stake'
    },
    {
      id: 'deposit-return-1',
      type: 'withdraw' as const,
      timestamp: new Date('2025-12-12T00:00:00').getTime(),
      amount: 4334,
      currency: 'USDT',
      status: 'completed' as const,
      label: 'Withdraw',
      icon: 'withdraw'
    },
    {
      id: 'deposit-open-1',
      type: 'deposit' as const,
      timestamp: new Date('2025-05-02T11:00:00').getTime(),
      amount: 3760,
      currency: 'USDT',
      status: 'completed' as const,
      label: 'Deposit',
      icon: 'deposit'
    },
    {
      id: 'stake-open-2',
      type: 'stake' as const,
      timestamp: new Date('2025-08-02T15:45:00').getTime(),
      amount: 2565,
      currency: 'USDT',
      status: 'completed' as const,
      label: 'Staking',
      icon: 'stake'
    },
    {
      id: 'deposit-open-2',
      type: 'deposit' as const,
      timestamp: new Date('2025-07-25T19:30:00').getTime(),
      amount: 5035,
      currency: 'USDT',
      status: 'completed' as const,
      label: 'Deposit',
      icon: 'deposit'
    },
    {
      id: 'stake-open-3',
      type: 'stake' as const,
      timestamp: new Date('2025-09-26T09:20:00').getTime(),
      amount: 3350,
      currency: 'USDT',
      status: 'completed' as const,
      label: 'Staking',
      icon: 'stake'
    },
    {
      id: 'deposit-open-3',
      type: 'deposit' as const,
      timestamp: new Date('2025-08-20T11:00:00').getTime(),
      amount: 1285,
      currency: 'USDT',
      status: 'completed' as const,
      label: 'Deposit',
      icon: 'deposit'
    },
    {
      id: 'stake-open-4',
      type: 'stake' as const,
      timestamp: new Date('2025-07-10T16:00:00').getTime(),
      amount: 2785,
      currency: 'USDT',
      status: 'completed' as const,
      label: 'Staking',
      icon: 'stake'
    }
  ]
  
  const sortedTransactions = [...staticTransactions].sort((a, b) => b.timestamp - a.timestamp)
  
  const getTransactionIcon = (iconType: string) => {
    switch (iconType) {
      case 'send':
        return <ArrowUp className="text-destructive" />
      case 'receive':
        return <ArrowDown className="text-success" />
      case 'swap':
        return <ArrowsLeftRight className="text-accent" />
      case 'deposit':
        return <LockKey className="text-primary" />
      case 'stake':
        return <ChartLineUp className="text-success" />
      case 'unstake':
        return <ChartLineUp className="text-muted-foreground" />
      case 'withdraw':
        return <LockKey className="text-muted-foreground" />
      default:
        return <ArrowDown className="text-success" />
    }
  }
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const renderTransaction = (tx: typeof staticTransactions[0]) => {
    const isNegative = tx.type === 'deposit' || tx.type === 'stake'
    
    return (
      <Card key={tx.id} className="p-4 hover:border-primary/40 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            {getTransactionIcon(tx.icon)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">{tx.label}</span>
              <Badge variant={tx.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                {tx.status === 'completed' ? 'Completed' : tx.status === 'pending' ? 'Pending' : 'Failed'}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDate(tx.timestamp)}
            </div>
          </div>
          
          <div className="text-right">
            <div className={`font-semibold ${isNegative ? 'text-destructive' : 'text-success'}`}>
              {isNegative ? '-' : '+'}{formatCryptoAmount(tx.amount)} {tx.currency}
            </div>
          </div>
        </div>
      </Card>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Transaction History</h2>
          <p className="text-sm text-muted-foreground">
            All operations with your assets
          </p>
        </div>
      </div>
      
      {sortedTransactions.length === 0 ? (
        <Card className="p-12 text-center">
          <ClockCounterClockwise className="mx-auto mb-4 opacity-20" size={64} />
          <h3 className="text-xl font-semibold mb-2">No Transactions</h3>
          <p className="text-muted-foreground">
            Your transaction history will appear here
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedTransactions.map(renderTransaction)}
        </div>
      )}
    </div>
  )
}
