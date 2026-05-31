import { useNavigator } from "@/hooks/useNavigator"
import { GoalBadge } from "@/pages/goal/GoalBadge"
import { ROUTE_NAMES } from "@/routes"
import type { Goal } from "@workspace/core/types/goals"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { formatAmount, formatDate } from "@workspace/ui/lib/utils"
import { DynamicIcon, type IconName } from "lucide-react/dynamic"

export const GoalItem = ({ goal }: { goal: Goal }) => {
  const { navigate } = useNavigator()

  const lastStage = goal.stages[goal.stages.length - 1]

  const onClick = () => {
    navigate(ROUTE_NAMES.GOAL, { goalId: goal.id })
  }

  return (
    <Card onClick={onClick}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {goal.name}
          <GoalBadge type={goal.status} />
        </CardTitle>
        <CardDescription>{goal.description}</CardDescription>
        <CardAction>
          <DynamicIcon name={goal.icon as IconName} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <CardTitle>Estimated Amount</CardTitle>
        <CardDescription className="flex justify-between">
          <div>
            {formatAmount(goal.estimatedAmount, { withCurrency: true })}
          </div>
          <div className="text-xs capitalize">
            {`${goal.status.toLowerCase().replace("_", " ")} On ${formatDate(lastStage.startDate)}`}
          </div>
        </CardDescription>
      </CardContent>
    </Card>
  )
}
