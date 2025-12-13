import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CryptoHolding, DepositPosition, Transaction, Cryptocurrency } from '@/lib/types'
import { CRYPTO_INFO, DEPOSIT_APYS, formatCryptoAmount, calculateDepositInterest, getDepositAPY } from '@/lib/crypto-utils'
import { toast } from 'sonner'

interface CreateDepositDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateDepositDialog({ open, onOpenChange }: CreateDepositDialogProps) {
  const [holdings, setHoldings] = useKV<CryptoHolding[]>('holdings', [])
  const [deposits, setDeposits] = useKV<DepositPosition[]>('deposits', [])
  const [transactions, setTransactions] = useKV<Transaction[]>('transactions', [])
  const [selectedCrypto, setSelectedCrypto] = useState<Cryptocurrency>('USDT')
  const [term, setTerm] = useState<number>(60)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  
  const availableHoldings = (holdings || []).filter(h => h.amount > 0)
  const currentHolding = availableHoldings.find(h => h.symbol === selectedCrypto)
  
  const numericAmount = parseFloat(amount) || 0
  const apy = getDepositAPY(numericAmount, selectedCrypto)
  const interest = amount ? calculateDepositInterest(numericAmount, apy, term) : 0
  
  const handleCreate = async () => {
    if (!amount || !currentHolding) {
      toast.error('Enter amount')
      return
    }
    
    const depositAmount = parseFloat(amount)
    if (depositAmount <= 0 || depositAmount > currentHolding.amount) {
      toast.error('Invalid amount')
      return
    }
    
    setLoading(true)
    
    try {
      const now = Date.now()
      const maturityDate = now + term * 24 * 60 * 60 * 1000
      
      const newDeposit: DepositPosition = {
        id: `deposit-${now}`,
        currency: selectedCrypto,
        amount: depositAmount,
        apy,
        startDate: now,
        term,
        maturityDate,
        interest: calculateDepositInterest(depositAmount, apy, term),
      }
      
      const newTransaction: Transaction = {
        id: `transaction-${now}`,
        type: 'deposit',
        timestamp: now,
        amount: depositAmount,
        currency: selectedCrypto,
        status: 'completed',
      }
      
      setHoldings((currentHoldings) => {
        return (currentHoldings || []).map(holding => {
          if (holding.symbol === selectedCrypto) {
            return {
              ...holding,
              amount: holding.amount - depositAmount
            }
          }
          return holding
        })
      })
      
      setDeposits((current) => {
        const updatedDeposits = [...(current || []), newDeposit]
        console.log('New deposit added:', newDeposit)
        console.log('Total deposits:', updatedDeposits.length)
        return updatedDeposits
      })
      
      setTransactions((current) => [newTransaction, ...(current || [])])
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      toast.success(`Deposit created: ${formatCryptoAmount(depositAmount)} ${selectedCrypto}`)
      
      setAmount('')
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating deposit:', error)
      toast.error('Failed to create deposit')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Deposit</DialogTitle>
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
                  <div className="p-2 text-sm text-muted-foreground">No assets</div>
                ) : (
                  availableHoldings.map((holding) => {
                    const info = CRYPTO_INFO[holding.symbol as keyof typeof CRYPTO_INFO]
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
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Term (Days)</label>
            <Input
              type="number"
              min="1"
              max="365"
              value={term}
              onChange={(e) => {
                const val = parseInt(e.target.value)
                if (val >= 1 && val <= 365) {
                  setTerm(val)
                } else if (e.target.value === '') {
                  setTerm(60)
                }
              }}
              placeholder="Enter days (1-365)"
            />
            <div className="flex gap-2 flex-wrap">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setTerm(60)}
                className="text-xs"
              >
                60 days
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setTerm(90)}
                className="text-xs"
              >
                90 days
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setTerm(180)}
                className="text-xs"
              >
                180 days
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setTerm(365)}
                className="text-xs"
              >
                365 days
              </Button>
            </div>
            <div className="text-sm text-center p-3 bg-muted rounded-lg">
              <span className="text-muted-foreground">APY: </span>
              <span className="font-semibold text-success">{apy}%</span>
            </div>
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
            {amount && interest > 0 && (
              <div className="text-sm p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Earnings in {term} days:</span>
                  <span className="font-semibold text-success">
                    +{formatCryptoAmount(interest)} {selectedCrypto}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleCreate} 
            disabled={loading || !currentHolding || availableHoldings.length === 0}
            className="w-full"
          >
            {loading ? 'Creating...' : 'Create Deposit'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
