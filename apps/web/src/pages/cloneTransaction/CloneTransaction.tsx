import { FullScreenError } from "@/components/FullScreenError"
import { NavBack } from "@/components/NavBack"
import {
  TransactionForm,
  type TransactionFormInputs,
} from "@/components/TransactionForm"
import { useAuth } from "@/hooks/useAuth"
import { useNavigator } from "@/hooks/useNavigator"
import { useMutation, useQuery } from "@tanstack/react-query"
import { queryGoals } from "@workspace/api/db/goals"
import { saveTransaction } from "@workspace/api/db/transactions"
import type { Goal } from "@workspace/core/types/goals"
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
  const queryGoalsForUser = queryGoals(user.uid).bind(null, {
    status: "STARTED_SAVING,ACTIVE",
  })
  const saveTransactionForUser = saveTransaction(user.uid)

  const { data: goals } = useQuery({
    queryKey: ["goals"],
    queryFn: queryGoalsForUser,
  })

  const { mutate, isPending: updateGoalPending } = useMutation({
    mutationFn: saveTransactionForUser,
    onSuccess: () => toast.success("Save successful.", { onAutoClose: goBack }),
    onError: () => toast.error("Save failed, Try again."),
  })

  const goalsMap: Record<string, Goal> = goals
    ? goals.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {})
    : {}

  if (!transaction) return <FullScreenError msg="Transaction not found" />

  const onSubmit: SubmitHandler<TransactionFormInputs> = async ({
    amount,
    date,
    goalId,
    categoryId,
    ...data
  }) => {
    mutate({
      ...data,
      goal: goalId ? goalsMap[goalId] : undefined,
      category:
        (categoryId &&
          goalId &&
          goalsMap[goalId].breakdown
            .filter((b) => b.id === categoryId)
            .map((b) => ({ id: b.id, name: b.category }))[0]) ||
        undefined,
      date: date || new Date(),
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
          amount: formatAmount(transaction.amount),
        }}
        goalsMap={goalsMap}
        onSubmit={onSubmit}
        loading={updateGoalPending}
      />
    </div>
  )
}
