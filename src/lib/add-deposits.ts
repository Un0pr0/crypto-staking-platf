import { DepositPosition } from './types'

export function calculateAPRFromProfit(
  principal: number,
  profit: number,
  startDate: Date,
  endDate: Date
): number {
  const days = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const apr = (profit / principal) * (365 / days) * 100
  return apr
}

export function createDepositsData(): DepositPosition[] {
  const deposits: DepositPosition[] = []

  const deposit1StartDate = new Date('2025-05-02T11:00:00')
  const deposit1EndDate = new Date('2025-12-12T00:00:00')
  const deposit1Amount = 3760
  const deposit1Profit = 574
  const deposit1APR = calculateAPRFromProfit(
    deposit1Amount,
    deposit1Profit,
    deposit1StartDate,
    deposit1EndDate
  )
  
  deposits.push({
    id: `deposit-${Date.now()}-1`,
    currency: 'USDT',
    amount: deposit1Amount,
    apy: deposit1APR,
    startDate: deposit1StartDate.getTime(),
    term: Math.floor((deposit1EndDate.getTime() - deposit1StartDate.getTime()) / (1000 * 60 * 60 * 24)),
    maturityDate: deposit1EndDate.getTime(),
    interest: deposit1Profit
  })

  const deposit2StartDate = new Date('2025-07-25T19:30:00')
  const deposit2EndDate = new Date('2026-01-10T00:00:00')
  const deposit2Amount = 5035
  const deposit2Profit = 730
  const deposit2APR = calculateAPRFromProfit(
    deposit2Amount,
    deposit2Profit,
    deposit2StartDate,
    deposit2EndDate
  )
  
  deposits.push({
    id: `deposit-${Date.now()}-2`,
    currency: 'USDT',
    amount: deposit2Amount,
    apy: deposit2APR,
    startDate: deposit2StartDate.getTime(),
    term: Math.floor((deposit2EndDate.getTime() - deposit2StartDate.getTime()) / (1000 * 60 * 60 * 24)),
    maturityDate: deposit2EndDate.getTime(),
    interest: deposit2Profit
  })

  const deposit3StartDate = new Date('2025-08-20T11:00:00')
  const deposit3EndDate = new Date('2026-01-20T00:00:00')
  const deposit3Amount = 1285
  const deposit3Profit = 179
  const deposit3APR = calculateAPRFromProfit(
    deposit3Amount,
    deposit3Profit,
    deposit3StartDate,
    deposit3EndDate
  )
  
  deposits.push({
    id: `deposit-${Date.now()}-3`,
    currency: 'USDT',
    amount: deposit3Amount,
    apy: deposit3APR,
    startDate: deposit3StartDate.getTime(),
    term: Math.floor((deposit3EndDate.getTime() - deposit3StartDate.getTime()) / (1000 * 60 * 60 * 24)),
    maturityDate: deposit3EndDate.getTime(),
    interest: deposit3Profit
  })

  return deposits
}
