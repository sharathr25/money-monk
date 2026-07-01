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
  BookCopy,
  Boxes,
  Calendar,
  Info,
  MoveLeft,
  Pen,
  RefreshCcw,
  Target,
  Trash,
  User,
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
import { Badge } from "@workspace/ui/components/badge"

export function Transaction() {
  const { transactionId = "" } = useParams()
  const { goBack, navigate } = useNavigator()
  const user = useAuth()
  const getTransactionForUser = getTransaction(user.uid)
  const deleteTransactionForUser = deleteTransaction(user.uid)

  const {
    isPending: getTransactionPending,
    error: getTransactionError,
    data: transaction,
    refetch,
  } = useQuery({
    queryKey: ["transaction-" + transactionId],
    queryFn: async () => getTransactionForUser(transactionId),
  })

  const { mutate, isPending: deleteTransactionPending } = useMutation({
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

  const onClone = () => {
    navigate(
      ROUTE_NAMES.CLONE_TRANSACTION,
      {
        transactionId,
      },
      { state: { transaction } }
    )
  }

  const onDeleteContinue = () => {
    mutate()
  }

  const itemContainerClass = "basis-1/2 py-1 odd:pr-1 even:pl-1"
  const itemClass = "bg-(--accent) p-3"

  if (getTransactionPending) return <FullScreenLoader />

  if (getTransactionError) return <FullScreenError msg="Something went wrong" />

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
      <div className="gap-3 border-0 p-0">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold capitalize">{transaction.name}</h1>
          <DynamicIcon
            name={transaction.icon as IconName}
            strokeWidth={1.5}
            className="size-15 text-(--primary)"
          />
        </div>
        <div className="p-0">{transaction.description}</div>
      </div>
      <div className="flex flex-wrap">
        <div className={itemContainerClass}>
          <Item className={itemClass}>
            <ItemMedia variant="icon">
              <Info />
            </ItemMedia>
            <ItemContent>
              <ItemDescription>Type</ItemDescription>
              <ItemTitle className="font-bold capitalize">
                <Badge variant="secondary">
                  {transaction.type.toLowerCase().replace("_", " ")}
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
              <ItemDescription>Amount</ItemDescription>
              <ItemTitle className="font-bold capitalize">
                {formatAmount(transaction.amount, { withCurrency: true })}
              </ItemTitle>
            </ItemContent>
          </Item>
        </div>
        <div className={itemContainerClass}>
          <Item className={itemClass}>
            <ItemMedia variant="icon">
              <Calendar />
            </ItemMedia>
            <ItemContent>
              <ItemDescription>Paid On</ItemDescription>
              <ItemTitle className="font-bold capitalize">
                {formatDate(transaction.completedDate || new Date())}
              </ItemTitle>
            </ItemContent>
          </Item>
        </div>
        {transaction.counterParty && (
          <div className={itemContainerClass}>
            <Item className={itemClass}>
              <ItemMedia variant="icon">
                <User />
              </ItemMedia>
              <ItemContent>
                <ItemDescription>Paid To</ItemDescription>
                <ItemTitle className="font-bold capitalize">
                  {transaction.counterParty}
                </ItemTitle>
              </ItemContent>
            </Item>
          </div>
        )}
        {transaction.goal && (
          <div className={itemContainerClass}>
            (
            <Item className={itemClass}>
              <ItemMedia variant="icon">
                <Target />
              </ItemMedia>
              <ItemContent>
                <ItemDescription>Goal</ItemDescription>
                <ItemTitle className="font-bold capitalize">
                  {transaction.goal.name}
                </ItemTitle>
              </ItemContent>
            </Item>
            )
          </div>
        )}
        {transaction.category && (
          <div className={itemContainerClass}>
            (
            <Item className={itemClass}>
              <ItemMedia variant="icon">
                <Boxes />
              </ItemMedia>
              <ItemContent>
                <ItemDescription>Category</ItemDescription>
                <ItemTitle className="line-clamp-1 font-bold capitalize">
                  {transaction.category.name}
                </ItemTitle>
              </ItemContent>
            </Item>
            )
          </div>
        )}
        <div className={itemContainerClass}>
          <Item className={itemClass}>
            <ItemMedia variant="icon">
              <Calendar />
            </ItemMedia>
            <ItemContent>
              <ItemDescription>Created At</ItemDescription>
              <ItemTitle className="font-bold">
                {formatDate(transaction.createdAt)}
              </ItemTitle>
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
              <ItemTitle className="font-bold">
                {formatDate(transaction.updatedAt)}
              </ItemTitle>
            </ItemContent>
          </Item>
        </div>
      </div>
      {transaction.type !== "ADJUSTMENT" && (
        <div className="fixed bottom-0 left-0 flex w-full gap-2 bg-background px-6 py-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex flex-1">
                {deleteTransactionPending ? <Spinner /> : <Trash />}
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your transaction from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex">
                <AlertDialogCancel>
                  <X />
                  Don't Delete
                </AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={onDeleteContinue}
                >
                  <Trash />
                  Yes, Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button className="flex-1" variant="outline" onClick={onClone}>
            <BookCopy />
            Clone
          </Button>
          <Button className="flex-1" onClick={onEdit}>
            <Pen />
            Edit
          </Button>
        </div>
      )}
    </div>
  )
}
