import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, ChartLineUp } from '@phosphor-icons/react'
import { StakePosition } from '@/lib/types'
import { CRYPTO_INFO, formatCryptoAmount, formatUSD, calculateStakingRewards } from '@/lib/crypto-utils'
import { CreateStakeDialog } from './CreateStakeDialog'

export function StakingView() {
  const [stakes, setStakes] = useKV<StakePosition[]>('stakes', [])
  const [createOpen, setCreateOpen] = useState(false)
  const [initialized, setInitialized] = useState(false)
  
  useEffect(() => {
    if (!initialized && stakes?.length === 0) {
      const stakingData = [
        {
          startDate: new Date('2025-06-18').getTime(),
          endDate: new Date('2025-12-11').getTime(),
          amount: 1652,
          rewards: 149,
        },
        {
          startDate: new Date('2025-08-02').getTime(),
          endDate: new Date('2026-02-25').getTime(),
          amount: 2565,
          rewards: 379,
        },
        {
          startDate: new Date('2025-09-26').getTime(),
          endDate: new Date('2026-02-26').getTime(),
          amount: 3350,
          rewards: 496,
        },
        {
          startDate: new Date('2025-10-07').getTime(),
          endDate: new Date('2026-01-07').getTime(),
          amount: 2785,
          rewards: 412,
        },
      ]
      
      const initialStakes: StakePosition[] = stakingData.map((data, index) => {
        const durationDays = Math.floor((data.endDate - data.startDate) / (1000 * 60 * 60 * 24))
        const apy = (data.rewards / data.amount) * (365 / durationDays) * 100
        
        return {
          id: `initial-stake-${index + 1}`,
          currency: 'USDT',
          amount: data.amount,
          apy,
          startDate: data.startDate,
          endDate: data.endDate,
          rewards: data.rewards,
          durationDays,
        }
      })
      
      setStakes(initialStakes)
      setInitialized(true)
    }
  }, [stakes, initialized, setStakes])
  
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
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <div className="text-xs text-muted-foreground">Active Positions</div>
            <div className="text-xl font-semibold">{activeStakes.length}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Rewards Earned</div>
            <div className="text-xl font-semibold text-success">{formatUSD(totalRewards)}</div>
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
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus />
            Start First Stake
          </Button>
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
