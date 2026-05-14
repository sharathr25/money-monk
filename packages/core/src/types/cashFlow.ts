import type { CashFlowTemplate } from "./cashFlowTemplates"

export type CashFlow = {
  income: CashFlowTemplate[]
  expenses: CashFlowTemplate[]
  totalIncome: number
  totalExpenses: number
  openingBalance: number
  netCashFlow: number
  closingBalance: number
}
