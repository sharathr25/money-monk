import {
  Card,
  CardAction,
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
        <CardTitle>Net Cash Flow</CardTitle>
        <CardAction>
          {isPositive ? (
            <TrendingUp className="text-(--success)" />
          ) : (
            <TrendingDown className="text-(--destructive)" />
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="mt-auto text-xl">
        {formatAmount(netCashFlow, { withCurrency: true, withSign: true })}
      </CardContent>
    </Card>
  )
}
