import { AuthContext } from "@/contexts/AuthContext"
import { ROUTE_NAMES } from "@/routes"
import { getLoggedInUser } from "@workspace/api/auth/index"
import { useEffect } from "react"
import { Outlet } from "react-router"
import { FullScreenLoader } from "./FullScreenLoader"
import { useNavigator } from "@/hooks/useNavigator"

export const AuthProvider = () => {
  const { replace } = useNavigator()
  const user = getLoggedInUser()

  useEffect(() => {
    if (!user) {
      replace(ROUTE_NAMES.SIGN_IN)
    }
  }, [user])

  if (!user) return <FullScreenLoader />

  return (
    <AuthContext.Provider value={user}>
      <Outlet />
    </AuthContext.Provider>
  )
}
