import { type SubmitHandler } from "react-hook-form"
import { toast } from "sonner"
import { amountToDouble } from "@workspace/ui/lib/utils"
import { useNavigator } from "@/hooks/useNavigator"
import { NavBack } from "@/components/NavBack"
import { useAuth } from "@/hooks/useAuth"
import { saveGoal } from "@workspace/api/db/goals"
import { GoalForm, type GoalFormInputs } from "@/components/GoalForm"
import { useMutation } from "@tanstack/react-query"

export function AddGoal() {
  const user = useAuth()
  const saveGoalForUser = saveGoal(user.uid)

  const { goBack } = useNavigator()

  const { mutate } = useMutation({
    mutationFn: saveGoalForUser,
    onSuccess: () => toast.success("Save successful.", { onAutoClose: goBack }),
    onError: () => toast.error("Save failed, Try again."),
  })

  const onSubmit: SubmitHandler<GoalFormInputs> = async ({
    estimatedAmount,
    breakdown,
    ...data
  }) => {
    mutate({
      ...data,
      estimatedAmount: amountToDouble(estimatedAmount),
      breakdown: breakdown.map((b) => ({
        ...b,
        amount: amountToDouble(b.amount),
      })),
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <NavBack />
      <h1 className="text-xl font-bold">Add Goal</h1>
      <p className="text-sm">
        Add your planned goal like build a house, buy a car, repay loan etc
      </p>
      <GoalForm onSubmit={onSubmit} loading={false} />
    </div>
  )
}
