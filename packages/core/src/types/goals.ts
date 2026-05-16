export type GoalEventType =
  | "PLANNED"
  | "ACTIVE"
  | "PAUSED"
  | "STARTED_SAVING"
  | "DONE"

export type GoalEvent = {
  type: GoalEventType
  startDate: Date
  amount: number
}

export type SaveGoalSpec = {
  description?: string
  name: string
  icon: string
  estimatedAmount: number
}

export type Goal = Omit<
  SaveGoalSpec & {
    id: string
    createdAt: Date
    updatedAt: Date
    events: GoalEvent[]
    state: GoalEvent
  },
  "estimatedAmount"
>

export type UpdateGoalSpec = SaveGoalSpec
