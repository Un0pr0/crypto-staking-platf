import { Card } from '@/components/ui/card'
import { formatCryptoAmount } from '@/lib/crypto-utils'
import { Wallet } from '@phosphor-icons/react'
import { AVAILABLE_BALANCE } from '@/lib/static-data'

interface SharedBalanceInfoProps {
  currency?: string
  className?: string
}

export function SharedBalanceInfo({ currency = 'USDT', className = '' }: SharedBalanceInfoProps) {
  const balance = AVAILABLE_BALANCE
  
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
