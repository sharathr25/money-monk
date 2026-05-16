import { FullScreenError } from "@/components/FullScreenError"
import { FullScreenLoader } from "@/components/FullScreenLoader"
import { useAuth } from "@/hooks/useAuth"
import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import { useQuery } from "@tanstack/react-query"
import { queryGoals } from "@workspace/api/db/goals"
import type { Goal, GoalEventType } from "@workspace/core/types/goals"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { formatAmount, formatDate } from "@workspace/ui/lib/utils"
import { Plus } from "lucide-react"
import { DynamicIcon, type IconName } from "lucide-react/dynamic"
import { useState } from "react"

const TABS: (GoalEventType | "ALL")[] = [
  "ALL",
  "PLANNED",
  "ACTIVE",
  "PAUSED",
  "STARTED_SAVING",
  "DONE",
]

const BADGES: Record<GoalEventType, React.ReactElement> = {
  PLANNED: <Badge variant="outline">Planned</Badge>,
  ACTIVE: <Badge>Active</Badge>,
  PAUSED: <Badge variant="destructive">Paused</Badge>,
  STARTED_SAVING: <Badge>Started Saving</Badge>,
  DONE: <Badge className="bg-(--success)">Done</Badge>,
}

export function Goals() {
  const user = useAuth()
  const queryGoalsForUser = queryGoals(user.uid)
  const {
    isPending,
    error,
    data: goals,
  } = useQuery({
    queryKey: ["goals"],
    queryFn: queryGoalsForUser,
  })

  const { navigate } = useNavigator()

  const [tab, setTab] = useState(0)

  if (isPending) return <FullScreenLoader />

  if (error) return <FullScreenError msg="Failed to get goals" />

  const renderCard = (g: Goal) => {
    const state = g.state
    return (
      <Card key={g.id}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {g.name}
            {BADGES[state.type]}
          </CardTitle>
          <CardDescription>{g.description}</CardDescription>
          <CardAction>
            <DynamicIcon name={g.icon as IconName} />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {formatAmount(state.amount, { withCurrency: true })}
        </CardContent>
        <CardFooter className="capitalize">
          {`${state.type.toLowerCase().replace("_", " ")} On ${formatDate(state.startDate)}`}
        </CardFooter>
      </Card>
    )
  }

  const goalsFiltered = goals.filter((g) =>
    tab === 0 ? true : g.state.type === TABS[tab]
  )

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-extrabold">Commitments</h1>
        <p>Your financial journeys and milestones.</p>
      </div>
      <div className="no-scrollbar flex w-full flex-1 gap-2 overflow-x-scroll">
        {TABS.map((t, i) => (
          <Badge
            key={t}
            variant={i === tab ? "default" : "secondary"}
            onClick={() => setTab(i)}
            className="capitalize"
          >
            {t.toLowerCase().replace("_", " ")}
          </Badge>
        ))}
      </div>
      <div className="flex flex-col gap-4">{goalsFiltered.map(renderCard)}</div>
      <Button
        className="fixed right-6 bottom-20 h-12 w-12 rounded-full"
        onClick={() => navigate(ROUTE_NAMES.ADD_GOAL)}
      >
        <Plus />
      </Button>
    </div>
  )
}
