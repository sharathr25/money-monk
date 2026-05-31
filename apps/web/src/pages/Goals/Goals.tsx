import { FullScreenError } from "@/components/FullScreenError"
import { FullScreenLoader } from "@/components/FullScreenLoader"
import { useAuth } from "@/hooks/useAuth"
import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import { useQuery } from "@tanstack/react-query"
import { queryGoals } from "@workspace/api/db/goals"
import type { GoalStatus } from "@workspace/core/types/goals"
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
import { CirclePlus, Filter, FolderCode, Plus, Save, X } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { GoalItem } from "./GoalItem"

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
        {goals.length ? (
          goals.map((g) => <GoalItem goal={g} key={g.id} />)
        ) : (
          <NoGoals />
        )}
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
