import { useNavigator } from "@/hooks/useNavigator"
import { Button } from "@workspace/ui/components/button"
import { MoveLeft } from "lucide-react"
import { useLocation } from "react-router"

export function Header() {
  const { goBack } = useNavigator()
  const location = useLocation()
  const { pathname } = location

  const paths = pathname.split("/")
  const currentRoute = paths[paths.length - 1]
  const routeName =
    currentRoute === "" ? "cash flow" : currentRoute.replaceAll("-", " ")

  return (
    <div className="my-2 flex items-center gap-2">
      {true && (
        <Button variant="ghost" onClick={goBack} className="p-0">
          <MoveLeft />
        </Button>
      )}
      <div className="capitalize">{routeName.toLowerCase()}</div>
    </div>
  )
}
