import { Cryptocurrency } from './types'

export const CRYPTO_INFO: Record<
  Cryptocurrency,
  { name: string; priceUSD: number; color: string; symbol: string }
> = {
  BTC: { name: 'Bitcoin', priceUSD: 43250, color: 'oklch(0.65 0.18 35)', symbol: '₿' },
  ETH: { name: 'Ethereum', priceUSD: 2280, color: 'oklch(0.60 0.15 260)', symbol: 'Ξ' },
  USDT: { name: 'Tether', priceUSD: 1, color: 'oklch(0.65 0.15 145)', symbol: '₮' },
  TRX: { name: 'Tron', priceUSD: 0.12, color: 'oklch(0.60 0.18 10)', symbol: 'TRX' },
  TON: { name: 'Toncoin', priceUSD: 5.45, color: 'oklch(0.65 0.15 210)', symbol: 'TON' },
  BNB: { name: 'BNB', priceUSD: 315, color: 'oklch(0.70 0.18 80)', symbol: 'BNB' },
  SOL: { name: 'Solana', priceUSD: 98, color: 'oklch(0.65 0.20 290)', symbol: 'SOL' },
  XRP: { name: 'XRP', priceUSD: 0.52, color: 'oklch(0.60 0.12 220)', symbol: 'XRP' },
}

export const STAKING_APYS: Record<Cryptocurrency, number> = {
  BTC: 0,
  ETH: 4.2,
  USDT: 8.5,
  TRX: 6.0,
  TON: 5.5,
  BNB: 5.8,
  SOL: 7.1,
  XRP: 3.5,
}

export const DEPOSIT_APYS: Record<30 | 60 | 90, Record<Cryptocurrency, number>> = {
  30: { BTC: 2.5, ETH: 5.0, USDT: 9.0, TRX: 7.0, TON: 6.5, BNB: 6.5, SOL: 8.0, XRP: 4.0 },
  60: { BTC: 3.5, ETH: 6.5, USDT: 10.5, TRX: 8.5, TON: 8.0, BNB: 8.0, SOL: 9.5, XRP: 5.5 },
  90: { BTC: 5.0, ETH: 8.0, USDT: 12.0, TRX: 10.0, TON: 9.5, BNB: 10.0, SOL: 11.5, XRP: 7.0 },
}

export function generateWalletAddress(crypto: Cryptocurrency): string {
  const prefixes: Record<Cryptocurrency, string> = {
    BTC: '1',
    ETH: '0x',
    USDT: '0x',
    TRX: 'T',
    TON: 'EQ',
    BNB: 'bnb',
    SOL: '',
    XRP: 'r',
  }
  
  const lengths: Record<Cryptocurrency, number> = {
    BTC: 34,
    ETH: 42,
    USDT: 42,
    TRX: 34,
    TON: 48,
    BNB: 42,
    SOL: 44,
    XRP: 34,
  }
  
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  const hexChars = '0123456789abcdef'
  
  const prefix = prefixes[crypto]
  const length = lengths[crypto] - prefix.length
  const useHex = crypto === 'ETH' || crypto === 'USDT'
  const charSet = useHex ? hexChars : chars
  
  let address = prefix
  for (let i = 0; i < length; i++) {
    address += charSet.charAt(Math.floor(Math.random() * charSet.length))
  }
  
  return address
}

export function formatCryptoAmount(amount: number, maxDecimals: number = 8): string {
  if (amount === 0) return '0'
  
  if (amount < 0.00000001) return amount.toExponential(2)
  
  const decimals = amount < 1 ? maxDecimals : amount < 100 ? 6 : 4
  
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function calculateStakingRewards(
  amount: number,
  apy: number,
  daysStaked: number
): number {
  return (amount * (apy / 100) * daysStaked) / 365
}

export function calculateDepositInterest(
  amount: number,
  apy: number,
  term: number
): number {
  return (amount * (apy / 100) * term) / 365
}
