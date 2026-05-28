import { FullScreenError } from "@/components/FullScreenError"
import { FullScreenLoader } from "@/components/FullScreenLoader"
import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import {
  deleteCashFlowTemplate,
  getCashFlowTemplate,
} from "@workspace/api/db/index"
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
import { useMutation, useQuery } from "@tanstack/react-query"

export function CashFlowTemplate() {
  const user = useAuth()
  const { templateId = "" } = useParams()
  const { goBack, navigate } = useNavigator()

  const {
    isPending: getApiLoading,
    data: template,
    refetch,
  } = useQuery({
    queryKey: ["add-goal", templateId],
    queryFn: getCashFlowTemplate(user.uid).bind(null, { id: templateId }),
  })

  const { mutate, isPending: deleteApiLoading } = useMutation({
    mutationKey: [templateId],
    mutationFn: deleteCashFlowTemplate(user.uid).bind(null, templateId),
    onSuccess: () =>
      toast.success("Delete successful.", {
        onAutoClose: goBack,
      }),
    onError: () => toast.error("Delete failed, Try again."),
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
        </div>
      </div>
      <div className="fixed bottom-0 left-0 flex w-full gap-2 p-6">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="flex flex-1">
              {deleteApiLoading ? <Spinner /> : <Trash />}
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
              <AlertDialogAction variant="destructive" onClick={deleteTemplate}>
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
