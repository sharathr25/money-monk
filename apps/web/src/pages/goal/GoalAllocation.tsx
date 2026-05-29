import { formatAmount } from "@workspace/ui/lib/utils"
import { ChartPie } from "lucide-react"
import { Label } from "@workspace/ui/components/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import type { GoalBreakdown } from "@workspace/core/types/goals"
import { InlineEmpty } from "@/components/InlineEmpty"
import type { UseQueryResult } from "@tanstack/react-query"
import type { Transaction } from "@workspace/core/types/transactions"

export function GoalAllocation({
  breakdown,
  transactionsApi,
}: {
  breakdown: GoalBreakdown[]
  transactionsApi: UseQueryResult<Transaction[], Error>
}) {
  const { data: transactions = [] } = transactionsApi

  const amountPerCategory = transactions.reduce(
    (acc: Record<string, number>, cur) => {
      const key: string = cur.category?.name || "Other"
      return { ...acc, [key]: (acc[key] || 0) + cur.amount }
    },
    {}
  )

  const ListOrEmpty = () => {
    if (!breakdown?.length) return <InlineEmpty title="No Allocation" />

    return (
      <div className="flex gap-2 overflow-x-scroll">
        {breakdown.map((b) => (
          <Card
            className="min-w-35 flex-1 justify-between bg-(--accent)"
            key={b.id}
          >
            <CardHeader>
              <CardTitle>{b.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardTitle>Estimated</CardTitle>
              <CardDescription>
                {formatAmount(b.amount, { withCurrency: true })}
              </CardDescription>
              <CardTitle>Actual</CardTitle>
              <CardDescription>
                {formatAmount(amountPerCategory[b.category] || 0, {
                  withCurrency: true,
                })}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <Label className="text-base font-bold">
        <ChartPie className="size-5" />
        Allocation
      </Label>
      <ListOrEmpty />
    </div>
  )
}
