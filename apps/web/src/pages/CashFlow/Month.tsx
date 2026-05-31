import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Scale } from "lucide-react"
import dayjs from "dayjs"
import { IncomeVsExpensesBarChart } from "@/components/IncomeVsExpensesBarChart"

export function Month(props: { expenses: number; income: number }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Income Vs Expenses</CardTitle>
        <CardAction>
          <Scale />
        </CardAction>
      </CardHeader>
      <CardContent className="mt-auto text-xl">
        <IncomeVsExpensesBarChart {...props} month={dayjs().format("MMM")} />
      </CardContent>
    </Card>
  )
}
