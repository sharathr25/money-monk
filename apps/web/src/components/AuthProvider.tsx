import { AuthContext } from "@/contexts/AuthContext"
import { ROUTE_NAMES } from "@/routes"
import { getLoggedInUser } from "@workspace/api/auth/index"
import { Outlet, redirect } from "react-router"

export const AuthProvider = () => {
  const user = getLoggedInUser()

  if (!user) {
    throw redirect(ROUTE_NAMES.SIGN_IN)
  }

  return (
    <AuthContext.Provider value={user}>
      <Outlet />
    </AuthContext.Provider>
  )
}
