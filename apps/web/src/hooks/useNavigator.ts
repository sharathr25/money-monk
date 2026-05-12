import { useNavigate } from "react-router"
import { type RouteName } from "@/routes"

export const useNavigator = () => {
  const _navigate = useNavigate()

  const navigate = (
    routeName: RouteName,
    pathParams: Record<string, string> = {}
  ) => {
    let to = `${routeName}`
    Object.keys(pathParams).forEach((k) => {
      to = routeName.replace(`:${k}`, pathParams[k])
    })
    _navigate(to)
  }

  const goBack = () => {
    _navigate(-1)
  }

  return { navigate, goBack }
}
