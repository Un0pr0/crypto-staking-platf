import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ClockCounterClockwise, ArrowUp, ArrowDown, ArrowsLeftRight, LockKey, ChartLineUp } from '@phosphor-icons/react'
import { Transaction, DepositPosition, StakePosition } from '@/lib/types'
import { CRYPTO_INFO, formatCryptoAmount } from '@/lib/crypto-utils'
import { useMemo } from 'react'

export function HistoryView() {
  const [transactions] = useKV<Transaction[]>('transactions', [])
  const [deposits] = useKV<DepositPosition[]>('deposits', [])
  const [stakes] = useKV<StakePosition[]>('stakes', [])
  
  const allTransactions = useMemo(() => {
    const txList: Transaction[] = [...(transactions || [])]
    
    const depositsList = deposits || []
    for (const deposit of depositsList) {
      txList.push({
        id: `deposit-open-${deposit.id}`,
        type: 'deposit',
        timestamp: deposit.startDate,
        amount: deposit.amount,
        currency: deposit.currency,
        status: 'completed'
      })
      
      const now = Date.now()
      if (now >= deposit.maturityDate) {
        txList.push({
          id: `deposit-return-${deposit.id}`,
          type: 'withdraw',
          timestamp: deposit.maturityDate,
          amount: deposit.amount + deposit.interest,
          currency: deposit.currency,
          status: 'completed'
        })
      }
    }
    
    const stakesList = stakes || []
    for (const stake of stakesList) {
      txList.push({
        id: `stake-open-${stake.id}`,
        type: 'stake',
        timestamp: stake.startDate,
        amount: stake.amount,
        currency: stake.currency,
        status: 'completed'
      })
      
      const now = Date.now()
      if (now >= stake.endDate) {
        txList.push({
          id: `stake-return-${stake.id}`,
          type: 'unstake',
          timestamp: stake.endDate,
          amount: stake.amount + stake.rewards,
          currency: stake.currency,
          status: 'completed'
        })
      }
    }
    
    return txList
  }, [transactions, deposits, stakes])
  
  const sortedTransactions = [...allTransactions].sort((a, b) => b.timestamp - a.timestamp).slice(3)
  
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
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
    }
  }
  
  const getTransactionLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'send':
        return 'Sent'
      case 'receive':
        return 'Received'
      case 'swap':
        return 'Swap'
      case 'deposit':
        return 'Deposit'
      case 'stake':
        return 'Staking'
      case 'unstake':
        return 'Unstake'
      case 'withdraw':
        return 'Withdraw'
    }
  }
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    } else {
      return date.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
  
  const renderTransaction = (tx: Transaction) => {
    const info = CRYPTO_INFO[tx.currency as keyof typeof CRYPTO_INFO]
    const isNegative = tx.type === 'send' || tx.type === 'deposit' || tx.type === 'stake'
    
    return (
      <Card key={tx.id} className="p-4 hover:border-primary/40 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            {getTransactionIcon(tx.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">{getTransactionLabel(tx.type)}</span>
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
            {tx.type === 'swap' && tx.toCurrency && tx.toAmount && (
              <div className="text-sm text-success">
                +{formatCryptoAmount(tx.toAmount)} {tx.toCurrency}
              </div>
            )}
            {tx.address && (
              <div className="text-xs text-muted-foreground font-mono truncate max-w-[120px]">
                {tx.address}
              </div>
            )}
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
