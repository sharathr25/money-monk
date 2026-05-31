import { ChartContainer } from "@workspace/ui/components/chart"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

export function IncomeVsExpensesBarChart({
  expenses,
  income,
  month,
  height = 25,
}: {
  expenses: number
  income: number
  month: string
  height?: number
}) {
  const sum = expenses + income
  const data = [
    {
      expenses: (expenses / sum) * 100,
      income: (income / sum) * 100,
      total: 100,
      month,
    },
  ]

  return (
    <ChartContainer config={{}} className={`h-[${height}px] w-full`}>
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <XAxis dataKey="total" type="number" hide />
        <YAxis dataKey="month" type="category" hide />
        <Bar dataKey="income" stackId="a" fill="var(--success)" radius={4} />
        <Bar
          dataKey="expenses"
          stackId="a"
          fill="var(--destructive)"
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  )
}
