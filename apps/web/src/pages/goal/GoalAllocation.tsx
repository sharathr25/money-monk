import { cn, formatAmount, getRandomColor } from "@workspace/ui/lib/utils"
import { BAR_CHART_RADIUS } from "@workspace/ui/constants/index"
import { Boxes } from "lucide-react"
import { Label } from "@workspace/ui/components/label"
import {
  Card,
  CardAction,
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart"
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"

const BAR_HEIGHT = 20

const Allocation = ({
  breakdown = [],
  amountPerCategory,
}: {
  breakdown: GoalBreakdown[]
  amountPerCategory: Record<string, number>
}) => {
  const breakdownEnhanced = breakdown.map((b, i) => {
    const estimatedAmount = b.amount
    const actualAmount = amountPerCategory[b.id] || 0
    const percentage = Math.round((actualAmount / estimatedAmount) * 100)
    return {
      ...b,
      estimatedAmount,
      actualAmount,
      percentage,
      fill: getRandomColor(i),
    }
  })

  const breakdownSortedByAmount = [...breakdownEnhanced]
    .filter((b) => Boolean(b.actualAmount))
    .sort((a, b) => b.actualAmount - a.actualAmount)

  const chartConfig = breakdownSortedByAmount.reduce(
    (acc, cur) => ({ ...acc, [cur.id]: { label: cur.category } }),
    {
      estimatedAmount: { label: "Estimated Amount: " },
      actualAmount: { label: "Actual Amount: " },
    }
  )

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 overflow-x-scroll">
        {breakdownEnhanced.map((b) => (
          <Breakdown key={b.id} color={b.fill} {...b} />
        ))}
      </div>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Actual Amount Comparison</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="w-full"
            style={{
              height: breakdownSortedByAmount.length * BAR_HEIGHT,
            }}
          >
            <BarChart
              accessibilityLayer
              data={breakdownSortedByAmount}
              layout="vertical"
              margin={{ right: 50, left: 100 }}
            >
              <ChartTooltip content={<ChartTooltipContent labelKey="id" />} />
              <YAxis dataKey="category" type="category" hide />
              <XAxis dataKey="estimatedAmount" type="number" hide />
              <Bar dataKey="actualAmount" radius={BAR_CHART_RADIUS}>
                <LabelList
                  dataKey="actualAmount"
                  position="right"
                  className="fill-foreground"
                  formatter={(v) =>
                    formatAmount(String(v), { withCurrency: true })
                  }
                />
                <LabelList
                  dataKey="category"
                  position="left"
                  className="fill-foreground"
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

const Breakdown = ({
  percentage,
  category,
  estimatedAmount,
  actualAmount,
  color,
}: GoalBreakdown & {
  estimatedAmount: number
  actualAmount: number
  percentage: number
  color: string
}) => {
  return (
    <Card className="min-w-40 flex-1 justify-between bg-(--accent)">
      <CardHeader>
        <CardTitle>{category}</CardTitle>
        <CardAction>
          <div className="size-4 rounded" style={{ backgroundColor: color }} />
        </CardAction>
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
              <span>{formatAmount(actualAmount, { withCurrency: true })}</span>
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

export function GoalAllocation({
  breakdown = [],
  transactionsApi,
}: {
  breakdown: GoalBreakdown[]
  transactionsApi: UseQueryResult<Transaction[], Error>
}) {
  const { data: transactions = [] } = transactionsApi

  const amountPerCategory = transactions.reduce(
    (acc: Record<string, number>, cur) => {
      const key: string = cur.category?.id || "OTHER"
      return { ...acc, [key]: (acc[key] || 0) + cur.amount }
    },
    {}
  )

  return (
    <div className="flex flex-col gap-1">
      <Label className="text-base font-bold">
        <Boxes className="size-5" />
        Allocation
      </Label>
      {breakdown?.length ? (
        <Allocation
          breakdown={breakdown}
          amountPerCategory={amountPerCategory}
        />
      ) : (
        <InlineEmpty title="No Allocation" />
      )}
    </div>
  )
}
