import {
  CashFlowTemplateForm,
  type CashFlowTemplateFormInputs,
} from "@/components/CashFlowTemplateForm"
import { FullScreenError } from "@/components/FullScreenError"
import { FullScreenLoader } from "@/components/FullScreenLoader"
import { useNavigator } from "@/hooks/useNavigator"
import { getLoggedInUser } from "@workspace/api/auth/index"
import {
  getCashFlowTemplate,
  updateCashFlowTemplate,
} from "@workspace/api/db/index"
import type { CashFlowTemplate } from "@workspace/core/types"
import { Button } from "@workspace/ui/components/button"
import { amountToDouble, formatAmount } from "@workspace/ui/lib/utils"
import { MoveLeft, RefreshCcw } from "lucide-react"
import { useEffect, useState } from "react"
import type { SubmitHandler } from "react-hook-form"
import { useParams } from "react-router"
import { toast } from "sonner"

export function EditCashFlowTemplate() {
  const user = getLoggedInUser()
  const { templateId } = useParams()
  const { goBack } = useNavigator()

  const [template, setTemplate] = useState<CashFlowTemplate>()
  const [loading, setLoading] = useState(false)
  const [updateApiLoading, setUpdateApiLoading] = useState(false)

  const cashFlowTemplateId = templateId || ""

  const init = async () => {
    try {
      setLoading(true)
      const cashFlowTemplate = await getCashFlowTemplate({
        uid: user.uid,
        id: cashFlowTemplateId,
      })
      if (cashFlowTemplate) {
        setTemplate(cashFlowTemplate)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    init()
  }, [])

  const onSubmit: SubmitHandler<CashFlowTemplateFormInputs> = async (data) => {
    try {
      setUpdateApiLoading(true)
      const { iconNameFilter, ...rest } = data
      await updateCashFlowTemplate(cashFlowTemplateId, {
        ...rest,
        amount: amountToDouble(rest.amount),
      })
      toast.success("Update successful.", {
        onAutoClose() {
          goBack()
        },
      })
    } catch (error) {
      console.error(error)
      toast.error("Update failed, Try again.")
    } finally {
      setUpdateApiLoading(false)
    }
  }

  if (loading) return <FullScreenLoader />

  if (!template)
    return (
      <FullScreenError msg="Cash flow template not found">
        <div className="flex gap-2">
          <Button variant="outline" onClick={goBack}>
            <MoveLeft />
            Go back
          </Button>
          <Button onClick={init}>
            <RefreshCcw />
            Refresh
          </Button>
        </div>
      </FullScreenError>
    )

  return (
    <div className="flex flex-1 flex-col gap-2">
      <div>
        <h1 className="text-xl font-bold">Edit Cash Flow</h1>
        <p className="text-sm">Edit your recurring/one-time income/expense</p>
      </div>
      <CashFlowTemplateForm
        formInputs={{
          ...template,
          amount: formatAmount(`${template.amount}`, false),
          date: template.date || undefined,
        }}
        onSubmit={onSubmit}
        loading={updateApiLoading}
      />
    </div>
  )
}
