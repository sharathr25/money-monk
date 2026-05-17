import type { Type } from "./cashFlowTemplates"
import type { GoalStatus } from "./goals"

export type TransactionType = Type | "SAVINGS"

export type SaveTransationSpec = {
  name: string
  description?: string
  icon: string
  amount: number
  type: TransactionType
  date: Date
  goal?: {
    id: string
    name: string
    status: GoalStatus
  }
  paidTo?: string
  category?: string
  templateId?: string
}

export type Transaction = SaveTransationSpec & {
  id: string
  createdAt: Date
  updatedAt: Date
  goal?: {
    id: string
    name: string
  }
}

export type UpdateTransactionSpec = SaveTransationSpec
