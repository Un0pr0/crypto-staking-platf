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
  const [holdings] = useKV<CryptoHolding[]>('holdings', [])
  const [stakes, setStakes] = useKV<StakePosition[]>('stakes', [])
  const [transactions, setTransactions] = useKV<Transaction[]>('transactions', [])
  const [selectedCrypto, setSelectedCrypto] = useState<Cryptocurrency>('ETH')
  const [amount, setAmount] = useState('')
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
    
    setTimeout(() => {
      const now = Date.now()
      
      const newStake: StakePosition = {
        id: Date.now().toString(),
        currency: selectedCrypto,
        amount: stakeAmount,
        apy,
        startDate: now,
        rewards: 0,
      }
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'stake',
        timestamp: now,
        amount: stakeAmount,
        currency: selectedCrypto,
        status: 'completed',
      }
      
      setStakes((current) => [...(current || []), newStake])
      setTransactions((current) => [newTransaction, ...(current || [])])
      
      toast.success(`Staking started: ${formatCryptoAmount(stakeAmount)} ${selectedCrypto}`)
      setLoading(false)
      setAmount('')
      onOpenChange(false)
    }, 1000)
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
              <div className="text-xs text-muted-foreground">
                Available: {formatCryptoAmount(currentHolding.amount)} {selectedCrypto}
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
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="any"
            />
            {amount && parseFloat(amount) > 0 && (
              <div className="text-sm p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="text-muted-foreground text-xs mb-1">Estimated yearly earnings:</div>
                <div className="font-semibold text-success">
                  +{formatCryptoAmount(parseFloat(amount) * (apy / 100))} {selectedCrypto}
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
          
          <p className="text-xs text-muted-foreground text-center">
            You can unstake your funds at any time
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
