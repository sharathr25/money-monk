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
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@workspace/ui/components/item"

import { formatAmount, formatDateTime } from "@workspace/ui/lib/utils"
import {
  Banknote,
  Calendar,
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
import { useMutation, useQuery } from "@tanstack/react-query"
import {
  deleteTransaction,
  getTransaction,
} from "@workspace/api/db/transactions"

export function Transaction() {
  const { transactionId = "" } = useParams()
  const { goBack, navigate } = useNavigator()
  const user = useAuth()
  const getTransactionForUser = getTransaction(user.uid)
  const deleteTransactionForUser = deleteTransaction(user.uid)

  const {
    isPending: getGoalPending,
    error: getGoalError,
    data: transaction,
    refetch,
  } = useQuery({
    queryKey: ["transaction-" + transactionId],
    queryFn: async () => getTransactionForUser(transactionId),
  })

  const { mutate, isPending: deleteGoalPending } = useMutation({
    mutationFn: async () => deleteTransactionForUser(transactionId),
    onSuccess: () =>
      toast.success("Successfully deleted.", { onAutoClose: goBack }),
    onError: () => toast.error("Delete failed, Try again."),
  })

  const onEdit = () => {
    navigate(ROUTE_NAMES.EDIT_TRANSACTION, {
      transactionId,
    })
  }

  const onDeleteContinue = () => {
    mutate()
  }

  if (getGoalPending) return <FullScreenLoader />

  if (getGoalError) return <FullScreenError msg="Something went wrong" />

  if (!transaction)
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
    <div className="flex flex-1 flex-col gap-2">
      <NavBack />
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>
            <h1 className="flex items-center gap-1 text-xl font-bold">
              {transaction.name}
            </h1>
          </CardTitle>
          <CardDescription>{transaction.description}</CardDescription>
          <CardAction>
            <DynamicIcon
              name={transaction.icon as IconName}
              className="size-8"
            />
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="flex-1 bg-(--primary) text-(--secondary)">
        <CardContent className="flex flex-col gap-2">
          <Item>
            <ItemMedia variant="icon">
              <Banknote />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Amount</ItemTitle>
              <ItemDescription className="text-(--secondary)">
                {formatAmount(transaction.amount, { withCurrency: true })}
              </ItemDescription>
            </ItemContent>
          </Item>
          {transaction.goal && (
            <Item>
              <ItemMedia variant="icon">
                <Banknote />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>For goal</ItemTitle>
                <ItemDescription className="text-(--secondary)">
                  {transaction.goal.name}
                </ItemDescription>
              </ItemContent>
            </Item>
          )}
          {transaction.templateId && (
            <Item>
              <ItemMedia variant="icon">
                <Banknote />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>From template</ItemTitle>
                <ItemDescription className="text-(--secondary)">
                  {transaction.templateId}
                </ItemDescription>
              </ItemContent>
            </Item>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col">
          <Item>
            <ItemMedia variant="icon">
              <Calendar />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Created At</ItemTitle>
              <ItemDescription>
                {formatDateTime(transaction.createdAt)}
              </ItemDescription>
            </ItemContent>
          </Item>
          <Item>
            <ItemMedia variant="icon">
              <Calendar />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Updated At</ItemTitle>
              <ItemDescription>
                {formatDateTime(transaction.updatedAt)}
              </ItemDescription>
            </ItemContent>
          </Item>
        </CardContent>
      </Card>
      <div className="flex gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="h-11 flex-1">
              {deleteGoalPending ? <Spinner /> : <Trash />}
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                transaction from our servers.
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
        <Button className="h-11 flex-1" onClick={onEdit}>
          <Pen />
          Edit
        </Button>
      </div>
    </div>
  )
}
