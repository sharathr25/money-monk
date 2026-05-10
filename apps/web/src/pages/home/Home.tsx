import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import { getLoggedInUser } from "@workspace/api/auth/index"
import { Button } from "@workspace/ui/components/button"
import { Target, ChartNoAxesCombined, ArrowDownUp } from "lucide-react"
import { useEffect } from "react"
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

  useEffect(() => {
    console.log(getLoggedInUser())
  }, [])

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-20 flex flex-1 flex-col">
        <Outlet />
      </div>
      <div className="fixed bottom-0 left-0 flex h-16 w-full items-center justify-between bg-(--background)">
        {links.map(({ label, to, Icon }) => (
          <Button
            key={label}
            variant="ghost"
            className="flex h-8 basis-1/3 flex-col"
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
