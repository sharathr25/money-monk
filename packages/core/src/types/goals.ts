import { GOAL_STATUSES } from "@workspace/ui/constants/goals"

export type GoalStatus = (typeof GOAL_STATUSES)[number]

export type GoalStage = {
  status: GoalStatus
  startDate: Date
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
