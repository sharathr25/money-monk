import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import type { Transaction } from "@workspace/core/types/transactions"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Card } from "@workspace/ui/components/card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@workspace/ui/components/item"
import { formatAmount, formatDate } from "@workspace/ui/lib/utils"
import { Boxes, MoveUpRight, Target } from "lucide-react"
import { DynamicIcon, type IconName } from "lucide-react/dynamic"

export function TransactionItem({ transaction }: { transaction: Transaction }) {
  const { navigate } = useNavigator()

  const amount = formatAmount(
    (transaction.type === "EXPENSE" ? -1 : 1) * transaction.amount,
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
          <ItemTitle className="line-clamp-1 flex font-bold capitalize">
            {transaction.name}
          </ItemTitle>
          <ItemDescription className="text-xs">
            {transaction.description}
          </ItemDescription>
        </ItemContent>
        <ItemActions className="mb-auto flex flex-col items-end">
          <ItemTitle className="line-clamp-1 flex">{amount}</ItemTitle>
          <ItemDescription className="text-xs">
            {formatDate(transaction.date)}
          </ItemDescription>
        </ItemActions>
        <ItemFooter className="justify-start">
          {transaction.goal?.name && (
            <Badge variant="outline">
              <Target />
              {transaction.goal?.name}
            </Badge>
          )}
          {transaction.category?.name && (
            <Badge variant="outline">
              <Boxes />
              {transaction.category.name}
            </Badge>
          )}
          {transaction.paidTo && (
            <Badge variant="outline">
              <MoveUpRight />
              {transaction.paidTo}
            </Badge>
          )}
        </ItemFooter>
      </Item>
    </Card>
  )
}
