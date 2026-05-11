import {
  CashFlowTemplateForm,
  type CashFlowTemplateFormInputs,
} from "@/components/CashFlowTemplateForm"
import { getLoggedInUser } from "@workspace/api/auth/index"
import {
  getCashFlowTemplate,
  updateCashFlowTemplate,
} from "@workspace/api/db/index"
import type { CashFlowTemplate } from "@workspace/core/types"
import { amountToDouble } from "@workspace/ui/lib/utils"
import { useEffect, useState } from "react"
import type { SubmitHandler } from "react-hook-form"
import { useParams } from "react-router"

export function EditCashFlowTemplate() {
  const user = getLoggedInUser()
  const [template, setTemplate] = useState<CashFlowTemplate>()
  const { templateId } = useParams()
  const cashFlowTemplateId = templateId || ""

  useEffect(() => {
    getCashFlowTemplate({ uid: user.uid, id: cashFlowTemplateId }).then(
      setTemplate
    )
  }, [])

  const onSubmit: SubmitHandler<CashFlowTemplateFormInputs> = async (data) => {
    try {
      const { iconNameFilter, ...rest } = data
      await updateCashFlowTemplate(cashFlowTemplateId, {
        ...rest,
        amount: amountToDouble(rest.amount),
      })
    } catch (error) {
      console.error(error)
    }
  }

  if (!template) return null

  return (
    <div className="flex flex-1 flex-col gap-2">
      <div>
        <h1 className="text-xl font-bold">Edit Cash Flow</h1>
        <p className="text-sm">Edit your recurring/one-time income/expense</p>
      </div>
      <CashFlowTemplateForm
        formInputs={{
          ...template,
          amount: `${template.amount}`,
          date: template.date || undefined,
        }}
        onSubmit={onSubmit}
      />
    </div>
  )
}
