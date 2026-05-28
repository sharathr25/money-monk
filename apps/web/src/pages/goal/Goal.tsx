import { FullScreenError } from "@/components/FullScreenError"
import { FullScreenLoader } from "@/components/FullScreenLoader"
import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"
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
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@workspace/ui/components/item"

import { formatAmount, formatDate } from "@workspace/ui/lib/utils"
import {
  Banknote,
  Calendar,
  Info,
  MoveLeft,
  Pen,
  RefreshCcw,
  Trash,
  X,
} from "lucide-react"
import { DynamicIcon, type IconName } from "lucide-react/dynamic"
import { useParams } from "react-router"
import { Spinner } from "@workspace/ui/components/spinner"
import { NavBack } from "@/components/NavBack"
import { useAuth } from "@/hooks/useAuth"
import { deleteGoal, getGoal } from "@workspace/api/db/goals"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Badge } from "@workspace/ui/components/badge"
import { GoalTransactions } from "./GoalTransactions"
import { GoalAllocation } from "./GoalAllocation"

export function Goal() {
  const { goalId = "" } = useParams()
  const { goBack, navigate } = useNavigator()
  const user = useAuth()
  const getGoalForUser = getGoal(user.uid)
  const deleteGoalForUser = deleteGoal(user.uid)

  const {
    isPending: getGoalPending,
    error: getGoalError,
    data: goal,
    refetch,
  } = useQuery({
    queryKey: ["goal-" + goalId],
    queryFn: async () => getGoalForUser(goalId),
  })

  const { mutate, isPending: deleteGoalPending } = useMutation({
    mutationFn: async () => deleteGoalForUser(goalId),
    onSuccess: () =>
      toast.success("Successfully deleted.", { onAutoClose: goBack }),
    onError: () => toast.error("Delete failed, Try again."),
  })

  const onEdit = () => {
    navigate(ROUTE_NAMES.EDIT_GOAL, {
      goalId,
    })
  }

  const onDeleteContinue = () => {
    mutate()
  }

  const itemContainerClass = "basis-1/2 py-1 odd:pr-1 even:pl-1"
  const itemClass = "bg-(--accent) p-3"

  if (getGoalPending) return <FullScreenLoader />

  if (getGoalError) return <FullScreenError msg="Something went wrong" />

  if (!goal)
    return (
      <FullScreenError msg="Goal not found">
        <div className="flex gap-2">
          <Button variant="outline" onClick={goBack}>
            <MoveLeft />
            Go back
          </Button>
          <Button onClick={() => refetch()}>
            <RefreshCcw />
            Refresh
          </Button>
        </div>
      </FullScreenError>
    )

  return (
    <div className="flex flex-1 flex-col gap-2 pb-15">
      <NavBack />
      <div className="gap-3 border-0 p-0">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">{goal.name}</h1>
          <DynamicIcon
            name={goal.icon as IconName}
            strokeWidth={1.5}
            className="size-15 text-(--primary)"
          />
        </div>
        <div className="p-0">{goal.description}</div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap">
          <div className={itemContainerClass}>
            <Item className={itemClass}>
              <ItemMedia variant="icon">
                <Info />
              </ItemMedia>
              <ItemContent>
                <ItemDescription>Status</ItemDescription>
                <ItemTitle className="font-bold capitalize">
                  <Badge variant="secondary">
                    {goal.status.toLowerCase().replace("_", " ")}
                  </Badge>
                </ItemTitle>
              </ItemContent>
            </Item>
          </div>
          <div className={itemContainerClass}>
            <Item className={itemClass}>
              <ItemMedia variant="icon">
                <Banknote />
              </ItemMedia>
              <ItemContent>
                <ItemDescription>Estimated</ItemDescription>
                <ItemTitle>
                  {formatAmount(goal.estimatedAmount, { withCurrency: true })}
                </ItemTitle>
              </ItemContent>
            </Item>
          </div>
          <div className={itemContainerClass}>
            <Item className={itemClass}>
              <ItemMedia variant="icon">
                <Banknote />
              </ItemMedia>
              <ItemContent>
                <ItemDescription>Saved</ItemDescription>
                <ItemTitle>{formatAmount(0, { withCurrency: true })}</ItemTitle>
              </ItemContent>
            </Item>
          </div>
          <div className={itemContainerClass}>
            <Item className={itemClass}>
              <ItemMedia variant="icon">
                <Banknote />
              </ItemMedia>
              <ItemContent>
                <ItemDescription>Actual</ItemDescription>
                <ItemTitle>{formatAmount(0, { withCurrency: true })}</ItemTitle>
              </ItemContent>
            </Item>
          </div>
          <div className={itemContainerClass}>
            <Item className={itemClass}>
              <ItemMedia variant="icon">
                <Calendar />
              </ItemMedia>
              <ItemContent>
                <ItemDescription>Created At</ItemDescription>
                <ItemTitle>{formatDate(goal.createdAt)}</ItemTitle>
              </ItemContent>
            </Item>
          </div>
          <div className={itemContainerClass}>
            <Item className={itemClass}>
              <ItemMedia variant="icon">
                <Calendar />
              </ItemMedia>
              <ItemContent>
                <ItemDescription>Updated At</ItemDescription>
                <ItemTitle>{formatDate(goal.updatedAt)}</ItemTitle>
              </ItemContent>
            </Item>
          </div>
        </div>
        <GoalAllocation breakdown={goal.breakdown} />
        <GoalTransactions goalId={goalId} />
      </div>
      <div className="fixed bottom-0 left-0 flex w-full gap-2 p-6">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="flex flex-1">
              {deleteGoalPending ? <Spinner /> : <Trash />}
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                goal from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex">
              <AlertDialogCancel>
                <X />
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={onDeleteContinue}
              >
                <Trash />
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button className="flex-1" onClick={onEdit}>
          <Pen />
          Edit
        </Button>
      </div>
    </div>
  )
}
