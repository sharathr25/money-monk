import { FullScreenError } from "@/components/FullScreenError"
import { FullScreenLoader } from "@/components/FullScreenLoader"
import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import type { CashFlowTemplate } from "@workspace/core/types"
import { toast } from "sonner"
import { Badge } from "@workspace/ui/components/badge"
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
  Book,
  Boxes,
  Calendar,
  Check,
  Info,
  MoveDown,
  MoveLeft,
  MoveUp,
  Pen,
  RefreshCcw,
  Target,
  Trash,
  Undo,
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
  updateTransaction,
} from "@workspace/api/db/transactions"
import { DateSelector } from "@/components/DateSelector"
import { useState } from "react"

export function CashFlowTemplate() {
  const user = useAuth()
  const { templateId = "" } = useParams()
  const { goBack, navigate } = useNavigator()

  const [completedDate, setCompletedDate] = useState<Date | undefined>(
    new Date()
  )

  const {
    isPending: getApiLoading,
    data: template,
    refetch,
  } = useQuery({
    queryKey: ["add-goal", templateId],
    queryFn: getTransaction(user.uid).bind(null, templateId),
  })

  const { mutate, isPending: deleteApiLoading } = useMutation({
    mutationKey: ["delete", templateId],
    mutationFn: deleteTransaction(user.uid).bind(null, templateId),
    onSuccess: () =>
      toast.success("Delete successful.", {
        onAutoClose: goBack,
      }),
    onError: () => toast.error("Delete failed, Try again."),
  })

  const { mutate: updateTransactionApi, isPending: updateApiLoading } =
    useMutation({
      mutationKey: ["update", templateId],
      mutationFn: updateTransaction(user.uid).bind(null, templateId),
      onSuccess: () =>
        toast.success("Action successful.", {
          onAutoClose: goBack,
        }),
      onError: () => toast.error("Action failed, Try again."),
    })

  const deleteTemplate = () => {
    mutate()
  }

  if (getApiLoading) return <FullScreenLoader />

  if (!template)
    return (
      <FullScreenError msg="Cash flow template not found">
        <div className="flex gap-2">
          <Button variant="outline" onClick={goBack}>
            <MoveLeft />
            Go back
          </Button>
          <Button onClick={() => refetch}>
            <RefreshCcw />
            Refresh
          </Button>
        </div>
      </FullScreenError>
    )

  const onTransact = () => {
    updateTransactionApi({
      ...template,
      completedDate,
      status: "COMPLETED",
    })
  }

  const onUndo = () => {
    updateTransactionApi({
      ...template,
      completedDate: null,
      status: "PLANNED",
    })
  }

  const onEdit = () => {
    navigate(ROUTE_NAMES.EDIT_CASH_FLOW_TEMPLATE, {
      templateId: template.id,
    })
  }

  const itemContainerClass = "basis-1/2 py-1 odd:pr-1 even:pl-1"
  const itemClass = "bg-(--accent) p-3"

  return (
    <div className="flex flex-1 flex-col gap-2">
      <NavBack />
      <div className="gap-3 border-0 p-0">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">{template.name}</h1>
          <DynamicIcon
            name={template.icon as IconName}
            strokeWidth={1.5}
            className="size-15 text-(--primary)"
          />
        </div>
        <div className="p-0">{template.description}</div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap">
          <div className={itemContainerClass}>
            <Item className={itemClass}>
              <ItemMedia variant="icon">
                <Info />
              </ItemMedia>
              <ItemContent>
                <ItemDescription>Frquency</ItemDescription>
                <ItemTitle className="font-bold capitalize">
                  <Badge variant="secondary">
                    {template.frequency.toLowerCase().replace("_", " ")}
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
                <ItemTitle>
                  {formatAmount(template.amount, { withCurrency: true })}
                </ItemTitle>
              </ItemContent>
            </Item>
          </div>
          {template.goal?.name && (
            <div className={itemContainerClass}>
              <Item className={itemClass}>
                <ItemMedia variant="icon">
                  <Target />
                </ItemMedia>
                <ItemContent>
                  <ItemDescription>Goal</ItemDescription>
                  <ItemTitle>{template.goal?.name}</ItemTitle>
                </ItemContent>
              </Item>
            </div>
          )}
          {template.counterParty && (
            <div className={itemContainerClass}>
              <Item className={itemClass}>
                <ItemMedia variant="icon">
                  {template.type === "EXPENSE" ? (
                    <MoveUp className="text-(--destructive)" />
                  ) : (
                    <MoveDown className="text-(--success)" />
                  )}
                </ItemMedia>
                <ItemContent>
                  <ItemDescription>
                    {template.type === "EXPENSE" ? "To" : "From"}
                  </ItemDescription>
                  <ItemTitle className="capitalize">
                    {template.counterParty}
                  </ItemTitle>
                </ItemContent>
              </Item>
            </div>
          )}
          <div className={itemContainerClass}>
            <Item className={itemClass}>
              <ItemMedia variant="icon">
                <Calendar />
              </ItemMedia>
              <ItemContent>
                <ItemDescription>Created At</ItemDescription>
                <ItemTitle>{formatDate(template.createdAt)}</ItemTitle>
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
                <ItemTitle>{formatDate(template.updatedAt)}</ItemTitle>
              </ItemContent>
            </Item>
          </div>
          {template.category?.name && (
            <div className={itemContainerClass}>
              <Item className={itemClass}>
                <ItemMedia variant="icon">
                  <Boxes />
                </ItemMedia>
                <ItemContent>
                  <ItemDescription>Category</ItemDescription>
                  <ItemTitle>{template.category?.name}</ItemTitle>
                </ItemContent>
              </Item>
            </div>
          )}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 flex w-full gap-2 bg-background px-6 py-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex flex-1">
              {deleteApiLoading ? <Spinner /> : <Trash />}
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                template from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex">
              <AlertDialogCancel>
                <X />
                Don't Delete
              </AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={deleteTemplate}>
                <Trash />
                Yes, Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {template.frequency === "ONE_TIME" && template.completedDate && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                {updateApiLoading ? <Spinner /> : <Undo />}
                Undo
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Mark as Not Complete?</AlertDialogTitle>
                <AlertDialogDescription className="capitalize">
                  This template will no longer be counted as actual This
                  template will be counted as actual{" "}
                  {template.type.toLowerCase()}. You can mark it as completed
                  again at any time.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex">
                <AlertDialogCancel>
                  <X />
                  Don't Continue
                </AlertDialogCancel>
                <AlertDialogAction onClick={onUndo}>
                  <Check />
                  Yes, Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {template.frequency === "ONE_TIME" && !template.completedDate && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                {updateApiLoading ? <Spinner /> : <Book />}
                Complete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Mark as Completed?</AlertDialogTitle>
                <AlertDialogDescription className="capitalize">
                  This template will be counted as actual{" "}
                  {template.type.toLowerCase()} for the selected date.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <DateSelector setDate={setCompletedDate} date={completedDate} />
              <AlertDialogFooter className="flex">
                <AlertDialogCancel>
                  <X />
                  Don't Continue
                </AlertDialogCancel>
                <AlertDialogAction onClick={onTransact}>
                  <Check />
                  Yes, Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <Button className="flex-1" onClick={onEdit}>
          <Pen />
          Edit
        </Button>
      </div>
    </div>
  )
}
