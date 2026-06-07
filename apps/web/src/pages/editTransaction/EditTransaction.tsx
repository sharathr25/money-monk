import { FullScreenError } from "@/components/FullScreenError"
import { FullScreenLoader } from "@/components/FullScreenLoader"
import { NavBack } from "@/components/NavBack"
import {
  TransactionForm,
  type TransactionFormInputs,
} from "@/components/TransactionForm"
import { useAuth } from "@/hooks/useAuth"
import { useGoals } from "@/hooks/useGoals"
import { useNavigator } from "@/hooks/useNavigator"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
  getTransaction,
  updateTransaction,
} from "@workspace/api/db/transactions"
import { Button } from "@workspace/ui/components/button"
import { amountToDouble, formatAmount } from "@workspace/ui/lib/utils"
import { MoveLeft, RefreshCcw } from "lucide-react"
import type { SubmitHandler } from "react-hook-form"
import { useParams } from "react-router"
import { toast } from "sonner"

export function EditTransaction() {
  const { transactionId = "" } = useParams()
  const { goBack } = useNavigator()
  const user = useAuth()
  const getTransactionForUser = getTransaction(user.uid)
  const updateTransactionForUser = updateTransaction(user.uid).bind(
    null,
    transactionId
  )

  const {
    isPending: getTransactionPending,
    error: getTransactionError,
    data: transaction,
    refetch,
  } = useQuery({
    queryKey: ["transaction-edit-" + transactionId],
    queryFn: async () => getTransactionForUser(transactionId),
  })

  const { mutate, isPending: updateGoalPending } = useMutation({
    mutationFn: updateTransactionForUser,
    onSuccess: () =>
      toast.success("Update successful.", { onAutoClose: goBack }),
    onError: () => toast.error("Update failed, Try again."),
  })

  const { goalsMap, getGoalAndCategory } = useGoals()

  if (getTransactionPending) return <FullScreenLoader />

  if (getTransactionError) return <FullScreenError msg="Something went wrong" />

  if (!transaction)
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

  const onSubmit: SubmitHandler<TransactionFormInputs> = async ({
    amount,
    date,
    goalId,
    categoryId,
    templateId,
    ...data
  }) => {
    mutate({
      ...data,
      ...getGoalAndCategory({ goalId, categoryId }),
      frequency: "ONE_TIME",
      status: "COMPLETED",
      completedDate: date || new Date(),
      amount: amountToDouble(amount),
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <NavBack />
      <div>
        <h1 className="text-xl font-bold">Edit Transaction</h1>
        <p className="text-sm">Edit your transaction</p>
      </div>
      <TransactionForm
        formInputs={{
          ...transaction,
          categoryId: transaction.category?.id,
          goalId: transaction.goal?.id,
          date: transaction.completedDate || undefined,
          amount: formatAmount(transaction.amount),
        }}
        action="UPDATE"
        goalsMap={goalsMap}
        onSubmit={onSubmit}
        loading={updateGoalPending}
      />
    </div>
  )
}
