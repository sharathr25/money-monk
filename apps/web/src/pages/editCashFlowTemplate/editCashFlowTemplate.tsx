import { CashFlowTemplateForm } from "@/components/CashFlowTemplateForm"
import { getLoggedInUser } from "@workspace/api/auth/index"
import { getCashFlowTemplate } from "@workspace/api/db/index"
import type { CashFlowTemplate } from "@workspace/core/types"
import { useEffect, useState } from "react"
import { useParams } from "react-router"

export function EditCashFlowTemplate() {
  const user = getLoggedInUser()
  const [template, setTemplate] = useState<CashFlowTemplate>()
  const { templateId } = useParams()

  useEffect(() => {
    getCashFlowTemplate({ uid: user.uid, id: templateId || "" }).then(
      setTemplate
    )
  }, [])

  if (!template) return null

  return (
    <div className="flex flex-1 flex-col gap-2">
      <div>
        <h1 className="text-xl font-bold">Edit Cash Flow</h1>
        <p className="text-sm">Edit your recurring/one-time income/expense</p>
      </div>
      <CashFlowTemplateForm
        defaultValues={{
          ...template,
          amount: `${template.amount}`,
          date: template.date || undefined,
        }}
        onSubmit={() => {}}
      />
    </div>
  )
}
