import { Button } from "@workspace/ui/components/button"
import { ArrowDownUp, Cog } from "lucide-react"
import dayjs from "dayjs"
import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import { useEffect, useState } from "react"
import type { CashFlow } from "@workspace/core/types/cashFlow"
import { Spinner } from "@workspace/ui/components/spinner"
import { getCashFlow, getClosingBalance } from "@workspace/api/db/cashFlow"
import { OpeningBalance } from "./OpeningBalance"
import { ClosingBalance } from "./ClosingBalance"
import { NetCashFlow } from "./NetCashFlow"
import { Templates } from "./Templates"
import { updateUserData } from "@workspace/api/db/users"

export function CashFlow() {
  const { navigate } = useNavigator()

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
      <div className="flex items-end gap-2">
        <div className="text-2xl/7 font-extrabold">
          {dayjs().format("MMMM")}
        </div>
        <div className="text-sm">{dayjs().format("YYYY")}</div>
      </div>
      <div className="flex gap-4">
        <OpeningBalance
          openingBalance={cashFlow.openingBalance}
          updateOpeningBalance={updateOpeningBalance}
        />
        <NetCashFlow netCashFlow={cashFlow.netCashFlow} />
      </div>
      <div className="flex gap-4">
        <ClosingBalance closingBalance={cashFlow.closingBalance} />
      </div>
      <Templates cashFlow={cashFlow} />
      <Button
        className="fixed right-6 bottom-20 h-12 w-20 rounded-full"
        onClick={() => navigate(ROUTE_NAMES.CASH_FLOW_TEMPLATES)}
      >
        <ArrowDownUp />
        <Cog />
      </Button>
    </div>
  )
}
