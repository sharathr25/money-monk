import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Wallet } from "lucide-react"

import { formatAmount } from "@workspace/ui/lib/utils"

export function ClosingBalance({ closingBalance }: { closingBalance: number }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="font-bold capitalize">Closing Balance</div>
          <Wallet />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            {formatAmount(closingBalance, {
              withCurrency: true,
              withSign: true,
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
