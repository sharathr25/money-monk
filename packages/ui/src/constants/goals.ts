import { type GoalStatus } from "@workspace/core/type/goals"

export const GOAL_STATUSES = [
  "PLANNED",
  "ACTIVE",
  "STARTED_SAVING",
  "DONE",
] as const

export const STATUS_TO_AMOUNT_LABEL: Record<GoalStatus, string> = {
  PLANNED: "Estimated Amount",
  ACTIVE: "Current Amount",
  DONE: "Actual Amount",
  STARTED_SAVING: "Saved Amount",
}
