import { type SubmitHandler } from "react-hook-form"
import { toast } from "sonner"
import { amountToDouble } from "@workspace/ui/lib/utils"
import {
  CashFlowTemplateForm,
  type CashFlowTemplateFormInputs,
} from "@/components/CashFlowTemplateForm"
import { useNavigator } from "@/hooks/useNavigator"
import { NavBack } from "@/components/NavBack"
import { useAuth } from "@/hooks/useAuth"
import { useMutation } from "@tanstack/react-query"
import { useGoals } from "@/hooks/useGoals"
import { saveTransaction } from "@workspace/api/db/transactions"

export function AddCashFlowTemplate() {
  const user = useAuth()
  const { goBack } = useNavigator()

  const { goalsMap, getGoalAndCategory } = useGoals()

  const { mutate, isPending: saveApiLoading } = useMutation({
    mutationKey: ["add-goal"],
    mutationFn: saveTransaction(user.uid),
    onSuccess: () =>
      toast.success("Save successful.", {
        onAutoClose: goBack,
      }),
    onError: () => toast.error("Save failed, Try again."),
  })

  const onSubmit: SubmitHandler<CashFlowTemplateFormInputs> = async ({
    amount,
    date,
    goalId,
    day,
    categoryId,
    ...data
  }) => {
    mutate({
      ...data,
      ...getGoalAndCategory({ categoryId, goalId }),
      status: "PLANNED",
      plannedDate: date || new Date(),
      plannedDay: day ? parseInt(day) : undefined,
      amount: amountToDouble(amount),
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <NavBack />
      <div>
        <h1 className="text-xl font-bold">Add Cash Flow</h1>
        <p className="text-sm">Add your recurring/one-time income/expense</p>
      </div>
      <CashFlowTemplateForm
        onSubmit={onSubmit}
        loading={saveApiLoading}
        goalsMap={goalsMap}
      />
    </div>
  )
}
