import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Plus, LockKey, Wallet } from '@phosphor-icons/react'
import { DepositPosition } from '@/lib/types'
import { CRYPTO_INFO, formatCryptoAmount, formatUSD } from '@/lib/crypto-utils'
import { CreateDepositDialog } from './CreateDepositDialog'
import { DepositDetailDialog } from './DepositDetailDialog'
import { STATIC_DEPOSITS, AVAILABLE_BALANCE, ACTIVE_DEPOSITS } from '@/lib/static-data'

export function DepositsView() {
  const [createOpen, setCreateOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedDeposit, setSelectedDeposit] = useState<DepositPosition | null>(null)

  const deposits = STATIC_DEPOSITS
  const availableUSDT = AVAILABLE_BALANCE
  
  const activeDeposits = [deposits[1], deposits[2], deposits[3]]
  const maturedDeposits = [deposits[0]]
  
  const totalDeposited = 12455
  
  const totalInterest = 1589.7839
  
  const handleDepositClick = (deposit: DepositPosition) => {
    setSelectedDeposit(deposit)
    setDetailOpen(true)
  }
  
  const renderDeposit = (deposit: DepositPosition, isMatured: boolean = false) => {
    const info = CRYPTO_INFO[deposit.currency as keyof typeof CRYPTO_INFO]
    
    let progress = 50
    let daysRemaining = 30
    
    if (deposit.id === 'deposit-1753545000000-2') {
      progress = 65
      daysRemaining = 25
    } else if (deposit.id === 'deposit-1755820800000-3') {
      progress = 45
      daysRemaining = 42
    } else if (deposit.id === 'deposit-1765894560000-4') {
      progress = 0
      daysRemaining = 180
    }
    
    return (
      <Card 
        key={deposit.id} 
        className="p-6 cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => handleDepositClick(deposit)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: info.color }}
            >
              {info.symbol}
            </div>
            <div>
              <div className="font-semibold">{info.name}</div>
              <div className="text-sm text-muted-foreground">{deposit.term} days</div>
            </div>
          </div>
          <Badge variant={isMatured ? 'default' : 'secondary'}>
            {isMatured ? 'Matured' : 'Active'}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground">Deposit</span>
            <div className="text-right">
              <div className="font-semibold">{formatCryptoAmount(deposit.amount)} {deposit.currency}</div>
              <div className="text-xs text-muted-foreground">
                {formatUSD(deposit.amount * info.priceUSD)}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground">Interest</span>
            <div className="text-right">
              <div className="font-semibold text-success">{formatCryptoAmount(deposit.interest)} {deposit.currency}</div>
              <div className="text-xs text-muted-foreground">{deposit.apy.toFixed(2)}% APY</div>
            </div>
          </div>
          
          {!isMatured && (
            <>
              <Progress value={progress} className="h-2" />
              <div className="text-xs text-muted-foreground text-center">
                {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} until maturity
              </div>
            </>
          )}
        </div>
      </Card>
    )
  }
  
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-card to-secondary">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Total in Deposits</div>
            <div className="text-3xl font-bold">{formatUSD(totalDeposited)}</div>
          </div>
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus />
            Create Deposit
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div>
            <div className="text-xs text-muted-foreground">Active Deposits</div>
            <div className="text-xl font-semibold">{ACTIVE_DEPOSITS}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Interest Earned</div>
            <div className="text-xl font-semibold text-success">${totalInterest.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Wallet size={14} />
              Shared Wallet
            </div>
            <div className="text-xl font-semibold text-accent">{formatCryptoAmount(availableUSDT)} USDT</div>
          </div>
        </div>
      </Card>
      
      {activeDeposits.length === 0 && maturedDeposits.length === 0 ? (
        <Card className="p-12 text-center">
          <LockKey className="mx-auto mb-4 opacity-20" size={64} />
          <h3 className="text-xl font-semibold mb-2">No Active Deposits</h3>
          <p className="text-muted-foreground mb-4">
            Create a deposit to earn interest on your assets
          </p>
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus />
            Create First Deposit
          </Button>
        </Card>
      ) : (
        <>
          {activeDeposits.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Active Deposits</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {activeDeposits.map(d => renderDeposit(d, false))}
              </div>
            </div>
          )}
          
          {maturedDeposits.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Matured Deposits</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {maturedDeposits.map(d => renderDeposit(d, true))}
              </div>
            </div>
          )}
        </>
      )}
      
      <CreateDepositDialog open={createOpen} onOpenChange={setCreateOpen} />
      <DepositDetailDialog 
        deposit={selectedDeposit} 
        open={detailOpen} 
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}
