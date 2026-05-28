import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import type { CashFlow } from "@workspace/core/types/cashFlow"
import { Spinner } from "@workspace/ui/components/spinner"
import { getCashFlow, getClosingBalance } from "@workspace/api/db/cashFlow"
import { OpeningBalance } from "./OpeningBalance"
import { ClosingBalance } from "./ClosingBalance"
import { NetCashFlow } from "./NetCashFlow"
import { Templates } from "./Templates"
import { updateUserData } from "@workspace/api/db/users"
import { Month } from "./Month"
import { useAuth } from "@/hooks/useAuth"
import { useMutation, useQuery } from "@tanstack/react-query"
import { saveTransaction } from "@workspace/api/db/transactions"

export function CashFlow() {
  const startDate = dayjs().startOf("month").toDate()
  const endDate = dayjs().endOf("month").toDate()

  const [cashFlow, setCashFlow] = useState<CashFlow>()
  const user = useAuth()
  const { isPending: loading, data } = useQuery({
    queryKey: ["cash-flow"],
    queryFn: getCashFlow(user.uid).bind(null, { startDate, endDate }),
  })
  const { mutate: updateUserDataForUser } = useMutation({
    mutationKey: ["opening-balance-update", cashFlow],
    mutationFn: updateUserData(user.uid).bind(null),
    onSuccess: () => toast.success("Successfully updated opening balance"),
    onError: () => toast.error("Failed to update opening balance"),
  })
  const { mutate: saveTransactionForUser } = useMutation({
    mutationKey: ["opening-balance-transaction"],
    mutationFn: saveTransaction(user.uid).bind(null),
    onError: () => toast.error("Failed to save transaction"),
  })

  useEffect(() => {
    if (data) {
      setCashFlow(data)
    }
  }, [data?.openingBalance])

  if (loading) return <Spinner className="m-auto" />

  if (!cashFlow) return null

  const updateOpeningBalance = async (openingBalance: number) => {
    updateUserDataForUser({ openingBalance })
    setCashFlow({
      ...cashFlow,
      openingBalance,
      closingBalance: getClosingBalance(openingBalance, cashFlow.netCashFlow),
    })
    saveTransactionForUser({
      amount: openingBalance,
      name: "Opening balance adjustment",
      type: "BALANCE_ADJUSTMENT",
      date: new Date(),
      icon: "banknote",
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Month />
        <OpeningBalance
          openingBalance={cashFlow.openingBalance}
          updateOpeningBalance={updateOpeningBalance}
        />
      </div>
      <div className="flex gap-4">
        <NetCashFlow netCashFlow={cashFlow.netCashFlow} />
        <ClosingBalance closingBalance={cashFlow.closingBalance} />
      </div>
      <Templates cashFlow={cashFlow} />
    </div>
  )
}
