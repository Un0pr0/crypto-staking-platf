import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CryptoHolding, Transaction, Cryptocurrency } from '@/lib/types'
import { CRYPTO_INFO, formatCryptoAmount } from '@/lib/crypto-utils'
import { toast } from 'sonner'

interface SendDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SendDialog({ open, onOpenChange }: SendDialogProps) {
  const [holdings, setHoldings] = useKV<CryptoHolding[]>('holdings', [])
  const [transactions, setTransactions] = useKV<Transaction[]>('transactions', [])
  const [selectedCrypto, setSelectedCrypto] = useState<Cryptocurrency>('BTC')
  const [amount, setAmount] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  
  const availableHoldings = (holdings || []).filter(h => h.amount > 0)
  const currentHolding = availableHoldings.find(h => h.symbol === selectedCrypto)
  
  const handleSend = async () => {
    if (!amount || !address || !currentHolding) {
      toast.error('Please fill all fields')
      return
    }
    
    const sendAmount = parseFloat(amount)
    if (sendAmount <= 0 || sendAmount > currentHolding.amount) {
      toast.error('Invalid amount')
      return
    }
    
    setLoading(true)
    
    setTimeout(() => {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'send',
        timestamp: Date.now(),
        amount: sendAmount,
        currency: selectedCrypto,
        address,
        status: 'completed',
      }
      
      setHoldings((currentHoldings) => {
        return (currentHoldings || []).map(holding => {
          if (holding.symbol === selectedCrypto) {
            return {
              ...holding,
              amount: holding.amount - sendAmount
            }
          }
          return holding
        })
      })
      
      setTransactions((current) => [newTransaction, ...(current || [])])
      
      toast.success('Withdrawal request created. Please allow up to 48 hours for processing.')
      setLoading(false)
      setAmount('')
      setAddress('')
      onOpenChange(false)
    }, 1000)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Cryptocurrency</DialogTitle>
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
                          <span className="text-muted-foreground ml-auto">
                            {formatCryptoAmount(holding.amount)}
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
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Recipient Address</label>
            <Input
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="font-mono text-sm"
            />
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
            {currentHolding && amount && (
              <div className="text-xs text-muted-foreground">
                ≈ ${(parseFloat(amount) * CRYPTO_INFO[selectedCrypto].priceUSD).toFixed(2)}
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleSend} 
            disabled={loading || !currentHolding || availableHoldings.length === 0}
            className="w-full"
          >
            {loading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
