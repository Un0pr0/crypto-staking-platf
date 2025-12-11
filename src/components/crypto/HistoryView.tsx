import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ClockCounterClockwise, ArrowUp, ArrowDown, ArrowsLeftRight, LockKey, ChartLineUp } from '@phosphor-icons/react'
import { Transaction } from '@/lib/types'
import { CRYPTO_INFO, formatCryptoAmount } from '@/lib/crypto-utils'

export function HistoryView() {
  const [transactions] = useKV<Transaction[]>('transactions', [])
  
  const sortedTransactions = [...(transactions || [])].sort((a, b) => b.timestamp - a.timestamp)
  
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
        return 'Отправлено'
      case 'receive':
        return 'Получено'
      case 'swap':
        return 'Обмен'
      case 'deposit':
        return 'Депозит'
      case 'stake':
        return 'Стейкинг'
      case 'unstake':
        return 'Вывод из стейкинга'
      case 'withdraw':
        return 'Вывод депозита'
    }
  }
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return `Сегодня в ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Вчера в ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
    } else {
      return date.toLocaleDateString('ru-RU', { 
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
                {tx.status === 'completed' ? 'Завершено' : tx.status === 'pending' ? 'В обработке' : 'Ошибка'}
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
          <h2 className="text-2xl font-semibold">История транзакций</h2>
          <p className="text-sm text-muted-foreground">
            Все операции с вашими активами
          </p>
        </div>
      </div>
      
      {sortedTransactions.length === 0 ? (
        <Card className="p-12 text-center">
          <ClockCounterClockwise className="mx-auto mb-4 opacity-20" size={64} />
          <h3 className="text-xl font-semibold mb-2">Нет транзакций</h3>
          <p className="text-muted-foreground">
            История транзакций будет отображаться здесь
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
