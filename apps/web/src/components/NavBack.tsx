import { useNavigator } from "@/hooks/useNavigator"
import { Button } from "@workspace/ui/components/button"
import { MoveLeft } from "lucide-react"

export function NavBack() {
  const { goBack } = useNavigator()

  return (
    <div>
      <Button
        variant="outline"
        onClick={goBack}
        className="fixed z-99 border-(--primary) bg-transparent"
      >
        <MoveLeft className="text-(--primary)" />
      </Button>
      <Button variant="ghost" disabled className="opacity-0"></Button>
    </div>
  )
}
