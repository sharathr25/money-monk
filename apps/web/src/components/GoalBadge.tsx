import type { GoalStatus } from "@workspace/core/types/goals"
import { Badge } from "@workspace/ui/components/badge"

const BADGES: Record<GoalStatus, React.ReactElement> = {
  PLANNED: <Badge variant="outline">Planned</Badge>,
  ACTIVE: <Badge>Active</Badge>,
  PAUSED: <Badge variant="destructive">Paused</Badge>,
  STARTED_SAVING: <Badge variant="secondary">Started Saving</Badge>,
  DONE: <Badge className="bg-(--success)">Done</Badge>,
}

export const GoalBadge = ({ type }: { type: GoalStatus }) => BADGES[type]
