import type { Type } from "./cashFlowTemplates"
import type { GoalStage } from "./goals"

export type TransactionType = Type

export type SaveTransationSpec = {
  name: string
  description?: string
  icon: string
  amount: number
  type: TransactionType
  goalId?: string
  goalStage?: GoalStage
  paidTo?: string
  category?: string
  templateId?: string
}

export type Transaction = SaveTransationSpec & {
  id: string
  createdAt: Date
  updatedAt: Date
}

export type UpdateTransactionSpec = SaveTransationSpec
