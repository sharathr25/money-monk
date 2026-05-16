import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import { getLoggedInUser } from "@workspace/api/auth/index"
import { Button } from "@workspace/ui/components/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
} from "@workspace/ui/components/item"
import { MoveLeft } from "lucide-react"
import { UserAvatar } from "./UserAvatar"
import { useRouteLoaderData } from "react-router"

export function Header() {
  const user = getLoggedInUser()
  const { goBack, navigate } = useNavigator()

  console.log(useRouteLoaderData("app"))

  return (
    <Item size="sm" className="px-0">
      <ItemActions>
        <Button variant="ghost" onClick={goBack} className="p-0">
          <MoveLeft />
        </Button>
      </ItemActions>
      <ItemContent></ItemContent>
      {user && (
        <ItemMedia onClick={() => navigate(ROUTE_NAMES.PROFILE)}>
          <UserAvatar />
        </ItemMedia>
      )}
    </Item>
  )
}
