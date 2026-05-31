import {
  CashFlowTemplateForm,
  type CashFlowTemplateFormInputs,
} from "@/components/CashFlowTemplateForm"
import { FullScreenError } from "@/components/FullScreenError"
import { FullScreenLoader } from "@/components/FullScreenLoader"
import { NavBack } from "@/components/NavBack"
import { useAuth } from "@/hooks/useAuth"
import { useNavigator } from "@/hooks/useNavigator"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
  getCashFlowTemplate,
  updateCashFlowTemplate,
} from "@workspace/api/db/index"
import { Button } from "@workspace/ui/components/button"
import { amountToDouble, formatAmount } from "@workspace/ui/lib/utils"
import { MoveLeft, RefreshCcw } from "lucide-react"
import type { SubmitHandler } from "react-hook-form"
import { useParams } from "react-router"
import { toast } from "sonner"

export function EditCashFlowTemplate() {
  const user = useAuth()
  const { templateId = "" } = useParams()
  const { goBack } = useNavigator()

  const {
    isPending: queryApiLoading,
    data: template,
    refetch,
  } = useQuery({
    queryKey: [templateId],
    queryFn: getCashFlowTemplate(user.uid).bind(null, { id: templateId }),
  })

  const { mutate, isPending: updateApiLoading } = useMutation({
    mutationKey: [templateId],
    mutationFn: updateCashFlowTemplate(user.uid).bind(null, templateId),
    onSuccess: () =>
      toast.success("Update successful.", {
        onAutoClose: goBack,
      }),
    onError: () => toast.error("Update failed, Try again."),
  })

  const onSubmit: SubmitHandler<CashFlowTemplateFormInputs> = async (data) => {
    const { amount, day, ...rest } = data
    mutate({
      ...rest,
      amount: amountToDouble(amount),
      day: day ? parseInt(day) : undefined,
    })
  }

  if (queryApiLoading) return <FullScreenLoader />

  if (!template)
    return (
      <FullScreenError msg="Cash flow template not found">
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
      <div>
        <h1 className="text-xl font-bold">Edit Cash Flow</h1>
        <p className="text-sm">Edit your recurring/one-time income/expense</p>
      </div>
      <CashFlowTemplateForm
        formInputs={{
          ...template,
          amount: formatAmount(`${template.amount}`),
          date: template.date || undefined,
          day: template.day ? `${template.day}` : undefined,
        }}
        onSubmit={onSubmit}
        loading={updateApiLoading}
      />
    </div>
  )
}
