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
import { Banknote, Pen, Plus, Trash } from "lucide-react"
import { useNavigate } from "react-router"

export function CashFlowManagement() {
  const navigate = useNavigate()

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
          <Card className="p-0">
            <Item>
              <ItemMedia>
                <Badge className="size-10" variant="secondary">
                  <Banknote />
                </Badge>
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="line-clamp-1">Salary</ItemTitle>
                <ItemDescription>Monthly credit</ItemDescription>
              </ItemContent>
              <ItemContent className="flex flex-col items-end">
                <ItemDescription>+ ₹1,500</ItemDescription>
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
          <Card className="p-0">
            <Item>
              <ItemMedia>
                <Badge className="size-10" variant="secondary">
                  <Banknote />
                </Badge>
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="line-clamp-1">Salary</ItemTitle>
                <ItemDescription>Monthly credit</ItemDescription>
              </ItemContent>
              <ItemContent className="flex flex-col items-end">
                <ItemDescription>+ ₹1,500</ItemDescription>
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
        </TabsContent>
        <TabsContent value="expense" className="flex flex-col gap-3">
          <Card className="p-0">
            <Item>
              <ItemMedia>
                <Badge className="size-10" variant="secondary">
                  <Banknote />
                </Badge>
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="line-clamp-1">Salary</ItemTitle>
                <ItemDescription>Monthly credit</ItemDescription>
              </ItemContent>
              <ItemContent className="flex flex-col items-end">
                <ItemDescription>- ₹1,500</ItemDescription>
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
          <Card className="p-0">
            <Item>
              <ItemMedia>
                <Badge className="size-10" variant="secondary">
                  <Banknote />
                </Badge>
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="line-clamp-1">Salary</ItemTitle>
                <ItemDescription>Monthly credit</ItemDescription>
              </ItemContent>
              <ItemContent className="flex flex-col items-end">
                <ItemDescription>- ₹1,500</ItemDescription>
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
        </TabsContent>
      </Tabs>
      <Button
        className="fixed right-6 bottom-6 h-12 w-12 rounded-full"
        onClick={() => navigate("/add-cash-flow-movement")}
      >
        <Plus />
      </Button>
    </div>
  )
}
