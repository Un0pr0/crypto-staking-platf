import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { LockKey, CalendarBlank, TrendUp, Coins, Clock, Trash } from '@phosphor-icons/react'
import { DepositPosition } from '@/lib/types'
import { CRYPTO_INFO, formatCryptoAmount, formatUSD } from '@/lib/crypto-utils'

interface DepositDetailDialogProps {
  deposit: DepositPosition | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete?: (depositId: string) => void
}

export function DepositDetailDialog({ deposit, open, onOpenChange, onDelete }: DepositDetailDialogProps) {
  if (!deposit) return null
  
  const info = CRYPTO_INFO[deposit.currency as keyof typeof CRYPTO_INFO]
  const now = Date.now()
  const isMatured = now >= deposit.maturityDate
  const progress = isMatured ? 100 : ((now - deposit.startDate) / (deposit.maturityDate - deposit.startDate)) * 100
  const daysRemaining = Math.ceil((deposit.maturityDate - now) / (1000 * 60 * 60 * 24))
  const daysElapsed = Math.floor((now - deposit.startDate) / (1000 * 60 * 60 * 24))
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(deposit.id)
      onOpenChange(false)
    }
  }
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }
  
  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const totalValue = deposit.amount + deposit.interest
  const currentInterest = isMatured ? deposit.interest : (deposit.interest * (progress / 100))
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold"
              style={{ backgroundColor: info.color }}
            >
              {info.symbol}
            </div>
            <div>
              <DialogTitle className="text-2xl">Deposit Details</DialogTitle>
              <p className="text-sm text-muted-foreground">{info.name}</p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <Card className="p-4 bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Value at Maturity</span>
              <Badge variant={isMatured ? 'default' : 'secondary'}>
                {isMatured ? 'Matured' : 'Active'}
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-1">
              {formatCryptoAmount(totalValue)} {deposit.currency}
            </div>
            <div className="text-muted-foreground">
              {formatUSD(totalValue * info.priceUSD)}
            </div>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                <Coins size={18} />
                <span className="text-sm">Deposited Amount</span>
              </div>
              <div className="text-xl font-bold">
                {formatCryptoAmount(deposit.amount)} {deposit.currency}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatUSD(deposit.amount * info.priceUSD)}
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                <TrendUp size={18} />
                <span className="text-sm">Total Interest</span>
              </div>
              <div className="text-xl font-bold text-success">
                +{formatCryptoAmount(deposit.interest)} {deposit.currency}
              </div>
              <div className="text-xs text-muted-foreground">
                {deposit.apy.toFixed(2)}% APY
              </div>
            </Card>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <CalendarBlank />
              Timeline
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium">Opening Date</div>
                  <div className="text-xs text-muted-foreground">Deposit started</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatDate(deposit.startDate)}</div>
                  <div className="text-xs text-muted-foreground">{formatDateTime(deposit.startDate)}</div>
                </div>
              </div>
              
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium">Closing Date</div>
                  <div className="text-xs text-muted-foreground">Maturity date</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatDate(deposit.maturityDate)}</div>
                  <div className="text-xs text-muted-foreground">{formatDateTime(deposit.maturityDate)}</div>
                </div>
              </div>
              
              <Card className="p-4 bg-muted/50">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={18} />
                  <span className="text-sm font-medium">Duration</span>
                </div>
                {!isMatured ? (
                  <>
                    <Progress value={progress} className="h-2 mb-3" />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {daysElapsed} days elapsed
                      </span>
                      <span className="font-semibold">
                        {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-sm">
                    <span className="font-semibold">Completed</span>
                    <span className="text-muted-foreground ml-2">
                      ({deposit.term} days term)
                    </span>
                  </div>
                )}
              </Card>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h3 className="font-semibold">Interest Breakdown</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Accrued Interest</span>
                <span className="font-semibold text-success">
                  +{formatCryptoAmount(currentInterest)} {deposit.currency}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Interest at Maturity</span>
                <span className="font-semibold text-success">
                  +{formatCryptoAmount(deposit.interest)} {deposit.currency}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Annual Percentage Yield</span>
                <span className="font-semibold">{deposit.apy.toFixed(2)}%</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Term Length</span>
                <span className="font-semibold">{deposit.term} days</span>
              </div>
            </div>
          </div>
          
          {isMatured && (
            <>
              <Separator />
              <Button className="w-full gap-2" size="lg">
                <LockKey />
                Withdraw {formatCryptoAmount(totalValue)} {deposit.currency}
              </Button>
            </>
          )}
          
          {!isMatured && onDelete && (
            <>
              <Separator />
              <Button 
                variant="destructive" 
                className="w-full gap-2" 
                size="lg"
                onClick={handleDelete}
              >
                <Trash />
                Delete Deposit
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
