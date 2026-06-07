import { UserAvatar } from "@/components/UserAvatar"
import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import {
  Target,
  ChartNoAxesCombined,
  ArrowDownUp,
  BookText,
  NotebookPen,
} from "lucide-react"
import { Outlet, useLocation } from "react-router"

export function Home() {
  const { navigate } = useNavigator()
  const { pathname } = useLocation()

  const links = [
    {
      label: "Cash Flow",
      to: ROUTE_NAMES.ROOT,
      isActive: pathname.endsWith("/home"),
      Icon: ArrowDownUp,
    },
    {
      label: "Planned",
      to: ROUTE_NAMES.CASH_FLOW_TEMPLATES,
      isActive: pathname.endsWith("/cash-flow-templates"),
      Icon: NotebookPen,
    },
    {
      label: "Insights",
      to: ROUTE_NAMES.CASH_FLOW_PROJECTION,
      isActive: pathname.endsWith("/cash-flow-projection"),
      Icon: ChartNoAxesCombined,
    },
    {
      label: "Transactions",
      to: ROUTE_NAMES.TRANSACTIONS,
      isActive: pathname.endsWith("/transactions"),
      Icon: BookText,
    },
    {
      label: "Goals",
      to: ROUTE_NAMES.GOALS,
      isActive: pathname.endsWith("/goals"),
      Icon: Target,
    },
  ]

  return (
    <div className="flex flex-1 flex-col">
      <div className="fixed top-0 left-0 z-99 flex w-full items-center justify-between bg-(--background) px-6 py-3">
        <h1 className="text-xl font-bold">Home</h1>
        <UserAvatar />
      </div>
      <div className="mt-11 mb-20 flex flex-1 flex-col">
        <Outlet />
      </div>
      <div className="fixed bottom-0 left-0 z-99 flex w-full items-center justify-between bg-(--background) py-5 pb-5">
        {links.map(({ label, to, Icon, isActive }) => (
          <Button
            key={label}
            variant="ghost"
            className={cn(
              "flex h-8 flex-1 basis-1/5 flex-col text-xs",
              isActive && "text-primary"
            )}
            onClick={() => navigate(to)}
          >
            <Icon />
            {label}
          </Button>
        ))}
      </div>
    </div>
  )
}
