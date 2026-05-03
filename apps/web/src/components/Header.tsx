import { Button } from "@workspace/ui/components/button"
import { MoveLeft } from "lucide-react"
import { useLocation, useNavigate } from "react-router"

export function Header() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const paths = pathname.split("/")
  const currentRoute = paths[paths.length - 1]
  const routeName =
    currentRoute === "" ? "home" : currentRoute.replaceAll("-", " ")

  return (
    <div className="my-2 flex items-center gap-2">
      {pathname !== "/" && (
        <Button variant="ghost" onClick={() => navigate(-1)} className="p-0">
          <MoveLeft />
        </Button>
      )}
      <div className="capitalize">{routeName.toLowerCase()}</div>
    </div>
  )
}
