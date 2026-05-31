import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import React from "react"
import type { CashFlowProjection } from "@workspace/core/types/cashFlow"
import { cn, formatAmount } from "@workspace/ui/lib/utils"
import dayjs from "dayjs"
import { ItemDescription, ItemTitle } from "@workspace/ui/components/item"
import { IncomeVsExpensesBarChart } from "@/components/IncomeVsExpensesBarChart"

export function CashFlowProjectionItem({
  cashFlowProjection,
}: {
  cashFlowProjection: CashFlowProjection
}) {
  const renderItem = (
    title: string,
    description: string | React.ReactElement
  ) => (
    <div className="flex items-center justify-between">
      <ItemDescription className="flex-1">{title}</ItemDescription>
      <ItemTitle className="flex-1 justify-end">{description}</ItemTitle>
    </div>
  )

  return (
    <Card
      key={cashFlowProjection.month}
      className={cn(
        cashFlowProjection.closingBalance < 0 &&
          "border-2 border-(--destructive)"
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h1 className="text-lg font-bold capitalize">
            {cashFlowProjection.month} {cashFlowProjection.year}
          </h1>
          <div className="flex gap-1">
            {dayjs().format("MMMM") === cashFlowProjection.month && (
              <Badge variant="secondary">In Progress</Badge>
            )}
            {cashFlowProjection.closingBalance < 0 && (
              <Badge variant="destructive">Shorfall Risk</Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        {renderItem(
          "Opening Balance",
          formatAmount(cashFlowProjection.openingBalance, {
            withCurrency: true,
          })
        )}
        {renderItem(
          "Closing Balance",
          formatAmount(cashFlowProjection.closingBalance, {
            withCurrency: true,
          })
        )}
        {renderItem(
          "Income",
          <span className="text-(--success)">
            {formatAmount(cashFlowProjection.totalIncome, {
              withCurrency: true,
              withSign: true,
            })}
          </span>
        )}
        {renderItem(
          "Expenses",
          <span className="text-(--destructive)">
            {formatAmount(-1 * cashFlowProjection.totalExpenses, {
              withCurrency: true,
              withSign: true,
            })}
          </span>
        )}
        {renderItem(
          "Net Cash",
          formatAmount(cashFlowProjection.netCashFlow, {
            withCurrency: true,
            withSign: true,
          })
        )}
        {renderItem(
          "Income Vs Expenses",
          <IncomeVsExpensesBarChart
            expenses={cashFlowProjection.totalExpenses}
            income={cashFlowProjection.totalIncome}
            month={cashFlowProjection.month}
            size="s"
          />
        )}
      </CardContent>
    </Card>
  )
}
