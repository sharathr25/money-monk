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

export function AddTransaction() {
  const user = useAuth()
  const queryGoalsForUser = queryGoals(user.uid)
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
        <h1 className="text-xl font-bold">Add Transaction</h1>
        <p className="text-sm">Add your transaction for goal or template</p>
      </div>
      <TransactionForm
        onSubmit={onSubmit}
        goals={goals || []}
        loading={isUpdatingTransaction}
      />
    </div>
  )
}
