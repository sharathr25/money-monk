import { Button } from "@workspace/ui/components/button"
import { FolderCode, MoveDown, MoveUp } from "lucide-react"
import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import type { CashFlow } from "@workspace/core/types/cashFlow"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import { formatAmount } from "@workspace/ui/lib/utils"
import { TemplateList } from "@/components/TemplateList"

export function Templates({ cashFlow }: { cashFlow: CashFlow }) {
  const { navigate } = useNavigator()

  if (!cashFlow?.income.length && !cashFlow?.expenses.length)
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
          <Button onClick={() => navigate(ROUTE_NAMES.ADD_CASH_FLOW_TEMPLATE)}>
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
          + {formatAmount(cashFlow.totalIncome, { withCurrency: true })}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <TemplateList templates={cashFlow.income} />
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <MoveUp className="text-[var(--destructive)]" size={20} />
            Expenses
          </div>
          - {formatAmount(cashFlow.totalExpenses, { withCurrency: true })}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <TemplateList templates={cashFlow.expenses} />
      </div>
    </div>
  )
}
