import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import type { Transaction } from "@workspace/core/types/transactions"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Card } from "@workspace/ui/components/card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@workspace/ui/components/item"
import {
  cn,
  formatAmount,
  formatDate,
  formatDayOfMonth,
} from "@workspace/ui/lib/utils"
import dayjs from "dayjs"

import {
  Boxes,
  Calendar,
  CalendarCheck,
  Check,
  MoveDownLeft,
  MoveUpRight,
  Repeat,
  Target,
} from "lucide-react"
import { DynamicIcon, type IconName } from "lucide-react/dynamic"

export const TemplateItem = ({ template }: { template: Transaction }) => {
  const { navigate } = useNavigator()

  const old =
    template.frequency === "ONE_TIME" &&
    template.plannedDate &&
    dayjs(template.plannedDate).isBefore()

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
          <ItemTitle className="font-bold">{template.name}</ItemTitle>
          <ItemDescription
            className={cn("text-xs", !template.description && "opacity-0")}
          >
            {template.description || "-"}
          </ItemDescription>
        </ItemContent>
        <ItemActions className="flex-none text-center">
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
            {!!template.plannedDate && (
              <span className="flex items-center gap-1 text-xs">
                {template.frequency === "ONE_TIME"
                  ? formatDate(template.plannedDate)
                  : `On ${formatDayOfMonth(template.plannedDate)}`}
                {template.frequency === "ONE_TIME" ? (
                  <Calendar className="size-3.5 text-(--primary)" />
                ) : (
                  <Repeat className="size-3.5 text-(--primary)" />
                )}
              </span>
            )}
          </ItemDescription>
        </ItemActions>
        <ItemFooter className="justify-start overflow-x-scroll">
          {!!template.completedDate && (
            <Badge
              variant="outline"
              className="border-(--success) text-(--success)"
            >
              <Check />
              Done
            </Badge>
          )}
          {template.goal?.name && (
            <Badge variant="outline">
              <Target />
              {template.goal?.name}
            </Badge>
          )}
          {template.category?.name && (
            <Badge variant="outline">
              <Boxes />
              {template.category.name}
            </Badge>
          )}
          {template.counterParty && (
            <Badge variant="outline">
              {template.type === "EXPENSE" ? (
                <MoveUpRight className="text-(--destructive)" />
              ) : (
                <MoveDownLeft className="text-(--success)" />
              )}
              {template.counterParty}
            </Badge>
          )}
          {old && (
            <Badge
              variant="outline"
              className="border-(--destructive) text-(--destructive)"
            >
              <CalendarCheck />
              Expired
            </Badge>
          )}
        </ItemFooter>
      </Item>
    </Card>
  )
}
