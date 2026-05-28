import type { Type } from "./cashFlowTemplates"

export type TransactionQuery = {
  goalId?: string
  limit?: number
  type?: string
}

export type TransactionType = Type | "BALANCE_ADJUSTMENT" | "SAVINGS"

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
  } | null
  category?: {
    id: string
    name: string
  } | null
  paidTo?: string
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
