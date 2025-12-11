export interface CryptoHolding {
  symbol: string
  name: string
  amount: number
  priceUSD: number
}

export interface Transaction {
  id: string
  type: 'send' | 'receive' | 'swap' | 'stake' | 'unstake' | 'deposit' | 'withdraw'
  timestamp: number
  amount: number
  currency: string
  toCurrency?: string
  toAmount?: number
  address?: string
  status: 'completed' | 'pending' | 'failed'
}

export interface StakePosition {
  id: string
  currency: string
  amount: number
  apy: number
  startDate: number
  rewards: number
}

export interface DepositPosition {
  id: string
  currency: string
  amount: number
  apy: number
  startDate: number
  term: 30 | 60 | 90
  maturityDate: number
  interest: number
}

export type Cryptocurrency = 'BTC' | 'ETH' | 'USDT' | 'BNB' | 'SOL' | 'XRP'
