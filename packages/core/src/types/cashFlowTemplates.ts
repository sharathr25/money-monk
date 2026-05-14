export type Frequency = "MONTHLY" | "ONE_TIME"

export type Type = "INCOME" | "EXPENSE"

export type CashFlowTemplateQuery = {
  type?: string
  startDate?: Date
  endDate?: Date
}

export type SaveCashFlowTemplateSpec = {
  description?: string
  frequency: Frequency
  name: string
  icon: string
  type: Type
  amount: number
  date?: Date | null
  day?: number | null
}

export type CashFlowTemplate = SaveCashFlowTemplateSpec & {
  id: string
  createdAt: Date
  updatedAt: Date
}

export type UpdateCashFlowTemplate = SaveCashFlowTemplateSpec
