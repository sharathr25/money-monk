export type Frequency = "MONTHLY" | "ONE_TIME"

export type Type = "INCOME" | "EXPENSE"

export type CashFlowTemplateQuery = {
  uid: string
  type?: string
}

export type SaveCashFlowTemplateSpec = {
  description?: string
  frequency: Frequency
  name: string
  type: Type
  amount: number
  date?: Date | null
}
