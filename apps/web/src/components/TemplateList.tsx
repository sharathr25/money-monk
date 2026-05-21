import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import type { CashFlowTemplate } from "@workspace/core/types"
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
  cn,
  formatCashFlowAmount,
  formatDate,
  formatDayOfMonth,
} from "@workspace/ui/lib/utils"
import dayjs from "dayjs"
import { Calendar, CalendarCheck, Repeat } from "lucide-react"
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

  const futureOneTimeTemplates = oneTimeTemplates.filter((t) =>
    dayjs(t.date).isAfter(date)
  )
  const pastOneTimeTemplates = oneTimeTemplates.filter((t) =>
    dayjs(t.date).isBefore(date)
  )

  const renderCard = (t: CashFlowTemplate, old: boolean = false) => (
    <Card
      className={cn("p-0", old && "opacity-50")}
      key={t.id}
      onClick={() =>
        navigate(ROUTE_NAMES.CASH_FLOW_TEMPLATE, { templateId: t.id })
      }
    >
      <Item>
        <ItemMedia variant="image">
          <Avatar
            size="lg"
            className="bg-(--secondary) after:border-transparent"
          >
            <AvatarFallback>
              <DynamicIcon name={t.icon as IconName} />
            </AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">{t.name}</ItemTitle>
          <ItemDescription>{t.description}</ItemDescription>
        </ItemContent>
        <ItemContent className="flex-none text-center">
          <ItemDescription className="flex flex-col items-end">
            <span>{formatCashFlowAmount(t.type, t.amount)}</span>
            {!!t.date && t.frequency === "ONE_TIME" && (
              <span className="flex items-center gap-1 text-xs">
                {formatDate(t.date)}
                {old ? (
                  <CalendarCheck className="size-3.5 text-(--primary)" />
                ) : (
                  <Calendar className="size-3.5 text-(--primary)" />
                )}
              </span>
            )}
            {t.frequency === "MONTHLY" && (
              <span className="flex items-center gap-1 text-xs">
                {!!t.day && `On ${formatDayOfMonth(t.day)}`}
                <Repeat className="size-3.5 text-(--primary)" />
              </span>
            )}
          </ItemDescription>
        </ItemContent>
      </Item>
    </Card>
  )

  return (
    <div className="flex flex-col gap-2">
      {recurringTemplates.map((t) => renderCard(t))}
      {futureOneTimeTemplates.map((t) => renderCard(t))}
      {pastOneTimeTemplates.map((t) => renderCard(t, true))}
    </div>
  )
}
