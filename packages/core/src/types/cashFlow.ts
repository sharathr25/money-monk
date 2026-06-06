import type { Transaction } from "./transactions"

export type CashFlow = {
  income: Transaction[]
  expenses: Transaction[]
  totalIncome: number
  totalExpenses: number
  openingBalance: number
  netCashFlow: number
  closingBalance: number
}

export type CashFlowProjection = {
  month: string
  year: string
  totalIncome: number
  totalExpenses: number
  openingBalance: number
  netCashFlow: number
  closingBalance: number
}
