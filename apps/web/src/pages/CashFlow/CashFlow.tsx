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

export function CashFlow() {
  const startDate = dayjs().startOf("month").toDate()
  const endDate = dayjs().endOf("month").toDate()

  const [cashFlow, setCashFlow] = useState<CashFlow>()
  const user = useAuth()
  const { isPending: loading, data } = useQuery({
    queryKey: ["cash-flow"],
    queryFn: getCashFlow(user.uid).bind(null, { startDate, endDate }),
  })
  const { mutate } = useMutation({
    mutationKey: ["opening-balance-update"],
    mutationFn: updateUserData(user.uid).bind(null),
    onSuccess: console.log,
    onError: () => toast.error("Failed to update opening balance"),
  })

  useEffect(() => {
    if (data) {
      setCashFlow(data)
    }
  }, [data])

  if (loading) return <Spinner className="m-auto" />

  if (!cashFlow) return null

  const updateOpeningBalance = async (openingBalance: number) => {
    try {
      mutate({ openingBalance })
      setCashFlow({
        ...cashFlow,
        openingBalance,
        closingBalance: getClosingBalance(openingBalance, cashFlow.netCashFlow),
      })
    } catch (e) {
      console.error(e)
    }
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
