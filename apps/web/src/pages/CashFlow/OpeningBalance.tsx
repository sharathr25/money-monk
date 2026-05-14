import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Pen, Wallet } from "lucide-react"

import { formatAmount } from "@workspace/ui/lib/utils"

export function OpeningBalance({ openingBalance }: { openingBalance: number }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="font-bold capitalize">Opening Balance</div>
          <Wallet />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>{formatAmount(openingBalance)}</div>
          <Button variant="secondary">
            <Pen />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
