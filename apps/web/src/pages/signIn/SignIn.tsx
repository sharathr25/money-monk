import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import { signInWithGoogle } from "@workspace/api/auth/index"
import { Button } from "@workspace/ui/components/button"
import { Spinner } from "@workspace/ui/components/spinner"
import { LogIn } from "lucide-react"
import { useState } from "react"

export function SignIn() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigator()

  const onClick = async () => {
    try {
      setLoading(true)
      await signInWithGoogle()
      navigate.navigate(ROUTE_NAMES.ROOT)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <div>
        <h1 className="text-xl font-bold">Sign In</h1>
        <p className="text-sm">Welcome to MoneyMonk 👋</p>
      </div>
      <Button onClick={onClick} disabled={loading}>
        {loading ? <Spinner /> : <LogIn />}
        Login With Google
      </Button>
    </div>
  )
}
