import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import { signInWithGoogle } from "@workspace/api/auth/index"
import { Button } from "@workspace/ui/components/button"

export function SignIn() {
  const navigate = useNavigator()

  const onClick = async () => {
    await signInWithGoogle()
    navigate.navigate(ROUTE_NAMES.ROOT)
  }

  return (
    <div className="flex">
      <h1 className="font-medium">SignIn</h1>
      <Button onClick={onClick}>Login with google</Button>
    </div>
  )
}
