import { FullScreenError } from "@/components/FullScreenError"
import { FullScreenLoader } from "@/components/FullScreenLoader"
import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import { getLoggedInUser } from "@workspace/api/auth/index"
import { getCashFlowTemplate } from "@workspace/api/db/index"
import type { CashFlowTemplate } from "@workspace/core/types"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@workspace/ui/components/item"

import { formatAmount } from "@workspace/ui/lib/utils"
import {
  Calendar,
  MoveLeft,
  Pen,
  RefreshCcw,
  Repeat,
  Trash,
} from "lucide-react"
import { DynamicIcon, type IconName } from "lucide-react/dynamic"
import { useEffect, useState } from "react"
import { useParams } from "react-router"

export function CashFlowTemplate() {
  const user = getLoggedInUser()
  const { templateId } = useParams()
  const { goBack, navigate } = useNavigator()

  const [template, setTemplate] = useState<CashFlowTemplate>()
  const [loading, setLoading] = useState(false)

  const cashFlowTemplateId = templateId || ""

  const init = async () => {
    try {
      setLoading(true)
      const cashFlowTemplate = await getCashFlowTemplate({
        uid: user.uid,
        id: cashFlowTemplateId,
      })
      if (cashFlowTemplate) {
        setTemplate(cashFlowTemplate)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    init()
  }, [])

  if (loading) return <FullScreenLoader />

  if (!template)
    return (
      <FullScreenError msg="Cash flow template not found">
        <div className="flex gap-2">
          <Button variant="outline" onClick={goBack}>
            <MoveLeft />
            Go back
          </Button>
          <Button onClick={init}>
            <RefreshCcw />
            Refresh
          </Button>
        </div>
      </FullScreenError>
    )

  return (
    <div className="flex flex-1 flex-col gap-3">
      <Card className="flex flex-1 items-center justify-center bg-(--primary) p-10 text-(--secondary)">
        <DynamicIcon
          name={template.icon as IconName}
          strokeWidth={0.5}
          className="size-25"
        />
      </Card>
      <div>
        <div className="flex justify-between">
          <div>
            <h1 className="text-xl font-bold">{template.name}</h1>
            <p className="text-sm">{template.description}</p>
          </div>
          <div className="flex flex-col items-end">
            <h2 className="font-bold">{formatAmount(`${template.amount}`)}</h2>
            {template.type === "EXPENSE" ? (
              <Badge className="bg-(--destructive)">{template.type}</Badge>
            ) : (
              <Badge className="bg-(--success)">{template.type}</Badge>
            )}
          </div>
        </div>
      </div>
      <Card>
        <CardContent className="flex flex-col">
          <Item>
            <ItemMedia variant="icon">
              <Calendar />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Created At</ItemTitle>
              <ItemDescription>
                {template.createdAt.toLocaleString()}
              </ItemDescription>
            </ItemContent>
          </Item>
          <Item>
            <ItemMedia variant="icon">
              <Calendar />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Updated At</ItemTitle>
              <ItemDescription>
                {template.updatedAt.toLocaleString()}
              </ItemDescription>
            </ItemContent>
          </Item>
          <div className="flex">
            <Item>
              <ItemMedia variant="icon">
                <Repeat />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Frequency</ItemTitle>
                <ItemDescription>
                  {template.frequency.replace("_", " ")}
                  {!!template.date && " - " + template.date.toLocaleString()}
                </ItemDescription>
              </ItemContent>
            </Item>
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-2">
        <Button variant="destructive" className="h-11 flex-1">
          <Trash />
          Delete
        </Button>
        <Button
          className="h-11 flex-1"
          onClick={() =>
            navigate(ROUTE_NAMES.EDIT_CASH_FLOW_TEMPLATE, {
              templateId: template.id,
            })
          }
        >
          <Pen />
          Edit
        </Button>
      </div>
    </div>
  )
}
