import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, ChartLineUp, Wallet } from '@phosphor-icons/react'
import { CRYPTO_INFO, formatCryptoAmount, formatUSD } from '@/lib/crypto-utils'
import { CreateStakeDialog } from './CreateStakeDialog'
import { STATIC_STAKES, TOTAL_STAKED, TOTAL_REWARDS, ACTIVE_POSITIONS, AVAILABLE_BALANCE } from '@/lib/static-data'

export function StakingView() {
  const [createOpen, setCreateOpen] = useState(false)

  const activeStakes = STATIC_STAKES
  const availableUSDT = AVAILABLE_BALANCE
  
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
            <div className="text-3xl font-bold">{formatUSD(TOTAL_STAKED)}</div>
          </div>
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus />
            Start Staking
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div>
            <div className="text-xs text-muted-foreground">Active Positions</div>
            <div className="text-xl font-semibold">{ACTIVE_POSITIONS}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Rewards Earned</div>
            <div className="text-xl font-semibold text-success">{formatUSD(TOTAL_REWARDS)}</div>
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
                <TableRow>
                  <TableCell className="font-medium">06/18/2025</TableCell>
                  <TableCell className="font-medium">12/11/2025</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: 'oklch(0.65 0.15 145)' }}
                      >
                        ₮
                      </div>
                      <div>
                        <div className="font-semibold">$1,652.00</div>
                        <div className="text-xs text-muted-foreground">USDT</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-success font-semibold">$149.00</div>
                    <div className="text-xs text-muted-foreground">Expected</div>
                  </TableCell>
                  <TableCell className="font-mono">176 / 176</TableCell>
                  <TableCell>
                    <Badge variant="default">Completed</Badge>
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">08/02/2025</TableCell>
                  <TableCell className="font-medium">02/25/2026</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: 'oklch(0.65 0.15 145)' }}
                      >
                        ₮
                      </div>
                      <div>
                        <div className="font-semibold">$2,565.00</div>
                        <div className="text-xs text-muted-foreground">USDT</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-success font-semibold">$379.00</div>
                    <div className="text-xs text-muted-foreground">Expected</div>
                  </TableCell>
                  <TableCell className="font-mono">142 / 207</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Active</Badge>
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">09/26/2025</TableCell>
                  <TableCell className="font-medium">02/26/2026</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: 'oklch(0.65 0.15 145)' }}
                      >
                        ₮
                      </div>
                      <div>
                        <div className="font-semibold">$3,350.00</div>
                        <div className="text-xs text-muted-foreground">USDT</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-success font-semibold">$496.00</div>
                    <div className="text-xs text-muted-foreground">Expected</div>
                  </TableCell>
                  <TableCell className="font-mono">88 / 153</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Active</Badge>
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">07/10/2025</TableCell>
                  <TableCell className="font-medium">01/07/2026</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: 'oklch(0.65 0.15 145)' }}
                      >
                        ₮
                      </div>
                      <div>
                        <div className="font-semibold">$2,785.00</div>
                        <div className="text-xs text-muted-foreground">USDT</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-success font-semibold">$412.00</div>
                    <div className="text-xs text-muted-foreground">Expected</div>
                  </TableCell>
                  <TableCell className="font-mono">126 / 181</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Active</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
      
      <CreateStakeDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
