import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@workspace/ui/components/item"
import { Badge } from "@workspace/ui/components/badge"
import {
  ArrowDownUp,
  Banknote,
  Cog,
  MoveDown,
  MoveUp,
  Pen,
  TrendingUp,
  Wallet,
} from "lucide-react"
import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import { useEffect } from "react"
import { queryCashFlowTemplates } from "@workspace/api/db/index"
import { getLoggedInUser } from "@workspace/api/auth/index"

export function CashFlow() {
  const user = getLoggedInUser()
  const { navigate } = useNavigator()

  useEffect(() => {
    queryCashFlowTemplates({ uid: user.uid || "" }).then(console.log)
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-2">
        <div className="text-2xl/7 font-extrabold">March</div>
        <div className="text-sm">2024</div>
      </div>
      <div className="flex gap-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="font-bold capitalize">Opening Balance</div>
              <Wallet />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>₹ 12,54,000</div>
              <Button variant="secondary">
                <Pen />
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full bg-(--primary) text-(--primary-foreground)">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="font-bold capitalize">Net Cash Flow</div>
              <TrendingUp />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex justify-between gap-1">
              <div>₹ 12,54,000</div>
              <Badge variant="secondary">+21%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          <MoveDown className="text-[var(--success)]" />
          Income
        </div>
        <div className="flex items-center gap-1">+ ₹1,500</div>
      </div>
      <div className="flex flex-col gap-3">
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
            <ItemContent className="flex-none text-center">
              <ItemDescription>+ ₹1,500</ItemDescription>
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
            <ItemContent className="flex-none text-center">
              <ItemDescription>+ ₹1,500</ItemDescription>
            </ItemContent>
          </Item>
        </Card>
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <MoveUp className="text-[var(--destructive)]" size={20} />
            Expenses
          </div>
          - ₹1,500
        </div>
      </div>
      <div className="flex flex-col gap-3">
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
            <ItemContent className="flex-none text-center">
              <ItemDescription>- ₹1,500</ItemDescription>
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
            <ItemContent className="flex-none text-center">
              <ItemDescription>- ₹1,500</ItemDescription>
            </ItemContent>
          </Item>
        </Card>
      </div>
      <Button
        className="fixed right-6 bottom-20 h-12 w-20 rounded-full"
        onClick={() => navigate(ROUTE_NAMES.MANAGE_CASH_FLOW_TEMPLATE)}
      >
        <ArrowDownUp />
        <Cog />
      </Button>
    </div>
  )
}
