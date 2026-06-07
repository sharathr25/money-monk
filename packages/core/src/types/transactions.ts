export type TransactionFrequency = "MONTHLY" | "ONE_TIME"

export type TransactionStatus = "PLANNED" | "COMPLETED"

export type TransactionQuery = {
  goalId?: string
  categoryId?: string
  limit?: number
  type?: string
  orderBy?: string
  status?: TransactionStatus
  frequency?: string
  plannedStartDate?: Date
  plannedEndDate?: Date
  plannedDateExists?: boolean
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
