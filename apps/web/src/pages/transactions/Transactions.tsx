import { FullScreenError } from "@/components/FullScreenError"
import { FullScreenLoader } from "@/components/FullScreenLoader"
import { useAuth } from "@/hooks/useAuth"
import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import { useQuery } from "@tanstack/react-query"
import { queryTransactions } from "@workspace/api/db/transactions"
import type { Transaction } from "@workspace/core/types/transactions"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@workspace/ui/components/item"
import { formatAmount, formatDate } from "@workspace/ui/lib/utils"
import { CirclePlus, FolderCode, Plus } from "lucide-react"
import { DynamicIcon, type IconName } from "lucide-react/dynamic"

export function Transactions() {
  const user = useAuth()
  const qqueryTransactionsForUser = queryTransactions(user.uid)
  const {
    isPending,
    error,
    data: transactions,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: qqueryTransactionsForUser,
  })

  const { navigate } = useNavigator()

  if (isPending) return <FullScreenLoader />

  if (error) return <FullScreenError msg="Failed to get goals" />

  const renderCard = (t: Transaction) => (
    <Item
      variant="outline"
      key={t.id}
      onClick={() => navigate(ROUTE_NAMES.TRANSACTION, { transactionId: t.id })}
    >
      <ItemMedia variant="image" className="bg-(--secondary)">
        <DynamicIcon
          name={t.icon as IconName}
          className="size-8"
          strokeWidth={1.5}
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="line-clamp-1 flex capitalize">{t.name}</ItemTitle>
        <ItemDescription>
          {t.goal ? `For ${t.goal.name}` : t.description}
        </ItemDescription>
      </ItemContent>
      <ItemContent className="flex items-end">
        <ItemTitle className="line-clamp-1 flex">
          <Badge variant="secondary" className="capitalize">
            {t.type.toLowerCase()}
          </Badge>
          {formatAmount(t.amount, { withCurrency: true })}
        </ItemTitle>
        <ItemDescription className="text-xs">
          {formatDate(t.updatedAt)}
        </ItemDescription>
      </ItemContent>
    </Item>
  )

  const NoGoals = () => (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderCode />
        </EmptyMedia>
        <EmptyTitle className="capitalize">No Transactions Yet</EmptyTitle>
        <EmptyDescription>
          Start by clicking on <CirclePlus className="inline size-5" /> to add
          your first transaction
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-extrabold">Transactions</h1>
        <p>Your financial transactions.</p>
      </div>
      <div className="flex flex-col gap-4">
        {transactions.length ? transactions.map(renderCard) : <NoGoals />}
      </div>
      <Button
        className="fixed right-6 bottom-20 h-12 w-12 rounded-full"
        onClick={() => navigate(ROUTE_NAMES.ADD_TRANSACTION)}
      >
        <Plus />
      </Button>
    </div>
  )
}
