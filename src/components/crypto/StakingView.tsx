import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, ChartLineUp } from '@phosphor-icons/react'
import { StakePosition } from '@/lib/types'
import { CRYPTO_INFO, formatCryptoAmount, formatUSD, calculateStakingRewards } from '@/lib/crypto-utils'
import { CreateStakeDialog } from './CreateStakeDialog'

export function StakingView() {
  const [stakes] = useKV<StakePosition[]>('stakes', [])
  const [createOpen, setCreateOpen] = useState(false)
  
  const activeStakes = stakes || []
  
  const totalStaked = activeStakes.reduce((sum, stake) => {
    return sum + stake.amount * CRYPTO_INFO[stake.currency as keyof typeof CRYPTO_INFO].priceUSD
  }, 0)
  
  const totalRewards = activeStakes.reduce((sum, stake) => {
    const now = Date.now()
    const daysStaked = (now - stake.startDate) / (1000 * 60 * 60 * 24)
    const currentRewards = calculateStakingRewards(stake.amount, stake.apy, daysStaked)
    return sum + currentRewards * CRYPTO_INFO[stake.currency as keyof typeof CRYPTO_INFO].priceUSD
  }, 0)
  
  const renderStake = (stake: StakePosition) => {
    const info = CRYPTO_INFO[stake.currency as keyof typeof CRYPTO_INFO]
    const now = Date.now()
    const daysStaked = Math.floor((now - stake.startDate) / (1000 * 60 * 60 * 24))
    const currentRewards = calculateStakingRewards(stake.amount, stake.apy, (now - stake.startDate) / (1000 * 60 * 60 * 24))
    
    return (
      <Card key={stake.id} className="p-6">
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
              <div className="text-sm text-muted-foreground">{stake.apy}% APY</div>
            </div>
          </div>
          <Badge variant="secondary">Активен</Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground">В стейкинге</span>
            <div className="text-right">
              <div className="font-semibold">{formatCryptoAmount(stake.amount)} {stake.currency}</div>
              <div className="text-xs text-muted-foreground">
                {formatUSD(stake.amount * info.priceUSD)}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground">Награды</span>
            <div className="text-right">
              <div className="font-semibold text-success">
                +{formatCryptoAmount(currentRewards)} {stake.currency}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatUSD(currentRewards * info.priceUSD)}
              </div>
            </div>
          </div>
          
          <div className="pt-2 border-t border-border">
            <div className="text-xs text-muted-foreground mb-2">
              В стейкинге: {daysStaked} {daysStaked === 1 ? 'день' : daysStaked < 5 ? 'дня' : 'дней'}
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Вывести из стейкинга
            </Button>
          </div>
        </div>
      </Card>
    )
  }
  
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-card to-secondary">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Всего в стейкинге</div>
            <div className="text-3xl font-bold">{formatUSD(totalStaked)}</div>
          </div>
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus />
            Начать стейкинг
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <div className="text-xs text-muted-foreground">Активных позиций</div>
            <div className="text-xl font-semibold">{activeStakes.length}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Заработано наград</div>
            <div className="text-xl font-semibold text-success">{formatUSD(totalRewards)}</div>
          </div>
        </div>
      </Card>
      
      {activeStakes.length === 0 ? (
        <Card className="p-12 text-center">
          <ChartLineUp className="mx-auto mb-4 opacity-20" size={64} />
          <h3 className="text-xl font-semibold mb-2">Нет активного стейкинга</h3>
          <p className="text-muted-foreground mb-4">
            Начните зарабатывать награды на ваши криптоактивы
          </p>
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus />
            Начать первый стейкинг
          </Button>
        </Card>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Активный стейкинг</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {activeStakes.map(renderStake)}
          </div>
        </div>
      )}
      
      <CreateStakeDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
