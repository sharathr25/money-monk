import { UserAvatar } from "@/components/UserAvatar"
import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import { Button } from "@workspace/ui/components/button"
import {
  Target,
  ChartNoAxesCombined,
  ArrowDownUp,
  LayoutDashboard,
} from "lucide-react"
import { Outlet } from "react-router"

export function Home() {
  const { navigate } = useNavigator()

  const links = [
    {
      label: "Cash Flow",
      to: ROUTE_NAMES.ROOT,
      Icon: ArrowDownUp,
    },
    {
      label: "Templates",
      to: ROUTE_NAMES.CASH_FLOW_TEMPLATES,
      Icon: LayoutDashboard,
    },
    {
      label: "Projection",
      to: ROUTE_NAMES.CASH_FLOW_PROJECTION,
      Icon: ChartNoAxesCombined,
    },
    {
      label: "Goals",
      to: ROUTE_NAMES.GOALS,
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
        {links.map(({ label, to, Icon }) => (
          <Button
            key={label}
            variant="ghost"
            className="flex h-8 flex-1 basis-1/4 flex-col"
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
