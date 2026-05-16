import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import type { AvatarProps } from "@radix-ui/react-avatar"
import { getLoggedInUser } from "@workspace/api/auth/index"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { User } from "lucide-react"

export function UserAvatar(
  props: AvatarProps & {
    size?: "default" | "sm" | "lg"
  }
) {
  const { navigate } = useNavigator()
  const user = getLoggedInUser()

  if (!user) return null

  return (
    <Avatar {...props} onClick={() => navigate(ROUTE_NAMES.PROFILE)}>
      {user.photoURL && (
        <AvatarImage src={user.photoURL!} alt={user.displayName!} />
      )}
      <AvatarFallback>
        {user.displayName ? user.displayName.charAt(0) : <User />}
      </AvatarFallback>
    </Avatar>
  )
}
