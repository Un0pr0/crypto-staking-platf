import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster } from '@/components/ui/sonner'
import { Wallet, LockKey, ChartLineUp, ClockCounterClockwise } from '@phosphor-icons/react'
import { BalanceView } from '@/components/crypto/BalanceView'
import { DepositsView } from '@/components/crypto/DepositsView'
import { StakingView } from '@/components/crypto/StakingView'
import { HistoryView } from '@/components/crypto/HistoryView'
import { LoginForm } from '@/components/crypto/LoginForm'

function App() {
  const [activeTab, setActiveTab] = useState('balance')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = (password: string) => {
    setIsAuthenticated(true)
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginForm onLogin={handleLogin} />
        <Toaster />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            WeraNex
          </h1>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="balance" className="gap-2">
              <Wallet className="hidden sm:block" />
              <span>Balance</span>
            </TabsTrigger>
            <TabsTrigger value="deposits" className="gap-2">
              <LockKey className="hidden sm:block" />
              <span>Deposits</span>
            </TabsTrigger>
            <TabsTrigger value="staking" className="gap-2">
              <ChartLineUp className="hidden sm:block" />
              <span>Staking</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <ClockCounterClockwise className="hidden sm:block" />
              <span>History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="balance" className="space-y-6">
            <BalanceView />
          </TabsContent>

          <TabsContent value="deposits" className="space-y-6">
            <DepositsView />
          </TabsContent>

          <TabsContent value="staking" className="space-y-6">
            <StakingView />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <HistoryView />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  )
}

export default App