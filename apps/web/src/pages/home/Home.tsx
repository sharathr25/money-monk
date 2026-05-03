import { Button } from "@workspace/ui/components/button"
import { Target, LayoutDashboard, Plus } from "lucide-react"
import { useNavigate } from "react-router"

export function Home() {
  const navigate = useNavigate()

  const links = [
    {
      label: "Cash Flow",
      to: "/cash-flow",
      Icon: LayoutDashboard,
    },
    {
      label: "Add Goal",
      to: "/add-goal",
      Icon: Plus,
    },
    {
      label: "Goals",
      to: "/goals",
      Icon: Target,
    },
  ]

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 bg-red-100">Home</div>
      <div className="flex h-16 items-center justify-between">
        {links.map(({ label, to, Icon }) => (
          <Button
            variant="ghost"
            className="flex h-8 flex-col"
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
