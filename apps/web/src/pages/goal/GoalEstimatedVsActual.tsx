import { cn, formatAmount } from "@workspace/ui/lib/utils"
import { Banknote, Percent, Scale } from "lucide-react"
import { Label } from "@workspace/ui/components/label"
import type { Goal } from "@workspace/core/types/goals"
import type { UseQueryResult } from "@tanstack/react-query"
import type { Transaction } from "@workspace/core/types/transactions"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@workspace/ui/components/item"
import { Progress } from "@workspace/ui/components/progress"

export function GoalEstimatedVsActual({
  goal,
  transactionsApi,
}: {
  goal: Goal
  transactionsApi: UseQueryResult<Transaction[], Error>
}) {
  const { data: transactions = [] } = transactionsApi

  const estimatedAmount = goal.estimatedAmount
  const actualAmount = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((total, t) => total + t.amount, 0)
  const percentage = Math.round((actualAmount / estimatedAmount) * 100)

  const itemContainerClass = "basis-1/2 py-1 odd:pr-1 even:pl-1"
  const itemClass = "bg-(--accent) p-3"

  return (
    <div className="flex flex-col gap-1">
      <Label className="text-base font-bold">
        <Scale className="size-5" />
        Estimated Vs Actual
      </Label>
      <div className="flex">
        <div className={itemContainerClass}>
          <Item className={itemClass}>
            <ItemMedia variant="icon">
              <Banknote />
            </ItemMedia>
            <ItemContent>
              <ItemDescription>Estimated</ItemDescription>
              <ItemTitle>
                {formatAmount(estimatedAmount, { withCurrency: true })}
              </ItemTitle>
            </ItemContent>
          </Item>
        </div>
        <div className={itemContainerClass}>
          <Item className={itemClass}>
            <ItemMedia variant="icon">
              <Banknote />
            </ItemMedia>
            <ItemContent>
              <ItemDescription>Actual</ItemDescription>
              <ItemTitle>
                {formatAmount(actualAmount, { withCurrency: true })}
              </ItemTitle>
            </ItemContent>
          </Item>
        </div>
      </div>
      <div className={itemContainerClass}>
        <Item className={itemClass}>
          <ItemMedia variant="icon">
            <Percent />
          </ItemMedia>
          <ItemContent>
            <ItemDescription>
              Actual Amount is
              <span
                className={cn(
                  "font-extrabold",
                  percentage > 100 && "text-destructive"
                )}
              >
                {" "}
                {percentage}%
              </span>{" "}
              of Estimated Amount
            </ItemDescription>
            <Progress value={percentage} />
          </ItemContent>
        </Item>
      </div>
    </div>
  )
}
