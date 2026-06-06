import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import type { Transaction } from "@workspace/core/types/transactions"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Card } from "@workspace/ui/components/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@workspace/ui/components/item"
import {
  formatAmount,
  formatDate,
  formatDayOfMonth,
} from "@workspace/ui/lib/utils"
import dayjs from "dayjs"

import { Badge, Calendar, Repeat } from "lucide-react"
import { DynamicIcon, type IconName } from "lucide-react/dynamic"

export const TemplateItem = ({ template }: { template: Transaction }) => {
  const { navigate } = useNavigator()

  const old = template.plannedDate && dayjs(template.plannedDate).isBefore()

  const onClick = () => {
    navigate(ROUTE_NAMES.CASH_FLOW_TEMPLATE, { templateId: template.id })
  }

  return (
    <Card className="p-0" onClick={onClick}>
      <Item>
        <ItemMedia variant="image">
          <Avatar
            size="lg"
            className="bg-(--secondary) after:border-transparent"
          >
            <AvatarFallback>
              <DynamicIcon name={template.icon as IconName} />
            </AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1 font-bold">
            {template.name}
            {old && <Badge>Expired</Badge>}
          </ItemTitle>
          <ItemDescription>{template.description}</ItemDescription>
        </ItemContent>
        <ItemContent className="flex-none text-center">
          <ItemDescription className="flex flex-col items-end">
            <span>
              {formatAmount(
                (template.type === "EXPENSE" ? -1 : 1) * template.amount,
                {
                  withCurrency: true,
                  withSign: true,
                }
              )}
            </span>
            {!!template.plannedDate && template.frequency === "ONE_TIME" && (
              <span className="flex items-center gap-1 text-xs">
                {formatDate(template.plannedDate)}
                <Calendar className="size-3.5 text-(--primary)" />
              </span>
            )}
            {template.frequency === "MONTHLY" && (
              <span className="flex items-center gap-1 text-xs">
                {!!template.plannedDay &&
                  `On ${formatDayOfMonth(template.plannedDay)}`}
                <Repeat className="size-3.5 text-(--primary)" />
              </span>
            )}
          </ItemDescription>
        </ItemContent>
      </Item>
    </Card>
  )
}
