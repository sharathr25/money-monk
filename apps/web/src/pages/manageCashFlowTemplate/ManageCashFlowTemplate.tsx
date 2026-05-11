import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import { getLoggedInUser } from "@workspace/api/auth/index"
import { DynamicIcon, type IconName } from "lucide-react/dynamic"
import { queryCashFlowTemplates } from "@workspace/api/db/index"
import type { CashFlowTemplate } from "@workspace/core/types"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
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
import { Pen, Plus, Trash } from "lucide-react"
import { useEffect, useState } from "react"

export function ManageCashFlowTemplate() {
  const user = getLoggedInUser()
  const { navigate } = useNavigator()
  const [income, setIncome] = useState<CashFlowTemplate[]>([])
  const [expenses, setExpenses] = useState<CashFlowTemplate[]>([])

  useEffect(() => {
    queryCashFlowTemplates({ uid: user.uid || "" }).then((cfts) => {
      console.log(cfts)
      setIncome(cfts.filter((t) => t.type === "INCOME"))
      setExpenses(cfts.filter((t) => t.type === "EXPENSE"))
    })
  }, [])

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
          {income.map((i) => (
            <Card className="p-0" key={i.id}>
              <Item>
                <ItemMedia>
                  <Badge className="size-10" variant="secondary">
                    <DynamicIcon name={i.icon as IconName} />
                  </Badge>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className="line-clamp-1">{i.name}</ItemTitle>
                  <ItemDescription>{i.description}</ItemDescription>
                </ItemContent>
                <ItemContent className="flex flex-col items-end">
                  <ItemDescription>
                    + {formatAmount(`${i.amount}`)}
                  </ItemDescription>
                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      className="p-0 text-(--primary)"
                      size="xs"
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
        </TabsContent>
        <TabsContent value="expense" className="flex flex-col gap-3">
          {expenses.map((e) => (
            <Card className="p-0" key={e.id}>
              <Item>
                <ItemMedia>
                  <Badge className="size-10" variant="secondary">
                    <DynamicIcon name={e.icon as IconName} />
                  </Badge>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className="line-clamp-1">{e.name}</ItemTitle>
                  <ItemDescription>{e.description}</ItemDescription>
                </ItemContent>
                <ItemContent className="flex flex-col items-end">
                  <ItemDescription>
                    - {formatAmount(`${e.amount}`)}
                  </ItemDescription>
                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      className="p-0 text-(--primary)"
                      size="xs"
                      onClick={() =>
                        navigate(
                          ROUTE_NAMES.EDIT_CASH_FLOW_TEMPLATE,
                          "/" + e.id
                        )
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
