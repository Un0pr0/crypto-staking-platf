import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CryptoHolding, StakePosition, Transaction, Cryptocurrency } from '@/lib/types'
import { CRYPTO_INFO, STAKING_APYS, formatCryptoAmount } from '@/lib/crypto-utils'
import { toast } from 'sonner'

interface CreateStakeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateStakeDialog({ open, onOpenChange }: CreateStakeDialogProps) {
  const [holdings, setHoldings] = useKV<CryptoHolding[]>('holdings', [])
  const [stakes, setStakes] = useKV<StakePosition[]>('stakes', [])
  const [transactions, setTransactions] = useKV<Transaction[]>('transactions', [])
  const [selectedCrypto, setSelectedCrypto] = useState<Cryptocurrency>('USDT')
  const [amount, setAmount] = useState('')
  const [duration, setDuration] = useState<number>(180)
  const [loading, setLoading] = useState(false)
  
  const availableHoldings = (holdings || []).filter(h => h.amount > 0 && STAKING_APYS[h.symbol as Cryptocurrency] > 0)
  const currentHolding = availableHoldings.find(h => h.symbol === selectedCrypto)
  const apy = STAKING_APYS[selectedCrypto]
  
  const handleCreate = async () => {
    if (!amount || !currentHolding) {
      toast.error('Enter amount')
      return
    }
    
    const stakeAmount = parseFloat(amount)
    if (stakeAmount <= 0 || stakeAmount > currentHolding.amount) {
      toast.error('Invalid amount')
      return
    }
    
    if (apy === 0) {
      toast.error('Staking not available for this currency')
      return
    }
    
    setLoading(true)
    
    try {
      const now = Date.now()
      const endDate = now + (duration * 24 * 60 * 60 * 1000)
      
      const estimatedRewards = (stakeAmount * (apy / 100) * duration) / 365
      
      const newStake: StakePosition = {
        id: `stake-${now}`,
        currency: selectedCrypto,
        amount: stakeAmount,
        apy,
        startDate: now,
        endDate,
        rewards: estimatedRewards,
        durationDays: duration,
      }
      
      const newTransaction: Transaction = {
        id: `transaction-${now}`,
        type: 'stake',
        timestamp: now,
        amount: stakeAmount,
        currency: selectedCrypto,
        status: 'completed',
      }
      
      await setHoldings((currentHoldings) => {
        return (currentHoldings || []).map(holding => {
          if (holding.symbol === selectedCrypto) {
            return {
              ...holding,
              amount: holding.amount - stakeAmount
            }
          }
          return holding
        })
      })
      
      await setStakes((current) => {
        const updatedStakes = [...(current || []), newStake]
        console.log('New stake added:', newStake)
        console.log('Total stakes:', updatedStakes.length)
        return updatedStakes
      })
      
      await setTransactions((current) => [newTransaction, ...(current || [])])
      
      toast.success(`Staking started: ${formatCryptoAmount(stakeAmount)} ${selectedCrypto}`)
      
      setAmount('')
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating stake:', error)
      toast.error('Failed to create stake')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start Staking</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Cryptocurrency</label>
            <Select value={selectedCrypto} onValueChange={(v) => setSelectedCrypto(v as Cryptocurrency)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableHoldings.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    No assets available for staking
                  </div>
                ) : (
                  availableHoldings.map((holding) => {
                    const info = CRYPTO_INFO[holding.symbol as keyof typeof CRYPTO_INFO]
                    const holdingApy = STAKING_APYS[holding.symbol as Cryptocurrency]
                    return (
                      <SelectItem key={holding.symbol} value={holding.symbol}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ backgroundColor: info.color }}
                          >
                            {info.symbol}
                          </div>
                          <span>{info.name}</span>
                          <span className="text-success text-xs ml-auto">
                            {holdingApy}% APY
                          </span>
                        </div>
                      </SelectItem>
                    )
                  })
                )}
              </SelectContent>
            </Select>
            {currentHolding && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Wallet Balance:</span>
                <span className="font-semibold text-accent">{formatCryptoAmount(currentHolding.amount)} {selectedCrypto}</span>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Annual Percentage Yield</span>
              <span className="text-xl font-bold text-success">{apy}%</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Duration</label>
            <Select value={duration.toString()} onValueChange={(v) => setDuration(parseInt(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 days (1 month)</SelectItem>
                <SelectItem value="60">60 days (2 months)</SelectItem>
                <SelectItem value="90">90 days (3 months)</SelectItem>
                <SelectItem value="92">92 days</SelectItem>
                <SelectItem value="153">153 days (5 months)</SelectItem>
                <SelectItem value="176">176 days (6 months)</SelectItem>
                <SelectItem value="180">180 days (6 months)</SelectItem>
                <SelectItem value="207">207 days (7 months)</SelectItem>
                <SelectItem value="365">365 days (1 year)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="any"
              />
              {currentHolding && currentHolding.amount > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 px-2 text-xs font-semibold"
                  onClick={() => setAmount(currentHolding.amount.toString())}
                >
                  Max
                </Button>
              )}
            </div>
            {amount && parseFloat(amount) > 0 && (
              <div className="text-sm p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="text-muted-foreground text-xs mb-1">Estimated earnings for {duration} days:</div>
                <div className="font-semibold text-success">
                  +{formatCryptoAmount(parseFloat(amount) * (apy / 100) * (duration / 365))} {selectedCrypto}
                </div>
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleCreate} 
            disabled={loading || !currentHolding || availableHoldings.length === 0}
            className="w-full"
          >
            {loading ? 'Creating...' : 'Start Staking'}
          </Button>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground text-center">
              Funds will be deducted from your wallet balance
            </p>
            <p className="text-xs text-muted-foreground text-center">
              You can unstake your funds at any time
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
