import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import type { Transaction } from "@workspace/core/types/transactions"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Card } from "@workspace/ui/components/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@workspace/ui/components/item"
import { formatAmount, formatDate } from "@workspace/ui/lib/utils"
import { DynamicIcon, type IconName } from "lucide-react/dynamic"

export function TransactionItem({ transaction }: { transaction: Transaction }) {
  const { navigate } = useNavigator()

  const amount = formatAmount(
    transaction.type === "EXPENSE" ? -1 : 1 * transaction.amount,
    {
      withCurrency: true,
      withSign: transaction.type === "EXPENSE" || transaction.type === "INCOME",
    }
  )

  const onClick = () => {
    navigate(ROUTE_NAMES.TRANSACTION, { transactionId: transaction.id })
  }

  return (
    <Card className="p-0" key={transaction.id}>
      <Item onClick={onClick}>
        <ItemMedia>
          <Avatar
            size="lg"
            className="bg-(--secondary) after:border-transparent"
          >
            <AvatarFallback>
              <DynamicIcon name={transaction.icon as IconName} />
            </AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1 flex capitalize">
            {transaction.name}
            {transaction.goal?.name && `- For ${transaction.goal?.name}`}
          </ItemTitle>
          <ItemDescription className="flex gap-1">
            {transaction.category?.name && (
              <Badge variant="outline">{transaction.category.name}</Badge>
            )}
            {transaction.paidTo && (
              <Badge variant="outline">{transaction.paidTo}</Badge>
            )}
          </ItemDescription>
        </ItemContent>
        <ItemContent className="flex items-end">
          <ItemTitle className="line-clamp-1 flex">{amount}</ItemTitle>
          <ItemDescription className="text-xs">
            {formatDate(transaction.updatedAt)}
          </ItemDescription>
        </ItemContent>
      </Item>
    </Card>
  )
}
