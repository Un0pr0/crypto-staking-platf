import { CryptoHolding, StakePosition, DepositPosition } from './types'

export const STATIC_HOLDINGS: CryptoHolding[] = [
  { symbol: 'USDT', name: 'Tether', amount: 6135, priceUSD: 1 },
  { symbol: 'BTC', name: 'Bitcoin', amount: 0, priceUSD: 97500 },
  { symbol: 'ETH', name: 'Ethereum', amount: 0, priceUSD: 3650 },
  { symbol: 'TRX', name: 'Tron', amount: 0, priceUSD: 0.25 },
  { symbol: 'TON', name: 'Toncoin', amount: 0, priceUSD: 5.80 }
]

export const STATIC_STAKES: StakePosition[] = [
  {
    id: 'stake-1750032000000-1',
    currency: 'USDT',
    amount: 1652,
    apy: 30.84,
    startDate: new Date('2025-06-18T10:30:00').getTime(),
    endDate: new Date('2025-12-11T10:30:00').getTime(),
    rewards: 149,
    durationDays: 176
  },
  {
    id: 'stake-1754092800000-2',
    currency: 'USDT',
    amount: 2565,
    apy: 26.05,
    startDate: new Date('2025-08-02T15:45:00').getTime(),
    endDate: new Date('2026-02-25T15:45:00').getTime(),
    rewards: 379,
    durationDays: 207
  },
  {
    id: 'stake-1758844800000-3',
    currency: 'USDT',
    amount: 3350,
    apy: 35.32,
    startDate: new Date('2025-09-26T09:20:00').getTime(),
    endDate: new Date('2026-02-26T09:20:00').getTime(),
    rewards: 496,
    durationDays: 153
  },
  {
    id: 'stake-1752134400000-4',
    currency: 'USDT',
    amount: 2785,
    apy: 29.85,
    startDate: new Date('2025-07-10T16:00:00').getTime(),
    endDate: new Date('2026-01-07T00:00:00').getTime(),
    rewards: 412,
    durationDays: 181
  }
]

export const STATIC_DEPOSITS: DepositPosition[] = [
  {
    id: 'deposit-1746172800000-1',
    currency: 'USDT',
    amount: 3760,
    apy: 26.85,
    startDate: new Date('2025-05-02T11:00:00').getTime(),
    term: 224,
    maturityDate: new Date('2025-12-12T00:00:00').getTime(),
    interest: 574
  },
  {
    id: 'deposit-1753545000000-2',
    currency: 'USDT',
    amount: 5035,
    apy: 25.54,
    startDate: new Date('2025-07-25T19:30:00').getTime(),
    term: 169,
    maturityDate: new Date('2026-01-10T00:00:00').getTime(),
    interest: 730
  },
  {
    id: 'deposit-1755820800000-3',
    currency: 'USDT',
    amount: 1285,
    apy: 26.92,
    startDate: new Date('2025-08-20T11:00:00').getTime(),
    term: 153,
    maturityDate: new Date('2026-01-20T00:00:00').getTime(),
    interest: 179
  }
]

export const TOTAL_BALANCE = 21155
export const AVAILABLE_BALANCE = 6135
export const TOTAL_STAKED = 8700
export const TOTAL_REWARDS = 1287
export const ACTIVE_POSITIONS = 3
export const ACTIVE_DEPOSITS = 2
