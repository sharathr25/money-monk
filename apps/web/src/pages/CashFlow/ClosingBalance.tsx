import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Wallet } from "lucide-react"

import { formatAmount } from "@workspace/ui/lib/utils"

export function ClosingBalance({ closingBalance }: { closingBalance: number }) {
  return (
    <Card className="w-full bg-(--secondary)">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Closing Balance
        </CardTitle>
        <CardAction>
          <Wallet />
        </CardAction>
      </CardHeader>
      <CardContent className="text-xl">
        {formatAmount(closingBalance, {
          withCurrency: true,
          withSign: true,
        })}
      </CardContent>
    </Card>
  )
}
