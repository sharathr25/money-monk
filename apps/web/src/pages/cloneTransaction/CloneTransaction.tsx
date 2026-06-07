import { FullScreenError } from "@/components/FullScreenError"
import { NavBack } from "@/components/NavBack"
import {
  TransactionForm,
  type TransactionFormInputs,
} from "@/components/TransactionForm"
import { useAuth } from "@/hooks/useAuth"
import { useGoals } from "@/hooks/useGoals"
import { useNavigator } from "@/hooks/useNavigator"
import { useMutation } from "@tanstack/react-query"
import { saveTransaction } from "@workspace/api/db/transactions"
import type { Transaction } from "@workspace/core/types/transactions"
import { amountToDouble, formatAmount } from "@workspace/ui/lib/utils"
import type { SubmitHandler } from "react-hook-form"
import { useLocation } from "react-router"
import { toast } from "sonner"

export function CloneTransaction() {
  const { goBack } = useNavigator()
  const { state = {} } = useLocation()
  const { transaction }: { transaction: Transaction } = state
  const user = useAuth()
  const saveTransactionForUser = saveTransaction(user.uid)

  const { mutate, isPending: updateGoalPending } = useMutation({
    mutationFn: saveTransactionForUser,
    onSuccess: () => toast.success("Save successful.", { onAutoClose: goBack }),
    onError: () => toast.error("Save failed, Try again."),
  })

  const { goalsMap, getGoalAndCategory } = useGoals()

  if (!transaction) return <FullScreenError msg="Transaction not found" />

  const onSubmit: SubmitHandler<TransactionFormInputs> = async ({
    amount,
    date,
    goalId,
    categoryId,
    templateId,
    ...data
  }) => {
    const completedDate = date || new Date()
    mutate({
      ...data,
      ...getGoalAndCategory({ categoryId, goalId }),
      status: "COMPLETED",
      frequency: "ONE_TIME",
      completedDate,
      amount: amountToDouble(amount),
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <NavBack />
      <div>
        <h1 className="text-xl font-bold">Clone Transaction</h1>
        <p className="text-sm">Clone your transaction</p>
      </div>
      <TransactionForm
        formInputs={{
          ...transaction,
          goalId: transaction.goal?.id,
          categoryId: transaction.category?.id,
          date: transaction.completedDate || undefined,
          amount: formatAmount(transaction.amount),
        }}
        action="SAVE"
        goalsMap={goalsMap}
        onSubmit={onSubmit}
        loading={updateGoalPending}
      />
    </div>
  )
}
