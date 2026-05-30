import { cn, formatAmount } from "@workspace/ui/lib/utils"
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
import { Progress } from "@workspace/ui/components/progress"
import { Field, FieldLabel } from "@workspace/ui/components/field"

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

  const Breakdown = ({ breakdown }: { breakdown: GoalBreakdown }) => {
    const estimatedAmount = breakdown.amount
    const actualAmount = amountPerCategory[breakdown.category] || 0
    const percentage = Math.round((actualAmount / estimatedAmount) * 100)

    return (
      <Card
        className="min-w-40 flex-1 justify-between bg-(--accent)"
        key={breakdown.id}
      >
        <CardHeader>
          <CardTitle>{breakdown.category}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardTitle>Estimated</CardTitle>
          <CardDescription>
            {formatAmount(estimatedAmount, { withCurrency: true })}
          </CardDescription>
          <CardTitle>Actual</CardTitle>
          <CardDescription>
            <Field className="w-full max-w-sm">
              <FieldLabel>
                <span>
                  {formatAmount(actualAmount, { withCurrency: true })}
                </span>
                <span
                  className={cn(
                    "ml-auto",
                    percentage > 100 && "text-destructive"
                  )}
                >
                  {percentage}%
                </span>
              </FieldLabel>
              <Progress value={percentage} />
            </Field>
          </CardDescription>
        </CardContent>
      </Card>
    )
  }

  const ListOrEmpty = () => {
    if (!breakdown?.length) return <InlineEmpty title="No Allocation" />

    return (
      <div className="flex gap-2 overflow-x-scroll">
        {breakdown.map((b) => (
          <Breakdown breakdown={b} />
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
