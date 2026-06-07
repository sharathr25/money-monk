import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import { Button } from "@workspace/ui/components/button"
import { BookText, MoveRight } from "lucide-react"
import { type UseQueryResult } from "@tanstack/react-query"
import { Label } from "@workspace/ui/components/label"
import { TransactionItem } from "@/components/TransactionItem"
import { InlineEmpty } from "@/components/InlineEmpty"
import type { Transaction } from "@workspace/core/types/transactions"
import { InlineLoader } from "@/components/InlineLoader"
import { InlineError } from "@/components/InlineError"

export function GoalTransactions({
  goalId,
  transactionsApi,
}: {
  goalId: string
  transactionsApi: UseQueryResult<Transaction[], Error>
}) {
  const { navigate } = useNavigator()

  const {
    isPending: getTransactionsPending,
    error: getTransactionsError,
    data: transactions = [],
  } = transactionsApi

  const onViewAllClick = () => {
    navigate(
      ROUTE_NAMES.TRANSACTIONS,
      {},
      {
        state: { goalId },
      }
    )
  }

  const recentTransactions = [...transactions].reverse().slice(0, 3)

  const ListOrEmpty = () => {
    if (getTransactionsPending) return <InlineLoader />

    if (getTransactionsError) return <InlineError />

    if (recentTransactions.length)
      return (
        <div className="flex flex-col gap-2">
          {recentTransactions.slice(0, 3).map((t) => (
            <TransactionItem transaction={t} key={t.id} />
          ))}
        </div>
      )

    return <InlineEmpty title="No Transactions" />
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <BookText className="size-5" />
        <Label className="flex items-center text-base font-bold">
          Recent Transactions
        </Label>
        {!!recentTransactions.length && (
          <Button variant="link" onClick={onViewAllClick} size="sm">
            View All
            <MoveRight />
          </Button>
        )}
      </div>
      <ListOrEmpty />
    </div>
  )
}
