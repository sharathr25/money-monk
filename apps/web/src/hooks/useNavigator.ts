import { useNavigate, type NavigateOptions } from "react-router"
import { type RouteName } from "@/routes"

export const useNavigator = () => {
  const _navigate = useNavigate()

  const navigate = (
    routeName: RouteName,
    pathParams: Record<string, string> = {},
    options: NavigateOptions = {}
  ) => {
    _navigate(getTo(routeName, pathParams), options)
  }

  const goBack = () => {
    _navigate(-1)
  }

  const replace = (
    routeName: RouteName,
    pathParams: Record<string, string> = {}
  ) => {
    _navigate(getTo(routeName, pathParams), { replace: true })
  }

  const getTo = (
    routeName: RouteName,
    pathParams: Record<string, string> = {}
  ) => {
    let to = `${routeName}`
    Object.keys(pathParams).forEach((k) => {
      to = routeName.replace(`:${k}`, pathParams[k])
    })
    return to
  }

  return { navigate, replace, goBack }
}
