import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import type { CashFlow } from "@workspace/core/types/cashFlow"
import { getCashFlow, getClosingBalance } from "@workspace/api/db/cashFlow"
import { OpeningBalance } from "./OpeningBalance"
import { ClosingBalance } from "./ClosingBalance"
import { NetCashFlow } from "./NetCashFlow"
import { Templates } from "./Templates"
import { updateUserData } from "@workspace/api/db/users"
import { IncomeVsExpenses } from "./IncomeVsExpenses"
import { useAuth } from "@/hooks/useAuth"
import { useMutation, useQuery } from "@tanstack/react-query"
import { saveTransaction } from "@workspace/api/db/transactions"
import { FullScreenLoader } from "@/components/FullScreenLoader"
import { FullScreenError } from "@/components/FullScreenError"
import { formatAmount } from "@workspace/ui/lib/utils"

export function CashFlow() {
  const startDate = dayjs().startOf("month").toDate()
  const endDate = dayjs().endOf("month").toDate()

  const [cashFlow, setCashFlow] = useState<CashFlow>()
  const user = useAuth()
  const {
    isPending: loading,
    data,
    error,
  } = useQuery({
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

  if (loading) return <FullScreenLoader />

  if (error) return <FullScreenError />

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
      type: "ADJUSTMENT",
      status: "COMPLETED",
      frequency: "ONE_TIME",
      completedDate: new Date(),
      icon: "banknote",
      description: `${formatAmount(cashFlow.openingBalance, { withCurrency: true })} ➡️ ${formatAmount(openingBalance, { withCurrency: true })}`,
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">
          {dayjs().format("MMM")} {dayjs().format("YYYY")}, Cash Flow.
        </h1>
        <p className="text-sm">This month's money story.</p>
      </div>
      <div className="flex gap-4">
        <OpeningBalance
          openingBalance={cashFlow.openingBalance}
          updateOpeningBalance={updateOpeningBalance}
        />
        <IncomeVsExpenses
          expenses={cashFlow.totalExpenses}
          income={cashFlow.totalIncome}
        />
      </div>
      <div className="flex gap-4">
        <ClosingBalance closingBalance={cashFlow.closingBalance} />
        <NetCashFlow netCashFlow={cashFlow.netCashFlow} />
      </div>
      <Templates cashFlow={cashFlow} />
    </div>
  )
}
