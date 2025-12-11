import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Plus, LockKey } from '@phosphor-icons/react'
import { DepositPosition } from '@/lib/types'
import { CRYPTO_INFO, formatCryptoAmount, formatUSD } from '@/lib/crypto-utils'
import { CreateDepositDialog } from './CreateDepositDialog'

export function DepositsView() {
  const [deposits] = useKV<DepositPosition[]>('deposits', [])
  const [createOpen, setCreateOpen] = useState(false)
  
  const activeDeposits = (deposits || []).filter(d => Date.now() < d.maturityDate)
  const maturedDeposits = (deposits || []).filter(d => Date.now() >= d.maturityDate)
  
  const totalDeposited = activeDeposits.reduce((sum, deposit) => {
    return sum + deposit.amount * CRYPTO_INFO[deposit.currency as keyof typeof CRYPTO_INFO].priceUSD
  }, 0)
  
  const totalInterest = activeDeposits.reduce((sum, deposit) => deposit.interest + sum, 0)
  
  const renderDeposit = (deposit: DepositPosition) => {
    const info = CRYPTO_INFO[deposit.currency as keyof typeof CRYPTO_INFO]
    const now = Date.now()
    const isMatured = now >= deposit.maturityDate
    const progress = isMatured ? 100 : ((now - deposit.startDate) / (deposit.maturityDate - deposit.startDate)) * 100
    const daysRemaining = Math.ceil((deposit.maturityDate - now) / (1000 * 60 * 60 * 24))
    
    return (
      <Card key={deposit.id} className="p-6">
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
              <div className="text-sm text-muted-foreground">{deposit.term} дней</div>
            </div>
          </div>
          <Badge variant={isMatured ? 'default' : 'secondary'}>
            {isMatured ? 'Завершен' : 'Активен'}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground">Депозит</span>
            <div className="text-right">
              <div className="font-semibold">{formatCryptoAmount(deposit.amount)} {deposit.currency}</div>
              <div className="text-xs text-muted-foreground">
                {formatUSD(deposit.amount * info.priceUSD)}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground">Процент</span>
            <div className="text-right">
              <div className="font-semibold text-success">{formatCryptoAmount(deposit.interest)} {deposit.currency}</div>
              <div className="text-xs text-muted-foreground">{deposit.apy}% годовых</div>
            </div>
          </div>
          
          {!isMatured && (
            <>
              <Progress value={progress} className="h-2" />
              <div className="text-xs text-muted-foreground text-center">
                {daysRemaining} {daysRemaining === 1 ? 'день' : daysRemaining < 5 ? 'дня' : 'дней'} до созревания
              </div>
            </>
          )}
          
          {isMatured && (
            <Button variant="outline" className="w-full gap-2">
              <LockKey />
              Вывести с процентами
            </Button>
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
            <div className="text-sm text-muted-foreground mb-1">Всего в депозитах</div>
            <div className="text-3xl font-bold">{formatUSD(totalDeposited)}</div>
          </div>
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus />
            Создать депозит
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <div className="text-xs text-muted-foreground">Активных депозитов</div>
            <div className="text-xl font-semibold">{activeDeposits.length}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Доход по процентам</div>
            <div className="text-xl font-semibold text-success">${totalInterest.toFixed(2)}</div>
          </div>
        </div>
      </Card>
      
      {activeDeposits.length === 0 && maturedDeposits.length === 0 ? (
        <Card className="p-12 text-center">
          <LockKey className="mx-auto mb-4 opacity-20" size={64} />
          <h3 className="text-xl font-semibold mb-2">Нет активных депозитов</h3>
          <p className="text-muted-foreground mb-4">
            Создайте депозит, чтобы заработать процент на ваши активы
          </p>
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus />
            Создать первый депозит
          </Button>
        </Card>
      ) : (
        <>
          {activeDeposits.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Активные депозиты</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {activeDeposits.map(renderDeposit)}
              </div>
            </div>
          )}
          
          {maturedDeposits.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Завершенные депозиты</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {maturedDeposits.map(renderDeposit)}
              </div>
            </div>
          )}
        </>
      )}
      
      <CreateDepositDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
