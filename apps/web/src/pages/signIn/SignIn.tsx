import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import { signInWithGoogle } from "@workspace/api/auth/index"
import { Button } from "@workspace/ui/components/button"
import { LogIn } from "lucide-react"

export function SignIn() {
  const navigate = useNavigator()

  const onClick = async () => {
    await signInWithGoogle()
    navigate.navigate(ROUTE_NAMES.ROOT)
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <div>
        <h1 className="text-xl font-bold">Sign In</h1>
        <p className="text-sm">Welcome to MoneyMonk 👋</p>
      </div>
      <Button onClick={onClick}>
        <LogIn />
        Login With Google
      </Button>
    </div>
  )
}
