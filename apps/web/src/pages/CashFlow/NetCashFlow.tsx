import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { TrendingDown, TrendingUp } from "lucide-react"

import { formatAmount } from "@workspace/ui/lib/utils"

export function NetCashFlow({ netCashFlow }: { netCashFlow: number }) {
  const isPositive = netCashFlow > 0

  return (
    <Card className="w-full bg-(--primary) text-(--primary-foreground)">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="font-bold capitalize">Net Cash Flow</div>
          {isPositive ? (
            <TrendingUp className="text-(--success)" />
          ) : (
            <TrendingDown className="text-(--destructive)" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex justify-between gap-1">
          <div>{`${isPositive ? "+" : "-"} ${formatAmount(netCashFlow)}`}</div>
          {/* <Badge variant="secondary">+21%</Badge> */}
        </div>
      </CardContent>
    </Card>
  )
}
