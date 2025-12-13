import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowUp, ArrowDown, ArrowsLeftRight } from '@phosphor-icons/react'
import { CryptoHolding, StakePosition, DepositPosition } from '@/lib/types'
import { CRYPTO_INFO, formatCryptoAmount, formatUSD } from '@/lib/crypto-utils'
import { SendDialog } from './SendDialog'
import { ReceiveDialog } from './ReceiveDialog'
import { SwapDialog } from './SwapDialog'
import { useState, useEffect } from 'react'

export function BalanceView() {
  const [holdings, setHoldings] = useKV<CryptoHolding[]>('holdings', [])
  const [stakes] = useKV<StakePosition[]>('stakes', [])
  const [deposits] = useKV<DepositPosition[]>('deposits', [])
  const [sendOpen, setSendOpen] = useState(false)
  const [receiveOpen, setReceiveOpen] = useState(false)
  const [swapOpen, setSwapOpen] = useState(false)
  const [initialized, setInitialized] = useKV<boolean>('holdings-initialized', false)

  useEffect(() => {
    const initHoldings = async () => {
      if (!initialized) {
        setHoldings([
          { symbol: 'USDT', name: 'Tether', amount: 6135, priceUSD: CRYPTO_INFO.USDT.priceUSD },
          { symbol: 'BTC', name: 'Bitcoin', amount: 0, priceUSD: CRYPTO_INFO.BTC.priceUSD },
          { symbol: 'ETH', name: 'Ethereum', amount: 0, priceUSD: CRYPTO_INFO.ETH.priceUSD },
          { symbol: 'TRX', name: 'Tron', amount: 0, priceUSD: CRYPTO_INFO.TRX.priceUSD },
          { symbol: 'TON', name: 'Toncoin', amount: 0, priceUSD: CRYPTO_INFO.TON.priceUSD }
        ])
        setInitialized(true)
      }
    }
    
    initHoldings()
  }, [initialized, setHoldings, setInitialized])

  const holdingsBalance = (holdings || []).reduce((sum, holding) => {
    return sum + holding.amount * CRYPTO_INFO[holding.symbol as keyof typeof CRYPTO_INFO].priceUSD
  }, 0)

  const stakingBalance = (stakes || []).reduce((sum, stake) => {
    return sum + stake.amount * CRYPTO_INFO[stake.currency as keyof typeof CRYPTO_INFO].priceUSD
  }, 0)

  const depositsBalance = (deposits || []).reduce((sum, deposit) => {
    return sum + deposit.amount * CRYPTO_INFO[deposit.currency as keyof typeof CRYPTO_INFO].priceUSD
  }, 0)

  const totalBalance = holdingsBalance + stakingBalance + depositsBalance

  return (
    <div className="space-y-6">
      <Card className="p-8 balance-gradient border-primary/20">
        <div className="text-sm text-muted-foreground mb-2">Total Balance</div>
        <div className="text-5xl font-bold mb-8 tracking-tight">
          {formatUSD(21155)}
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
        {!holdings || holdings.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              You don't have any assets yet
            </p>
            <p className="text-sm text-muted-foreground">
              Use "Receive" to add balance (demo)
            </p>
          </Card>
        ) : (
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
        )}
      </div>

      <SendDialog open={sendOpen} onOpenChange={setSendOpen} />
      <ReceiveDialog open={receiveOpen} onOpenChange={setReceiveOpen} />
      <SwapDialog open={swapOpen} onOpenChange={setSwapOpen} />
    </div>
  )
}
