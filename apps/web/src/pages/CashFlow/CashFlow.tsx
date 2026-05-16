import dayjs from "dayjs"
import { useEffect, useState } from "react"
import type { CashFlow } from "@workspace/core/types/cashFlow"
import { Spinner } from "@workspace/ui/components/spinner"
import { getCashFlow, getClosingBalance } from "@workspace/api/db/cashFlow"
import { OpeningBalance } from "./OpeningBalance"
import { ClosingBalance } from "./ClosingBalance"
import { NetCashFlow } from "./NetCashFlow"
import { Templates } from "./Templates"
import { updateUserData } from "@workspace/api/db/users"
import { Month } from "./Month"

export function CashFlow() {
  const [cashFlow, setCashFlow] = useState<CashFlow>()
  const [loading, setLoading] = useState(false)

  const init = async () => {
    try {
      setLoading(true)
      const cashFlow = await getCashFlow({
        startDate: dayjs().startOf("month").toDate(),
        endDate: dayjs().endOf("month").toDate(),
      })
      setCashFlow(cashFlow)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    init()
  }, [])

  if (loading) return <Spinner className="m-auto" />

  if (!cashFlow) return null

  const updateOpeningBalance = async (openingBalance: number) => {
    try {
      await updateUserData({ openingBalance })
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
