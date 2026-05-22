import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert"
import { Bar, BarChart, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Lightbulb, TriangleAlert } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import React from "react"
import { getCashFlowProjection } from "@workspace/api/db/cashFlow"
import type { CashFlowProjection } from "@workspace/core/types/cashFlow"
import { cn, formatAmount } from "@workspace/ui/lib/utils"
import dayjs from "dayjs"
import { ItemDescription, ItemTitle } from "@workspace/ui/components/item"
import { FullScreenLoader } from "@/components/FullScreenLoader"
import { useAuth } from "@/hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { useForm } from "react-hook-form"

const MONTH_OPTIONS = [3, 6, 9, 12].map((m) => ({
  label: `${m} Months`,
  value: `${m}`,
}))

export function CashFlowProjection() {
  const user = useAuth()
  const { setValue, watch } = useForm<{
    months: string
  }>({
    defaultValues: { months: "6" },
  })
  const months = watch("months")

  const { data: cashFlowProjections = [], isPending: loading } = useQuery({
    queryKey: ["projections", months],
    queryFn: getCashFlowProjection(user.uid).bind(null, parseInt(months)),
  })

  const shortFallProjection = cashFlowProjections.find(
    (cp) => cp.closingBalance < 0
  )
  const surplusProjection = cashFlowProjections.find(
    (cp) => cp.closingBalance > 250000
  )

  const renderItem = (
    title: string,
    description: string | React.ReactElement
  ) => (
    <div className="flex justify-between">
      <ItemDescription>{title}</ItemDescription>
      <ItemTitle>{description}</ItemTitle>
    </div>
  )

  if (loading) return <FullScreenLoader />

  return (
    <div className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="months">Insights For</FieldLabel>
        <Select value={months} onValueChange={(v) => setValue("months", v)}>
          <SelectTrigger id="months" className="!h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MONTH_OPTIONS.map((m) => (
              <SelectItem value={m.value} key={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <div className="flex flex-col gap-2">
        <h1 className="font-extrabold">
          {months}-Months Closing Balance Trend
        </h1>
        <Card>
          <CardContent>
            <ChartContainer config={{}} className="min-h-[200px] w-full">
              <BarChart accessibilityLayer data={cashFlowProjections}>
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="closingBalance"
                  fill="var(--primary)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="font-extrabold">Liquidity Insights</h1>
        <div className="flex flex-col gap-3">
          {shortFallProjection && (
            <Alert variant="destructive" className="bg-(--destructive)/10">
              <TriangleAlert />
              <AlertTitle>
                {shortFallProjection.month} Shortfall Risk
              </AlertTitle>
              <AlertDescription>
                Projected expenses exceed liquidity by{" "}
                {formatAmount(shortFallProjection.closingBalance, {
                  withCurrency: true,
                })}
              </AlertDescription>
            </Alert>
          )}
          {surplusProjection && (
            <Alert variant="default" className="bg-(--primary)/10">
              <Lightbulb />
              <AlertTitle>Investement Opportunity</AlertTitle>
              <AlertDescription>
                Surplus{" "}
                {formatAmount(surplusProjection.closingBalance, {
                  withCurrency: true,
                })}{" "}
                in {surplusProjection.month} can be moved to a high-yield vault
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="font-extrabold">Projected Months</h1>
        <div className="flex flex-col gap-3">
          {cashFlowProjections.map((cp) => (
            <Card
              key={cp.month}
              className={cn(
                cp.closingBalance < 0 && "border-2 border-(--destructive)"
              )}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <h1 className="text-lg font-bold capitalize">
                    {cp.month} {cp.year}
                  </h1>
                  <div className="flex gap-1">
                    {dayjs().format("MMMM") === cp.month && (
                      <Badge variant="secondary">In Progress</Badge>
                    )}
                    {cp.closingBalance < 0 && (
                      <Badge variant="destructive">Shorfall Risk</Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex flex-col">
                  {renderItem(
                    "Opening Balance",
                    formatAmount(cp.openingBalance, {
                      withCurrency: true,
                    })
                  )}
                  {renderItem(
                    "Closing Balance",
                    formatAmount(cp.closingBalance, {
                      withCurrency: true,
                    })
                  )}
                  {renderItem(
                    "Income",
                    <span className="text-(--success)">
                      {formatAmount(cp.totalIncome, {
                        withCurrency: true,
                        withSign: true,
                      })}
                    </span>
                  )}
                  {renderItem(
                    "Expenses",
                    <span className="text-(--destructive)">
                      {formatAmount(-1 * cp.totalExpenses, {
                        withCurrency: true,
                        withSign: true,
                      })}
                    </span>
                  )}
                  {renderItem(
                    "Net Cash",
                    formatAmount(cp.netCashFlow, {
                      withCurrency: true,
                      withSign: true,
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
