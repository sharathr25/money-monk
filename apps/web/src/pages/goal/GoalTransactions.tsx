import { FullScreenError } from "@/components/FullScreenError"
import { FullScreenLoader } from "@/components/FullScreenLoader"
import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import { Button } from "@workspace/ui/components/button"
import { BookText, MoveRight } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import { Label } from "@workspace/ui/components/label"
import { queryTransactions } from "@workspace/api/db/transactions"
import { TransactionItem } from "@/components/TransactionItem"
import { InlineEmpty } from "@/components/InlineEmpty"

export function GoalTransactions({ goalId }: { goalId: string }) {
  const { navigate } = useNavigator()
  const user = useAuth()
  const queryTransactionsForUser = queryTransactions(user.uid)

  const {
    isPending: getTransactionsPending,
    error: getTransactionsError,
    data: transactions = [],
  } = useQuery({
    queryKey: ["transactions-" + goalId],
    queryFn: async () => queryTransactionsForUser({ goalId, limit: 3 }),
  })

  const onViewAllClick = () => {
    navigate(
      ROUTE_NAMES.TRANSACTIONS,
      {},
      {
        state: { goalId },
      }
    )
  }

  const ListOrEmpty = () => {
    if (transactions.length)
      return transactions.map((t) => (
        <TransactionItem transaction={t} key={t.id} />
      ))

    return <InlineEmpty title="No Transactions" />
  }

  if (getTransactionsPending) return <FullScreenLoader />

  if (getTransactionsError)
    return <FullScreenError msg="Something went wrong" />

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <BookText className="size-5" />
        <Label className="flex items-center text-base font-bold">
          Transactions
        </Label>
        <Button variant="link" onClick={onViewAllClick} size="sm">
          View All
          <MoveRight />
        </Button>
      </div>
      <ListOrEmpty />
    </div>
  )
}
