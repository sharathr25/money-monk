import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import type { CashFlowTemplate } from "@workspace/core/types"
import { Badge } from "@workspace/ui/components/badge"
import { Card } from "@workspace/ui/components/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@workspace/ui/components/item"
import {
  formatCashFlowAmount,
  formatDate,
  formatDayOfMonth,
} from "@workspace/ui/lib/utils"
import { Calendar, Repeat } from "lucide-react"
import { DynamicIcon, type IconName } from "lucide-react/dynamic"

export const TemplateList = ({
  templates,
}: {
  templates: CashFlowTemplate[]
}) => {
  const { navigate } = useNavigator()

  const recurringTemplates = [...templates].filter(
    (t) => t.frequency === "MONTHLY"
  )
  const oneTimeTemplates = [...templates].filter(
    (t) => t.frequency === "ONE_TIME"
  )

  const date = new Date()
  recurringTemplates.sort((a, b) => (a.day || 0) - (b.day || 0))
  oneTimeTemplates.sort(
    (a, b) => (a.date || date).getTime() - (b.date || date).getTime()
  )

  const renderCard = (t: CashFlowTemplate) => (
    <Card
      className="p-0"
      key={t.id}
      onClick={() =>
        navigate(ROUTE_NAMES.CASH_FLOW_TEMPLATE, { templateId: t.id })
      }
    >
      <Item>
        <ItemMedia>
          <Badge className="size-10" variant="secondary">
            <DynamicIcon name={t.icon as IconName} />
          </Badge>
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">{t.name}</ItemTitle>
          <ItemDescription>{t.description}</ItemDescription>
        </ItemContent>
        <ItemContent className="flex-none text-center">
          <ItemDescription className="flex flex-col items-end">
            <span>{formatCashFlowAmount(t.type, t.amount)}</span>
            {!!t.date && t.frequency === "ONE_TIME" && (
              <span className="flex items-center gap-2">
                <Calendar className="size-3 text-(--primary)" />
                {formatDate(t.date)}
              </span>
            )}
            {t.frequency === "MONTHLY" && (
              <span className="flex items-center gap-2">
                <Repeat className="size-3 text-(--primary)" />
                {!!t.day && `On ${formatDayOfMonth(t.day)}`}
              </span>
            )}
          </ItemDescription>
        </ItemContent>
      </Item>
    </Card>
  )

  return (
    <div className="flex flex-col gap-2">
      {recurringTemplates.map(renderCard)}
      {oneTimeTemplates.map(renderCard)}
    </div>
  )
}
