export type TransactionFrequency = "MONTHLY" | "ONE_TIME"

export type TransactionStatus = "PLANNED" | "COMPLETED"

export type TransactionQuery = {
  goalId?: string
  categoryId?: string
  limit?: number
  type?: string
  orderBy?: string
  status: TransactionStatus
  frequency?: string
  plannedDate?: {
    start: Date
    end?: Date
  }
}

export type TransactionType = "INCOME" | "EXPENSE" | "ADJUSTMENT" | "SAVINGS"

export type SaveTransationSpec = {
  name: string
  description?: string
  frequency: TransactionFrequency
  icon: string
  amount: number
  type: TransactionType
  plannedDate?: Date | null
  plannedDay?: number | null
  completedDate?: Date | null
  counterParty?: string
  status: TransactionStatus
  goal?: {
    id: string
    name: string
  } | null
  category?: {
    id: string
    name: string
  } | null
}

export type Transaction = SaveTransationSpec & {
  id: string
  createdAt: Date
  updatedAt: Date
}

export type UpdateTransactionSpec = SaveTransationSpec
