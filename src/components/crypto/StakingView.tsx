import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, ChartLineUp, Wallet } from '@phosphor-icons/react'
import { StakePosition, CryptoHolding } from '@/lib/types'
import { CRYPTO_INFO, formatCryptoAmount, formatUSD, calculateStakingRewards } from '@/lib/crypto-utils'
import { CreateStakeDialog } from './CreateStakeDialog'
import { createStakesData } from '@/lib/add-stakes'

export function StakingView() {
  const [stakes, setStakes] = useKV<StakePosition[]>('stakes', [])
  const [holdings] = useKV<CryptoHolding[]>('holdings', [])
  const [createOpen, setCreateOpen] = useState(false)
  const [initialized, setInitialized] = useKV<boolean>('stakes-initialized-v3', false)

  useEffect(() => {
    if (!initialized) {
      const newStakes = createStakesData()
      setStakes(newStakes)
      setInitialized(true)
    }
  }, [initialized, setStakes, setInitialized])
  
  const activeStakes = stakes || []
  
  const usdtHolding = (holdings || []).find(h => h.symbol === 'USDT')
  const availableUSDT = usdtHolding?.amount || 0
  
  const totalStaked = 8700
  
  const totalRewards = 1287
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
  
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-card to-secondary">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Total Staked</div>
            <div className="text-3xl font-bold">{formatUSD(totalStaked)}</div>
          </div>
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus />
            Start Staking
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div>
            <div className="text-xs text-muted-foreground">Active Positions</div>
            <div className="text-xl font-semibold">{activeStakes.length}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Rewards Earned</div>
            <div className="text-xl font-semibold text-success">{formatUSD(totalRewards)}</div>
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
      
      {activeStakes.length === 0 ? (
        <Card className="p-12 text-center">
          <ChartLineUp className="mx-auto mb-4 opacity-20" size={64} />
          <h3 className="text-xl font-semibold mb-2">No Active Staking</h3>
          <p className="text-muted-foreground mb-4">
            Start earning rewards on your crypto assets
          </p>
          {availableUSDT > 0 ? (
            <Button onClick={() => setCreateOpen(true)} className="gap-2">
              <Plus />
              Start First Stake
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Add USDT to your balance to start staking
              </p>
              <Button onClick={() => setCreateOpen(true)} variant="secondary" className="gap-2">
                <Plus />
                View Staking Options
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <Card>
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold">Active Staking Positions</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Stake Size</TableHead>
                  <TableHead>Profit</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeStakes.map((stake) => {
                  const info = CRYPTO_INFO[stake.currency as keyof typeof CRYPTO_INFO]
                  const now = Date.now()
                  const daysElapsed = Math.floor((now - stake.startDate) / (1000 * 60 * 60 * 24))
                  const currentRewards = calculateStakingRewards(stake.amount, stake.apy, (now - stake.startDate) / (1000 * 60 * 60 * 24))
                  const isCompleted = now >= stake.endDate
                  
                  return (
                    <TableRow key={stake.id}>
                      <TableCell className="font-medium">
                        {formatDate(stake.startDate)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatDate(stake.endDate)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ backgroundColor: info.color }}
                          >
                            {info.symbol}
                          </div>
                          <div>
                            <div className="font-semibold">
                              {formatUSD(stake.amount)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {stake.currency}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-success font-semibold">
                          {formatUSD(stake.rewards)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Expected
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">
                        {daysElapsed} / {stake.durationDays}
                      </TableCell>
                      <TableCell>
                        <Badge variant={isCompleted ? "default" : "secondary"}>
                          {isCompleted ? "Completed" : "Active"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
      
      <CreateStakeDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
