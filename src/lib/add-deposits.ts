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

  const deposit2StartDate = new Date('2025-07-25T19:30:00')
  const deposit2EndDate = new Date('2026-01-10T19:30:00')
  const deposit2Amount = 6320
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

  return deposits
}
