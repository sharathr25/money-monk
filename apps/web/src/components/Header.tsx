import { useNavigator } from "@/hooks/useNavigator"
import { Button } from "@workspace/ui/components/button"
import { MoveLeft } from "lucide-react"

export function Header() {
  const { goBack } = useNavigator()

  return (
    <div className="my-2 flex items-center gap-2">
      {true && (
        <Button variant="ghost" onClick={goBack} className="p-0">
          <MoveLeft />
        </Button>
      )}
    </div>
  )
}
