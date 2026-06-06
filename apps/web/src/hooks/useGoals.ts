import { useQuery } from "@tanstack/react-query"
import { queryGoals } from "@workspace/api/db/goals"
import type { Goal } from "@workspace/core/types/goals"
import { useAuth } from "./useAuth"

export const useGoals = () => {
  const user = useAuth()
  const queryGoalsForUser = queryGoals(user.uid).bind(null, {
    status: "STARTED_SAVING,ACTIVE",
  })

  const { data: goals } = useQuery({
    queryKey: ["goals"],
    queryFn: queryGoalsForUser,
  })

  const goalsMap: Record<string, Goal> = goals
    ? goals.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {})
    : {}

  const getGoalAndCategory = ({
    categoryId,
    goalId,
  }: {
    categoryId?: string
    goalId?: string
  }) => {
    if (!goalId) return {}

    const goal = goalsMap[goalId]
    if (!goal) return {}

    const category = goalsMap[goalId].breakdown
      .filter((b) => b.id === categoryId)
      .map((b) => ({ id: b.id, name: b.category }))[0]

    return { category, goal: { id: goal.id, name: goal.name } }
  }

  return { goals, goalsMap, getGoalAndCategory }
}
