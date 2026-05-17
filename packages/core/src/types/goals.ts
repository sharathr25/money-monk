export type GoalStatus = "PLANNED" | "ACTIVE" | "STARTED_SAVING" | "DONE"

export type GoalStage = {
  status: GoalStatus
  startDate: Date
}

export type GoalQuery = {
  status?: string
}

export type SaveGoalSpec = {
  description?: string
  name: string
  icon: string
  estimatedAmount: number
  status: GoalStatus
}

export type Goal = SaveGoalSpec & {
  id: string
  createdAt: Date
  updatedAt: Date
  stages: GoalStage[]
}

export type UpdateGoalSpec = SaveGoalSpec & {
  stages: GoalStage[]
}
