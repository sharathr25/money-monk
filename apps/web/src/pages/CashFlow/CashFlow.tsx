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
import { Progress } from "@workspace/ui/components/progress"
import {
  ArrowDownUp,
  Banknote,
  Cog,
  MoveDown,
  MoveUp,
  Pen,
  TrendingUp,
} from "lucide-react"
import { useNavigate } from "react-router"

export function CashFlow() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="font-bold capitalize">Opening Balance</div>
            <Badge
              className="rounded-sm p-4"
              onClick={() => {}}
              variant="secondary"
            >
              March
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>₹ 12,54,000</div>
            <Button variant="ghost">
              <Pen />
            </Button>
          </div>
          <Progress value={20} />
        </CardContent>
      </Card>
      <Card className="w-full bg-(--primary) text-(--primary-foreground)">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="font-bold capitalize">REMANING FOR THE MONTH</div>
            <TrendingUp />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>₹ 12,54,000</div>
            <Badge variant="secondary">
              <div className="text-xs">+21%</div>
            </Badge>
          </div>
          Calculated based on recurring commitments and active income sources.
        </CardContent>
      </Card>
      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          <MoveDown className="text-[var(--success)]" />
          In
        </div>
        <div className="flex items-center gap-1">
          + ₹1,500
          <Badge variant="default">
            <div className="text-xs">+187% vs Feb</div>
          </Badge>
        </div>
      </div>
      <div className="flex flex-col gap-2">
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
            Out
          </div>
          - ₹1,500
        </div>
      </div>
      <div className="flex flex-col gap-2">
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
        onClick={() => navigate("/manage-cash-flow")}
      >
        <ArrowDownUp />
        <Cog />
      </Button>
    </div>
  )
}
