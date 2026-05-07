import { Button } from "@workspace/ui/components/button"
import { Target, ChartNoAxesCombined, ArrowDownUp } from "lucide-react"
import { Outlet, useNavigate } from "react-router"

export function Home() {
  const navigate = useNavigate()

  const links = [
    {
      label: "Cash Flow",
      to: "/",
      Icon: ArrowDownUp,
    },
    {
      label: "Projection",
      to: "cash-flow-projection",
      Icon: ChartNoAxesCombined,
    },
    {
      label: "Goals",
      to: "goals",
      Icon: Target,
    },
  ]

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
