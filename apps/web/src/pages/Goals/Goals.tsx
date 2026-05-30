import { FullScreenError } from "@/components/FullScreenError"
import { FullScreenLoader } from "@/components/FullScreenLoader"
import { GoalBadge } from "@/components/GoalBadge"
import { useAuth } from "@/hooks/useAuth"
import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import { useQuery } from "@tanstack/react-query"
import { queryGoals } from "@workspace/api/db/goals"
import type { Goal, GoalStatus } from "@workspace/core/types/goals"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { GOAL_STATUSES } from "@workspace/ui/constants/goals"
import { formatAmount, formatDate } from "@workspace/ui/lib/utils"
import { CirclePlus, Filter, FolderCode, Plus, Save, X } from "lucide-react"
import { DynamicIcon, type IconName } from "lucide-react/dynamic"
import { useState } from "react"
import { useForm } from "react-hook-form"

const DEFAULT_QUERY = { status: "ALL" as GoalStatus | "ALL" }

export function Goals() {
  const user = useAuth()
  const { handleSubmit, setValue, watch } = useForm<{
    status: GoalStatus | "ALL"
  }>({
    defaultValues: DEFAULT_QUERY,
  })
  const [filters, setFilters] = useState(DEFAULT_QUERY)
  const {
    isPending,
    data: goals = [],
    error,
  } = useQuery({
    queryKey: ["cashflow-templates", filters],
    queryFn: queryGoals(user.uid).bind(null, filters),
  })
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false)

  const onSubmit = (filters: { status: GoalStatus | "ALL" }) => {
    setFilters(filters)
    setFiltersDialogOpen(false)
  }

  const { navigate } = useNavigator()

  const status = watch("status")

  if (isPending) return <FullScreenLoader />

  if (error) return <FullScreenError msg="Failed to get goals" />

  const renderCard = (g: Goal) => {
    const lastStage = g.stages[g.stages.length - 1]
    return (
      <Card
        key={g.id}
        onClick={() => navigate(ROUTE_NAMES.GOAL, { goalId: g.id })}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {g.name}
            <GoalBadge type={g.status} />
          </CardTitle>
          <CardDescription>{g.description}</CardDescription>
          <CardAction>
            <DynamicIcon name={g.icon as IconName} />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <CardTitle>Estimated Amount</CardTitle>
          <CardDescription className="flex justify-between">
            <div>{formatAmount(g.estimatedAmount, { withCurrency: true })}</div>
            <div className="text-xs capitalize">
              {`${g.status.toLowerCase().replace("_", " ")} On ${formatDate(lastStage.startDate)}`}
            </div>
          </CardDescription>
        </CardContent>
      </Card>
    )
  }

  const NoGoals = () => (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderCode />
        </EmptyMedia>
        <EmptyTitle className="capitalize">No Goals Yet</EmptyTitle>
        <EmptyDescription>
          Start by clicking on <CirclePlus className="inline size-5" /> to add
          your first goal
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">Goals</h1>
          <p className="text-sm">Track progress, stay motivated.</p>
        </div>
        <div className="flex items-center justify-between">
          <AlertDialog
            open={filtersDialogOpen}
            onOpenChange={setFiltersDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                Filters
                <Filter />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader className="flex flex-col items-start">
                <AlertDialogTitle>Change Filters</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                Apply filters to limit result
              </AlertDialogDescription>
              <Field>
                <FieldLabel htmlFor="type">Status</FieldLabel>
                <Select
                  defaultValue={status}
                  onValueChange={(v: GoalStatus | "ALL") =>
                    setValue("status", v)
                  }
                >
                  <SelectTrigger id="type" className="!h-11 capitalize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All</SelectItem>
                    {GOAL_STATUSES.map((s) => (
                      <SelectItem value={s} key={s} className="capitalize">
                        {s.toLowerCase().replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  <X />
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit(onSubmit)}>
                  <Save /> Apply
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {goals.length ? goals.map(renderCard) : <NoGoals />}
      </div>
      <Button
        className="fixed right-6 bottom-20 h-12 w-12 rounded-full"
        onClick={() => navigate(ROUTE_NAMES.ADD_GOAL)}
      >
        <Plus />
      </Button>
    </div>
  )
}
