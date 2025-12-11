import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Copy, Check } from '@phosphor-icons/react'
import { CRYPTO_INFO, generateWalletAddress } from '@/lib/crypto-utils'
import { Cryptocurrency } from '@/lib/types'
import { toast } from 'sonner'

interface ReceiveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReceiveDialog({ open, onOpenChange }: ReceiveDialogProps) {
  const [selectedCrypto, setSelectedCrypto] = useState<Cryptocurrency>('BTC')
  const [copied, setCopied] = useState(false)
  
  const address = generateWalletAddress(selectedCrypto)
  
  const handleCopy = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    toast.success('Адрес скопирован')
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Получить криптовалюту</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Криптовалюта</label>
            <Select value={selectedCrypto} onValueChange={(v) => setSelectedCrypto(v as Cryptocurrency)}>
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
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Адрес кошелька</label>
            <div className="bg-muted p-4 rounded-lg break-all font-mono text-sm">
              {address}
            </div>
          </div>
          
          <Button onClick={handleCopy} className="w-full gap-2">
            {copied ? <Check /> : <Copy />}
            {copied ? 'Скопировано!' : 'Скопировать адрес'}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            Это демо-адрес. Не отправляйте реальные средства.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
