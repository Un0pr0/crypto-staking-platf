import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowUp, ArrowDown, ArrowsLeftRight } from '@phosphor-icons/react'
import { CRYPTO_INFO, formatCryptoAmount, formatUSD } from '@/lib/crypto-utils'
import { SendDialog } from './SendDialog'
import { ReceiveDialog } from './ReceiveDialog'
import { SwapDialog } from './SwapDialog'
import { useState } from 'react'
import { STATIC_HOLDINGS, TOTAL_BALANCE } from '@/lib/static-data'

export function BalanceView() {
  const [sendOpen, setSendOpen] = useState(false)
  const [receiveOpen, setReceiveOpen] = useState(false)
  const [swapOpen, setSwapOpen] = useState(false)

  const holdings = STATIC_HOLDINGS

  return (
    <div className="space-y-6">
      <Card className="p-8 balance-gradient border-primary/20">
        <div className="text-sm text-muted-foreground mb-2">Total Balance</div>
        <div className="text-5xl font-bold mb-8 tracking-tight">
          {formatUSD(TOTAL_BALANCE)}
        </div>
        
        <div className="flex gap-3 flex-wrap">
          <Button 
            onClick={() => setReceiveOpen(true)} 
            variant="default"
            className="gap-2"
          >
            <ArrowDown />
            Receive
          </Button>
          <Button 
            onClick={() => setSendOpen(true)}
            variant="secondary"
            className="gap-2"
          >
            <ArrowUp />
            Send
          </Button>
          <Button 
            onClick={() => setSwapOpen(true)}
            variant="secondary"
            className="gap-2"
          >
            <ArrowsLeftRight />
            Swap
          </Button>
        </div>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Assets</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {holdings.map((holding) => {
            const info = CRYPTO_INFO[holding.symbol as keyof typeof CRYPTO_INFO]
            const value = holding.amount * info.priceUSD
            
            return (
              <Card key={holding.symbol} className="p-6 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{ backgroundColor: info.color }}
                  >
                    {info.symbol}
                  </div>
                  <div>
                    <div className="font-semibold">{info.name}</div>
                    <div className="text-sm text-muted-foreground">{holding.symbol}</div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-2xl font-bold">
                    {formatCryptoAmount(holding.amount)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatUSD(value)}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      <SendDialog open={sendOpen} onOpenChange={setSendOpen} />
      <ReceiveDialog open={receiveOpen} onOpenChange={setReceiveOpen} />
      <SwapDialog open={swapOpen} onOpenChange={setSwapOpen} />
    </div>
  )
}
