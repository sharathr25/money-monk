import { Button } from "@workspace/ui/components/button"
import { Plus } from "lucide-react"
import { useNavigate } from "react-router"

export function CashFlow() {
  const navigate = useNavigate()
  return (
    <div>
      <Button
        className="fixed right-4 bottom-4 z-99 h-12 w-12 rounded-full"
        onClick={() => navigate("/manage-cash-flow")}
      >
        <Plus />
      </Button>
    </div>
  )
}
