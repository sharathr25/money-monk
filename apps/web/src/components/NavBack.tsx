import { useNavigator } from "@/hooks/useNavigator"
import { Button } from "@workspace/ui/components/button"
import { MoveLeft } from "lucide-react"

export function NavBack() {
  const { goBack } = useNavigator()

  return (
    <div>
      <MoveLeft className="fixed z-99 text-(--primary)" onClick={goBack} />
      <Button variant="ghost" disabled className="opacity-0" size="sm"></Button>
    </div>
  )
}
