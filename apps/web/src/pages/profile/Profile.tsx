import { FullScreenLoader } from "@/components/FullScreenLoader"
import { NavBack } from "@/components/NavBack"
import { UserAvatar } from "@/components/UserAvatar"
import { useAuth } from "@/hooks/useAuth"
import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import { useQuery } from "@tanstack/react-query"
import { signOut } from "@workspace/api/auth/index"
import { getUserData } from "@workspace/api/db/users"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@workspace/ui/components/item"
import {
  AtSign,
  Banknote,
  LogOut,
  MapPinned,
  Power,
  SquareCheck,
  SquareX,
  X,
} from "lucide-react"

export function Profile() {
  const user = useAuth()
  const { replace } = useNavigator()
  const { data: userData, isPending: loading } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserData.bind(null, user.uid),
  })

  const logOut = async () => {
    await signOut()
    replace(ROUTE_NAMES.SIGN_IN)
  }

  if (!user) return

  if (loading) return <FullScreenLoader />

  return (
    <div className="flex flex-col">
      <NavBack />

      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold">Profile</h1>
        <Item className="p-0">
          <ItemContent>
            <ItemTitle>{user.displayName}</ItemTitle>
            <ItemDescription>{user.email}</ItemDescription>
          </ItemContent>
          <ItemMedia>
            <UserAvatar className="h-12 w-12" />
          </ItemMedia>
        </Item>
        <Card className="p-0">
          <Item>
            <ItemMedia>
              <AtSign />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Email Verified</ItemTitle>
            </ItemContent>
            <ItemActions>
              {user.emailVerified ? (
                <SquareCheck className="text-(--success)" />
              ) : (
                <SquareX className="text-(--destructive)" />
              )}
            </ItemActions>
          </Item>
        </Card>
        <Card className="p-0">
          <Item>
            <ItemMedia>
              <Banknote />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Currency</ItemTitle>
            </ItemContent>
            <ItemActions>{userData?.currency}</ItemActions>
          </Item>
        </Card>
        <Card className="p-0">
          <Item>
            <ItemMedia>
              <MapPinned />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Locale</ItemTitle>
            </ItemContent>
            <ItemActions>{userData?.locale}</ItemActions>
          </Item>
        </Card>
        <Card className="p-0">
          <Item>
            <ItemMedia>
              <LogOut />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Log Out</ItemTitle>
            </ItemContent>
            <ItemActions>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="xs">
                    <Power className="text-(--destructive)" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent size="sm">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be logged out of this device.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex">
                    <AlertDialogCancel>
                      <X />
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={logOut}>
                      <LogOut />
                      Log Out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </ItemActions>
          </Item>
        </Card>
      </div>
    </div>
  )
}
