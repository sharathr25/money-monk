import { FullScreenError } from "@/components/FullScreenError"
import { FullScreenLoader } from "@/components/FullScreenLoader"
import { NavBack } from "@/components/NavBack"
import {
  TransactionForm,
  type TransactionFormInputs,
} from "@/components/TransactionForm"
import { useAuth } from "@/hooks/useAuth"
import { useNavigator } from "@/hooks/useNavigator"
import { useMutation, useQuery } from "@tanstack/react-query"
import { queryGoals } from "@workspace/api/db/goals"
import {
  getTransaction,
  updateTransaction,
} from "@workspace/api/db/transactions"
import { Button } from "@workspace/ui/components/button"
import { amountToDouble } from "@workspace/ui/lib/utils"
import { MoveLeft, RefreshCcw } from "lucide-react"
import type { SubmitHandler } from "react-hook-form"
import { useParams } from "react-router"
import { toast } from "sonner"

export function EditTransaction() {
  const { transactionId = "" } = useParams()
  const { goBack } = useNavigator()
  const user = useAuth()
  const queryGoalsForUser = queryGoals(user.uid)
  const getTransactionForUser = getTransaction(user.uid)
  const updateTransactionForUser = updateTransaction(user.uid).bind(
    null,
    transactionId
  )

  const { data: goals } = useQuery({
    queryKey: ["goals"],
    queryFn: queryGoalsForUser,
  })
  const {
    isPending: getTransactionPending,
    error: getTransactionError,
    data: goal,
    refetch,
  } = useQuery({
    queryKey: ["transaction-edit-" + transactionId],
    queryFn: async () => getTransactionForUser(transactionId),
  })

  const {
    mutate,
    isPending: updateGoalPending,
    error,
  } = useMutation({
    mutationFn: updateTransactionForUser,
    onSuccess: () =>
      toast.success("Update successful.", { onAutoClose: goBack }),
    onError: () => toast.error("Update failed, Try again."),
  })

  console.log(error)

  if (getTransactionPending) return <FullScreenLoader />

  if (getTransactionError) return <FullScreenError msg="Something went wrong" />

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

  const onSubmit: SubmitHandler<TransactionFormInputs> = async ({
    iconNameFilter,
    amount,
    ...data
  }) => {
    mutate({
      ...data,
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
          ...goal,
          amount: `${goal.amount}`,
        }}
        goals={goals || []}
        onSubmit={onSubmit}
        loading={updateGoalPending}
      />
    </div>
  )
}
