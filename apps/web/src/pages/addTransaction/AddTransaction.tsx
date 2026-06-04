import { type SubmitHandler } from "react-hook-form"
import { toast } from "sonner"
import { amountToDouble } from "@workspace/ui/lib/utils"
import { useNavigator } from "@/hooks/useNavigator"
import { NavBack } from "@/components/NavBack"
import { useAuth } from "@/hooks/useAuth"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
  TransactionForm,
  type TransactionFormInputs,
} from "@/components/TransactionForm"
import { saveTransaction } from "@workspace/api/db/transactions"
import { queryGoals } from "@workspace/api/db/goals"
import type { Goal } from "@workspace/core/types/goals"

export function AddTransaction() {
  const user = useAuth()
  const queryGoalsForUser = queryGoals(user.uid).bind(null, {
    status: "STARTED_SAVING,ACTIVE",
  })
  const saveTransactionForUser = saveTransaction(user.uid)

  const { goBack } = useNavigator()

  const { data: goals } = useQuery({
    queryKey: ["goals"],
    queryFn: queryGoalsForUser,
  })

  const { mutate, isPending: isUpdatingTransaction } = useMutation({
    mutationFn: saveTransactionForUser,
    onSuccess: () => toast.success("Save successful.", { onAutoClose: goBack }),
    onError: () => toast.error("Save failed, Try again."),
  })

  const goalsMap: Record<string, Goal> = goals
    ? goals.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {})
    : {}

  const onSubmit: SubmitHandler<TransactionFormInputs> = async ({
    amount,
    date,
    goalId,
    categoryId,
    ...data
  }) => {
    mutate({
      ...data,
      date: date || new Date(),
      goal: goalId ? goalsMap[goalId] : undefined,
      category:
        (categoryId &&
          goalId &&
          goalsMap[goalId].breakdown
            .filter((b) => b.id === categoryId)
            .map((b) => ({ id: b.id, name: b.category }))[0]) ||
        undefined,
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
