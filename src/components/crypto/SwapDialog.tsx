import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowsDownUp } from '@phosphor-icons/react'
import { Cryptocurrency } from '@/lib/types'
import { CRYPTO_INFO, formatCryptoAmount } from '@/lib/crypto-utils'
import { toast } from 'sonner'
import { STATIC_HOLDINGS } from '@/lib/static-data'

interface SwapDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SwapDialog({ open, onOpenChange }: SwapDialogProps) {
  const [fromCrypto, setFromCrypto] = useState<Cryptocurrency>('USDT')
  const [toCrypto, setToCrypto] = useState<Cryptocurrency>('BTC')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  
  const holdings = STATIC_HOLDINGS
  const availableHoldings = holdings.filter(h => h.amount > 0)
  const fromHolding = availableHoldings.find(h => h.symbol === fromCrypto)
  
  const fromPrice = CRYPTO_INFO[fromCrypto].priceUSD
  const toPrice = CRYPTO_INFO[toCrypto].priceUSD
  const exchangeRate = fromPrice / toPrice
  const toAmount = amount ? (parseFloat(amount) * exchangeRate).toFixed(8) : '0'
  
  const handleSwap = async () => {
    if (!amount || !fromHolding) {
      toast.error('Enter amount')
      return
    }
    
    const swapAmount = parseFloat(amount)
    if (swapAmount <= 0 || swapAmount > fromHolding.amount) {
      toast.error('Invalid amount')
      return
    }
    
    if (fromCrypto === toCrypto) {
      toast.error('Select different currencies')
      return
    }
    
    setLoading(true)
    
    setTimeout(() => {
      toast.success(`Swapped ${formatCryptoAmount(swapAmount)} ${fromCrypto} for ${formatCryptoAmount(parseFloat(toAmount))} ${toCrypto}`)
      setLoading(false)
      setAmount('')
      onOpenChange(false)
    }, 1000)
  }
  
  const flipCurrencies = () => {
    const temp = fromCrypto
    setFromCrypto(toCrypto)
    setToCrypto(temp)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Swap Cryptocurrency</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">From</label>
            <Select value={fromCrypto} onValueChange={(v) => setFromCrypto(v as Cryptocurrency)}>
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
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="any"
            />
            {fromHolding && (
              <div className="text-xs text-muted-foreground">
                Available: {formatCryptoAmount(fromHolding.amount)} {fromCrypto}
              </div>
            )}
          </div>
          
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={flipCurrencies}
              className="rounded-full"
            >
              <ArrowsDownUp />
            </Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">To</label>
            <Select value={toCrypto} onValueChange={(v) => setToCrypto(v as Cryptocurrency)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CRYPTO_INFO).map(([symbol, info]) => (
                  <SelectItem key={symbol} value={symbol}>
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
                ))}
              </SelectContent>
            </Select>
            <div className="bg-muted p-3 rounded-lg">
              <div className="text-2xl font-bold">
                {formatCryptoAmount(parseFloat(toAmount))}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Rate: 1 {fromCrypto} = {formatCryptoAmount(exchangeRate, 6)} {toCrypto}
            </div>
          </div>
          
          <Button 
            onClick={handleSwap} 
            disabled={loading || !fromHolding || availableHoldings.length === 0}
            className="w-full"
          >
            {loading ? 'Swapping...' : 'Swap'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
