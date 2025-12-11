import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CryptoHolding, DepositPosition, Transaction, Cryptocurrency } from '@/lib/types'
import { CRYPTO_INFO, DEPOSIT_APYS, formatCryptoAmount, calculateDepositInterest } from '@/lib/crypto-utils'
import { toast } from 'sonner'

interface CreateDepositDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateDepositDialog({ open, onOpenChange }: CreateDepositDialogProps) {
  const [holdings] = useKV<CryptoHolding[]>('holdings', [])
  const [deposits, setDeposits] = useKV<DepositPosition[]>('deposits', [])
  const [transactions, setTransactions] = useKV<Transaction[]>('transactions', [])
  const [selectedCrypto, setSelectedCrypto] = useState<Cryptocurrency>('BTC')
  const [term, setTerm] = useState<30 | 60 | 90>(30)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  
  const availableHoldings = (holdings || []).filter(h => h.amount > 0)
  const currentHolding = availableHoldings.find(h => h.symbol === selectedCrypto)
  const apy = DEPOSIT_APYS[term][selectedCrypto]
  const interest = amount ? calculateDepositInterest(parseFloat(amount), apy, term) : 0
  
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
    
    setTimeout(() => {
      const now = Date.now()
      const maturityDate = now + term * 24 * 60 * 60 * 1000
      
      const newDeposit: DepositPosition = {
        id: Date.now().toString(),
        currency: selectedCrypto,
        amount: depositAmount,
        apy,
        startDate: now,
        term,
        maturityDate,
        interest: calculateDepositInterest(depositAmount, apy, term),
      }
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'deposit',
        timestamp: now,
        amount: depositAmount,
        currency: selectedCrypto,
        status: 'completed',
      }
      
      setDeposits((current) => [...(current || []), newDeposit])
      setTransactions((current) => [newTransaction, ...(current || [])])
      
      toast.success(`Deposit created: ${formatCryptoAmount(depositAmount)} ${selectedCrypto}`)
      setLoading(false)
      setAmount('')
      onOpenChange(false)
    }, 1000)
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
              <div className="text-xs text-muted-foreground">
                Available: {formatCryptoAmount(currentHolding.amount)} {selectedCrypto}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Term</label>
            <Tabs value={term.toString()} onValueChange={(v) => setTerm(parseInt(v) as 30 | 60 | 90)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="30">30 days</TabsTrigger>
                <TabsTrigger value="60">60 days</TabsTrigger>
                <TabsTrigger value="90">90 days</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="text-sm text-center p-3 bg-muted rounded-lg">
              <span className="text-muted-foreground">APY: </span>
              <span className="font-semibold text-success">{apy}%</span>
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
