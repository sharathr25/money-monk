import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Pen, Save, X } from "lucide-react"

import { amountToDouble, formatAmount } from "@workspace/ui/lib/utils"
import { Input } from "@workspace/ui/components/input"
import { useEffect, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import { Field, FieldLabel } from "@workspace/ui/components/field"

export function OpeningBalance({
  openingBalance,
  updateOpeningBalance,
}: {
  openingBalance: number
  updateOpeningBalance: (openingBalance: number) => void
}) {
  const [balance, setBalance] = useState(
    formatAmount(openingBalance, { withCurrency: true })
  )

  useEffect(() => {
    setBalance(formatAmount(openingBalance, { withCurrency: true }))
  }, [openingBalance])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Opening Balance
        </CardTitle>
        <CardAction>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="link" size="sm">
                <Pen />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader className="flex flex-col items-start">
                <AlertDialogTitle>Change Opening Balance</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription></AlertDialogDescription>
              <Field className="basis-3/4">
                <FieldLabel htmlFor="opening-balance">
                  Opening Balance
                </FieldLabel>
                <Input
                  id="opening-balance"
                  className="h-11"
                  value={balance}
                  onChange={(e) => setBalance(formatAmount(e.target.value))}
                />
              </Field>
              <AlertDialogFooter className="border-0">
                <AlertDialogCancel>
                  Cancel
                  <X />
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={() => updateOpeningBalance(amountToDouble(balance))}
                >
                  Save
                  <Save />
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardAction>
      </CardHeader>
      <CardContent className="mt-auto text-xl">{balance}</CardContent>
    </Card>
  )
}
