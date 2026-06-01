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
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Binoculars,
  ChartColumn,
  Info,
  Lightbulb,
  TriangleAlert,
} from "lucide-react"
import { getCashFlowProjection } from "@workspace/api/db/cashFlow"
import type { CashFlowProjection } from "@workspace/core/types/cashFlow"
import { formatAmount, formatDuration } from "@workspace/ui/lib/utils"
import { FullScreenLoader } from "@/components/FullScreenLoader"
import { useAuth } from "@/hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import { Field } from "@workspace/ui/components/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { useForm } from "react-hook-form"
import { CashFlowProjectionItem } from "./CashFlowProjectionItem"

const MONTHS_STEP_SIZE = 3
const MONTHS_STEPS = 4

const MONTH_OPTIONS = Array.from({ length: MONTHS_STEPS }, (_, i) => {
  const months = (i + 1) * MONTHS_STEP_SIZE

  return {
    label: formatDuration(months),
    value: `${months}`,
  }
})

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

  if (loading) return <FullScreenLoader />

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <div className="basis-2/3">
          <h1 className="text-xl font-bold">Insights</h1>
          <p className="text-sm">Your financial insights, at a glance.</p>
        </div>
        <Field className="basis-1/3">
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
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="flex items-center gap-1 font-extrabold">
          <ChartColumn className="size-5" />
          Balance Trend
        </h1>
        <Card>
          <CardContent>
            <ChartContainer
              config={{ closingBalance: { label: "Balance: " } }}
              className="min-h-[200px] w-full"
            >
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
        <h1 className="flex items-center gap-1 font-extrabold">
          <Info className="size-5" />
          Liquidity Insights
        </h1>
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
        <h1 className="flex items-center gap-1 font-extrabold">
          <Binoculars className="size-5" />
          Projected Months
        </h1>
        <div className="flex flex-col gap-3">
          {cashFlowProjections.map((cp) => (
            <CashFlowProjectionItem cashFlowProjection={cp} key={cp.month} />
          ))}
        </div>
      </div>
    </div>
  )
}
