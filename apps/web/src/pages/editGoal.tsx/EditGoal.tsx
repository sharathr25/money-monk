import { FullScreenError } from "@/components/FullScreenError"
import { FullScreenLoader } from "@/components/FullScreenLoader"
import { GoalForm, type GoalFormInputs } from "@/components/GoalForm"
import { NavBack } from "@/components/NavBack"
import { useAuth } from "@/hooks/useAuth"
import { useNavigator } from "@/hooks/useNavigator"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getGoal, updateGoal } from "@workspace/api/db/goals"
import { Button } from "@workspace/ui/components/button"
import { amountToDouble } from "@workspace/ui/lib/utils"
import { MoveLeft, RefreshCcw } from "lucide-react"
import type { SubmitHandler } from "react-hook-form"
import { useParams } from "react-router"
import { toast } from "sonner"

export function EditGoal() {
  const { goalId = "" } = useParams()
  const { goBack } = useNavigator()
  const user = useAuth()
  const getGoalForUser = getGoal(user.uid)
  const updateGoalForUser = updateGoal(user.uid).bind(null, goalId)

  const {
    isPending: getGoalPending,
    error: getGoalError,
    data: goal,
    refetch,
  } = useQuery({
    queryKey: ["goal-edit-" + goalId],
    queryFn: async () => getGoalForUser(goalId),
  })

  const { mutate, isPending: updateGoalPending } = useMutation({
    mutationFn: updateGoalForUser,
    onSuccess: () =>
      toast.success("Update successful.", { onAutoClose: goBack }),
    onError: () => toast.error("Update failed, Try again."),
  })

  if (getGoalPending) return <FullScreenLoader />

  if (getGoalError) return <FullScreenError msg="Something went wrong" />

  if (!goal)
    return (
      <FullScreenError msg="Cash flow template not found">
        <div className="flex gap-2">
          <Button variant="outline" onClick={goBack}>
            <MoveLeft />
            Go back
          </Button>
          <Button onClick={() => refetch()}>
            <RefreshCcw />
            Refresh
          </Button>
        </div>
      </FullScreenError>
    )

  const onSubmit: SubmitHandler<GoalFormInputs> = async ({
    iconNameFilter,
    estimatedAmount,
    ...data
  }) => {
    mutate({
      ...data,
      estimatedAmount: amountToDouble(estimatedAmount),
      stages: goal.stages,
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <NavBack />
      <div>
        <h1 className="text-xl font-bold">Edit Goal</h1>
        <p className="text-sm">Edit your goal</p>
      </div>
      <GoalForm
        formInputs={{
          ...goal,
          estimatedAmount: `${goal.estimatedAmount}`,
          status: goal.status,
        }}
        onSubmit={onSubmit}
        loading={updateGoalPending}
      />
    </div>
  )
}
