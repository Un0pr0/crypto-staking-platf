import { StakePosition } from './types'

export function createStakesData(): StakePosition[] {
  const stakes: StakePosition[] = []

  const stake1StartDate = new Date('2024-10-09T00:00:00')
  const stake1EndDate = new Date('2026-01-01T00:00:00')
  const stake1Amount = 2785
  const stake1Days = 181
  const stake1APY = 16
  const stake1Rewards = (stake1Amount * (stake1APY / 100) * stake1Days) / 365
  
  stakes.push({
    id: `stake-1728432000000-1`,
    currency: 'USDT',
    amount: stake1Amount,
    apy: stake1APY,
    startDate: stake1StartDate.getTime(),
    endDate: stake1EndDate.getTime(),
    rewards: stake1Rewards,
    durationDays: stake1Days
  })

  const stake2StartDate = new Date('2024-10-09T00:00:00')
  const stake2EndDate = new Date('2026-01-01T00:00:00')
  const stake2Amount = 3350
  const stake2Days = 153
  const stake2APY = 16
  const stake2Rewards = (stake2Amount * (stake2APY / 100) * stake2Days) / 365
  
  stakes.push({
    id: `stake-1728432000000-2`,
    currency: 'USDT',
    amount: stake2Amount,
    apy: stake2APY,
    startDate: stake2StartDate.getTime(),
    endDate: stake2EndDate.getTime(),
    rewards: stake2Rewards,
    durationDays: stake2Days
  })

  return stakes
}
