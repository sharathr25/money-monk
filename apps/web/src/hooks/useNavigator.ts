import { useNavigate } from "react-router"
import { type RouteName } from "@/routes"

export const useNavigator = () => {
  const _navigate = useNavigate()

  const navigate = (routeName: RouteName) => {
    _navigate(routeName)
  }

  const goBack = () => {
    _navigate(-1)
  }

  return { navigate, goBack }
}
