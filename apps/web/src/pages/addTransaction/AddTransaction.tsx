import { type SubmitHandler } from "react-hook-form"
import { toast } from "sonner"
import { amountToDouble } from "@workspace/ui/lib/utils"
import { useNavigator } from "@/hooks/useNavigator"
import { NavBack } from "@/components/NavBack"
import { useAuth } from "@/hooks/useAuth"
import { useMutation } from "@tanstack/react-query"
import {
  TransactionForm,
  type TransactionFormInputs,
} from "@/components/TransactionForm"
import { saveTransaction } from "@workspace/api/db/transactions"
import { useGoals } from "@/hooks/useGoals"

export function AddTransaction() {
  const user = useAuth()
  const saveTransactionForUser = saveTransaction(user.uid)

  const { goBack } = useNavigator()

  const { mutate, isPending: isUpdatingTransaction } = useMutation({
    mutationFn: saveTransactionForUser,
    onSuccess: () => toast.success("Save successful.", { onAutoClose: goBack }),
    onError: () => toast.error("Save failed, Try again."),
  })

  const { goalsMap, getGoalAndCategory } = useGoals()

  const onSubmit: SubmitHandler<TransactionFormInputs> = async ({
    amount,
    date,
    goalId,
    categoryId,
    ...data
  }) => {
    mutate({
      ...data,
      ...getGoalAndCategory({ categoryId, goalId }),
      status: "COMPLETED",
      frequency: "ONE_TIME",
      completedDate: date || new Date(),
      amount: amountToDouble(amount),
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <NavBack />
      <div>
        <h1 className="text-xl font-bold">Add Transaction</h1>
        <p className="text-sm">Add your transaction for goal or template</p>
      </div>
      <TransactionForm
        action="SAVE"
        onSubmit={onSubmit}
        goalsMap={goalsMap}
        loading={isUpdatingTransaction}
      />
    </div>
  )
}
