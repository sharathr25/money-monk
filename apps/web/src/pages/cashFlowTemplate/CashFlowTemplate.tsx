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
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@workspace/ui/components/item"

import {
  formatAmount,
  formatDate,
  formatDateTime,
  formatDayOfMonth,
} from "@workspace/ui/lib/utils"
import {
  Calendar,
  MoveLeft,
  Pen,
  RefreshCcw,
  Repeat,
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

  return (
    <div className="flex flex-1 flex-col gap-3">
      <NavBack />
      <Card className="flex flex-1 items-center justify-center bg-(--primary) p-10 text-(--secondary)">
        <DynamicIcon
          name={template.icon as IconName}
          strokeWidth={0.5}
          className="size-25"
        />
      </Card>
      <div>
        <div className="flex justify-between">
          <div>
            <h1 className="text-xl font-bold">{template.name}</h1>
            <p className="text-sm">{template.description}</p>
          </div>
          <div className="flex flex-col items-end">
            <h2 className="font-bold">
              {formatAmount(template.amount, { withCurrency: true })}
            </h2>
            {template.type === "EXPENSE" ? (
              <Badge className="bg-(--destructive)">{template.type}</Badge>
            ) : (
              <Badge className="bg-(--success)">{template.type}</Badge>
            )}
          </div>
        </div>
      </div>
      <Card>
        <CardContent className="flex flex-col">
          <Item>
            <ItemMedia variant="icon">
              <Calendar />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Created At</ItemTitle>
              <ItemDescription>
                {formatDateTime(template.createdAt)}
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
                {formatDateTime(template.updatedAt)}
              </ItemDescription>
            </ItemContent>
          </Item>
          <div className="flex">
            <Item>
              <ItemMedia variant="icon">
                <Repeat />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Frequency</ItemTitle>
                <ItemDescription>
                  <span className="capitalize">
                    {template.frequency.replace("_", " ").toLowerCase()}
                  </span>
                  {!!template.date && " - " + formatDate(template.date)}
                  {!!template.day && " - On " + formatDayOfMonth(template.day)}
                </ItemDescription>
              </ItemContent>
            </Item>
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="h-11 flex-1">
              {deleteApiLoading ? <Spinner /> : <Trash />}
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                cash flow template from our servers.
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
        <Button
          className="h-11 flex-1"
          onClick={() =>
            navigate(ROUTE_NAMES.EDIT_CASH_FLOW_TEMPLATE, {
              templateId: template.id,
            })
          }
        >
          <Pen />
          Edit
        </Button>
      </div>
    </div>
  )
}
