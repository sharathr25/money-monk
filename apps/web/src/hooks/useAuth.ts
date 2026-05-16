import { AuthContext } from "@/contexts/AuthContext"
import type { User } from "firebase/auth"
import { useContext } from "react"

export function useAuth(): User {
  const user = useContext(AuthContext)

  if (!user) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return user
}
