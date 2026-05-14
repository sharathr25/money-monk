import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import {
  ArrowDownUp,
  Cog,
  FolderCode,
  MoveDown,
  MoveUp,
  Pen,
  TrendingUp,
  Wallet,
} from "lucide-react"
import dayjs from "dayjs"
import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import { useEffect, useState } from "react"
import { queryCashFlowTemplates } from "@workspace/api/db/cashFlowTemplates"
import type { CashFlowTemplate } from "@workspace/core/types/cashFlowTemplates"
import { Spinner } from "@workspace/ui/components/spinner"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import { formatAmount } from "@workspace/ui/lib/utils"
import { TemplateList } from "@/components/TemplateList"

export function CashFlow() {
  const { navigate } = useNavigator()

  const [templates, setTemplates] = useState<CashFlowTemplate[]>([])
  const [loading, setLoading] = useState(false)

  const init = async () => {
    try {
      setLoading(true)
      const cfts = await queryCashFlowTemplates({
        startDate: dayjs().startOf("month").toDate(),
        endDate: dayjs().endOf("month").toDate(),
      })
      setTemplates(cfts)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    init()
  }, [])

  const income = templates.filter((t) => t.type === "INCOME")
  const expenses = templates.filter((t) => t.type === "EXPENSE")

  const totalIncome = income.reduce((acc, cur) => acc + cur.amount, 0)
  const totalExpenses = expenses.reduce((acc, cur) => acc + cur.amount, 0)

  const Templates = () => {
    if (loading) return <Spinner className="m-auto" />

    if (templates.length === 0)
      return (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderCode />
            </EmptyMedia>
            <EmptyTitle className="capitalize">No Templates Yet</EmptyTitle>
            <EmptyDescription>
              Start by adding your first template below
            </EmptyDescription>
            <Button
              onClick={() => navigate(ROUTE_NAMES.ADD_CASH_FLOW_TEMPLATE)}
            >
              + Add Template
            </Button>
          </EmptyHeader>
        </Empty>
      )

    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <MoveDown className="text-[var(--success)]" />
            Income
          </div>
          <div className="flex items-center gap-1">
            + {formatAmount(`${totalIncome}`)}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <TemplateList templates={income} />
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between">
            <div className="flex items-center gap-1">
              <MoveUp className="text-[var(--destructive)]" size={20} />
              Expenses
            </div>
            - {formatAmount(`${totalExpenses}`)}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <TemplateList templates={expenses} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-2">
        <div className="text-2xl/7 font-extrabold">March</div>
        <div className="text-sm">2024</div>
      </div>
      <div className="flex gap-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="font-bold capitalize">Opening Balance</div>
              <Wallet />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>₹ 12,54,000</div>
              <Button variant="secondary">
                <Pen />
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full bg-(--primary) text-(--primary-foreground)">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="font-bold capitalize">Net Cash Flow</div>
              <TrendingUp />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex justify-between gap-1">
              <div>₹ 12,54,000</div>
              <Badge variant="secondary">+21%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      <Templates />
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
