import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Pen, Save, Wallet, X } from "lucide-react"

import { amountToDouble, formatAmount } from "@workspace/ui/lib/utils"
import { Input } from "@workspace/ui/components/input"
import { useState } from "react"
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
  const [balance, setBalance] = useState(`${openingBalance}`)

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
          <div>{formatAmount(balance)}</div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary">
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
                  onChange={(e) =>
                    setBalance(
                      formatAmount(e.target.value, {
                        withCurrency: false,
                        withSign: false,
                      })
                    )
                  }
                />
              </Field>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  <X />
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => updateOpeningBalance(amountToDouble(balance))}
                >
                  <Save /> Save
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}
