import { StakePosition } from './types'

export function createStakesData(): StakePosition[] {
  const stakes: StakePosition[] = []

  const now = Date.now()
  const stake1Days = 176
  const stake1StartDate = now - (stake1Days * 24 * 60 * 60 * 1000)
  const stake1EndDate = now
  const stake1Amount = 1652
  const stake1APY = 18.22
  const stake1Rewards = 149
  
  stakes.push({
    id: `stake-1750377600000-1`,
    currency: 'USDT',
    amount: stake1Amount,
    apy: stake1APY,
    startDate: stake1StartDate,
    endDate: stake1EndDate,
    rewards: stake1Rewards,
    durationDays: stake1Days
  })

  const stake2StartDate = new Date('2025-08-02T00:00:00')
  const stake2EndDate = new Date('2026-02-25T00:00:00')
  const stake2Amount = 2565
  const stake2Days = 207
  const stake2APY = 26.05
  const stake2Rewards = 379
  
  stakes.push({
    id: `stake-1754092800000-2`,
    currency: 'USDT',
    amount: stake2Amount,
    apy: stake2APY,
    startDate: stake2StartDate.getTime(),
    endDate: stake2EndDate.getTime(),
    rewards: stake2Rewards,
    durationDays: stake2Days
  })

  const stake3StartDate = new Date('2025-09-26T00:00:00')
  const stake3EndDate = new Date('2026-02-26T00:00:00')
  const stake3Amount = 3350
  const stake3Days = 153
  const stake3APY = 35.32
  const stake3Rewards = 496
  
  stakes.push({
    id: `stake-1758844800000-3`,
    currency: 'USDT',
    amount: stake3Amount,
    apy: stake3APY,
    startDate: stake3StartDate.getTime(),
    endDate: stake3EndDate.getTime(),
    rewards: stake3Rewards,
    durationDays: stake3Days
  })

  const stake4StartDate = new Date('2025-07-10T00:00:00')
  const stake4EndDate = new Date('2026-01-07T00:00:00')
  const stake4Amount = 2785
  const stake4Days = 181
  const stake4APY = 29.85
  const stake4Rewards = 412
  
  stakes.push({
    id: `stake-1752134400000-4`,
    currency: 'USDT',
    amount: stake4Amount,
    apy: stake4APY,
    startDate: stake4StartDate.getTime(),
    endDate: stake4EndDate.getTime(),
    rewards: stake4Rewards,
    durationDays: stake4Days
  })

  return stakes
}
