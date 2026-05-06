import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
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
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@workspace/ui/components/item"
import { Lightbulb, TriangleAlert } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"

export function CashFlowProjection() {
  const chartData = [
    { month: "January", balance: 186 },
    { month: "February", balance: 305 },
    { month: "March", balance: 237 },
    { month: "April", balance: 73 },
    { month: "May", balance: 209 },
    { month: "June", balance: 214 },
  ]

  const chartConfig = {
    balance: {
      label: "Balance",
      color: "#2D3A4B",
    },
  } satisfies ChartConfig

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="font-extrabold">6-Month Balance Trend</h1>
        <Card>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[200px] w-full"
            >
              <BarChart accessibilityLayer data={chartData}>
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="balance" fill="var(--primary)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="font-extrabold">Liquidity Insights</h1>
        <div className="flex flex-col gap-3">
          <Alert variant="destructive" className="bg-(--destructive)/10">
            <TriangleAlert />
            <AlertTitle>January Shortfall Risk</AlertTitle>
            <AlertDescription>
              Projected expenses exceed liquidity by 1,500
            </AlertDescription>
          </Alert>
          <Alert variant="default" className="bg-(--primary)/10">
            <Lightbulb />
            <AlertTitle>Investement Opportunity</AlertTitle>
            <AlertDescription>
              Surplus in November can be moved to a high-yield vault
            </AlertDescription>
          </Alert>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="font-extrabold">Projected Months</h1>
        <div className="flex flex-col gap-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <h1 className="text-lg font-bold capitalize">October</h1>
                <Badge variant="secondary">In Progress</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-start">
                  <div>OPENING</div>
                  <div className="text-bold">₹ 12,54,000</div>
                </div>
                <div className="flex flex-col items-start">
                  <div>INFLOW</div>
                  <div className="text-bold">+₹ 12,540</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-start">
                  <div>OUTFLOW</div>
                  <div className="text-bold text-(--destructive)">-₹ 1,254</div>
                </div>
                <div className="flex flex-col items-start">
                  <div>NET CASH</div>
                  <div className="text-bold">+₹ 2,000</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-(--destructive)">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <h1 className="text-lg font-bold capitalize">December</h1>
                <Badge variant="destructive">Shorfall Risk</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-start">
                  <div>OPENING</div>
                  <div className="text-bold">₹ 12,54,000</div>
                </div>
                <div className="flex flex-col items-start">
                  <div>INFLOW</div>
                  <div className="text-bold">+₹ 12,540</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-start">
                  <div>OUTFLOW</div>
                  <div className="text-bold text-(--destructive)">-₹ 1,254</div>
                </div>
                <div className="flex flex-col items-start">
                  <div>NET CASH</div>
                  <div className="text-bold">+₹ 2,000</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
