import { useKV } from '@github/spark/hooks'
import { CryptoHolding } from '@/lib/types'
import { formatCryptoAmount } from '@/lib/crypto-utils'
import { Wallet } from '@phosphor-icons/react'

interface SharedBalanceInfoProps {
  currency?: string
  className?: string
}

export function SharedBalanceInfo({ currency = 'USDT', className = '' }: SharedBalanceInfoProps) {
  const [holdings] = useKV<CryptoHolding[]>('holdings', [])
  
  const holding = (holdings || []).find(h => h.symbol === currency)
  const balance = holding?.amount || 0
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Wallet size={16} className="text-accent" />
      <div className="flex items-baseline gap-1">
        <span className="text-sm text-muted-foreground">Wallet Balance:</span>
        <span className="font-semibold text-accent">
          {formatCryptoAmount(balance)} {currency}
        </span>
      </div>
    </div>
  )
}
