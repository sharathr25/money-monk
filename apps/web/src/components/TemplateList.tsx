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
import { DynamicIcon, type IconName } from "lucide-react/dynamic"

export const TemplateList = ({
  templates,
}: {
  templates: CashFlowTemplate[]
}) => {
  const { navigate } = useNavigator()

  return templates.map((t) => (
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
            <span>
              {!!t.date && t.frequency === "ONE_TIME" && formatDate(t.date)}
              {!!t.day &&
                t.frequency === "MONTHLY" &&
                "On " + formatDayOfMonth(t.day)}
            </span>
          </ItemDescription>
        </ItemContent>
      </Item>
    </Card>
  ))
}
