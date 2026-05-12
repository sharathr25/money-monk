import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import { getLoggedInUser } from "@workspace/api/auth/index"
import { DynamicIcon, type IconName } from "lucide-react/dynamic"
import { queryCashFlowTemplates } from "@workspace/api/db/index"
import type { CashFlowTemplate, Type } from "@workspace/core/types"
import { Button } from "@workspace/ui/components/button"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import { Card } from "@workspace/ui/components/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@workspace/ui/components/item"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { formatAmount } from "@workspace/ui/lib/utils"
import { Pen, Plus, Trash, FolderCode } from "lucide-react"
import { useEffect, useState } from "react"
import { Spinner } from "@workspace/ui/components/spinner"

export function CashFlowTemplates() {
  const user = getLoggedInUser()
  const { navigate } = useNavigator()
  const [income, setIncome] = useState<CashFlowTemplate[]>([])
  const [expenses, setExpenses] = useState<CashFlowTemplate[]>([])
  const [loading, setLoading] = useState(false)

  const init = async () => {
    try {
      setLoading(true)
      const templates = await queryCashFlowTemplates({ uid: user.uid || "" })
      setIncome(templates.filter((t) => t.type === "INCOME"))
      setExpenses(templates.filter((t) => t.type === "EXPENSE"))
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    init()
  }, [])

  const Templates = ({
    templates,
    type,
  }: {
    templates: CashFlowTemplate[]
    type: Type
  }) => {
    if (loading) return <Spinner className="m-auto" />

    if (templates.length === 0)
      return (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderCode />
            </EmptyMedia>
            <EmptyTitle className="capitalize">
              No {type.toLowerCase()} Yet
            </EmptyTitle>
            <EmptyDescription>
              Start by adding your first {type.toLowerCase()} below
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )

    return (
      <>
        {income.map((i) => (
          <Card className="p-0" key={i.id}>
            <Item className="flex items-center">
              <ItemMedia>
                <Avatar size="lg" className="after:border-0">
                  <AvatarFallback className="rounded-none">
                    <DynamicIcon name={i.icon as IconName} />
                  </AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="line-clamp-1">{i.name}</ItemTitle>
                <ItemDescription>{i.description}</ItemDescription>
              </ItemContent>
              <ItemContent className="flex flex-col items-end">
                <ItemDescription>
                  {type === "INCOME" ? "+" : "-"} {formatAmount(`${i.amount}`)}
                </ItemDescription>
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    className="p-0 text-(--primary)"
                    size="xs"
                    onClick={() =>
                      navigate(ROUTE_NAMES.EDIT_CASH_FLOW_TEMPLATE, {
                        templateId: i.id,
                      })
                    }
                  >
                    <Pen />
                  </Button>
                  <Button
                    variant="ghost"
                    className="p-0 text-(--destructive)"
                    size="xs"
                  >
                    <Trash />
                  </Button>
                </div>
              </ItemContent>
            </Item>
          </Card>
        ))}
      </>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <div>
        <h1 className="text-xl font-bold">Manage Cash Flow</h1>
        <p className="text-sm">
          Configure your recurring/one time income or expense
        </p>
      </div>
      <Tabs defaultValue="income">
        <TabsList className="flex w-full flex-1">
          <TabsTrigger className="flex w-full flex-1 p-3" value="income">
            Income
          </TabsTrigger>
          <TabsTrigger className="flex w-full flex-1 p-3" value="expense">
            Expense
          </TabsTrigger>
        </TabsList>
        <TabsContent value="income" className="flex flex-col gap-3">
          <Templates templates={income} type="INCOME" />
        </TabsContent>
        <TabsContent value="expense" className="flex flex-col gap-3">
          <Templates templates={expenses} type="EXPENSE" />
        </TabsContent>
      </Tabs>
      <Button
        className="fixed right-6 bottom-6 h-12 w-12 rounded-full"
        onClick={() => navigate(ROUTE_NAMES.ADD_CASH_FLOW_TEMPLATE)}
      >
        <Plus />
      </Button>
    </div>
  )
}
