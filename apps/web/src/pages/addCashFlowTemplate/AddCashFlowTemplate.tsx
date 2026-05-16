import { type SubmitHandler } from "react-hook-form"
import { toast } from "sonner"
import { saveCashFlowTemplate } from "@workspace/api/db/index"
import type { Frequency, Type } from "@workspace/core/type/index"
import { amountToDouble } from "@workspace/ui/lib/utils"
import { CashFlowTemplateForm } from "@/components/CashFlowTemplateForm"
import { useState } from "react"
import { useNavigator } from "@/hooks/useNavigator"
import { NavBack } from "@/components/NavBack"

type AddCashFlowFormInputs = {
  name: string
  iconNameFilter?: string
  icon: string
  description?: string
  amount: string
  frequency: Frequency
  type: Type
  date?: Date
}

export function AddCashFlowTemplate() {
  const [loading, setLoading] = useState(false)
  const { goBack } = useNavigator()

  const onSubmit: SubmitHandler<AddCashFlowFormInputs> = async (data) => {
    try {
      setLoading(true)
      const { iconNameFilter, ...rest } = data
      await saveCashFlowTemplate({
        ...rest,
        amount: amountToDouble(rest.amount),
      })
      toast.success("Save successful.", { onAutoClose: goBack })
    } catch (error) {
      console.error(error)
      toast.error("Save failed, Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <NavBack />
      <div>
        <h1 className="text-xl font-bold">Add Cash Flow</h1>
        <p className="text-sm">Add your recurring/one-time income/expense</p>
      </div>
      <CashFlowTemplateForm onSubmit={onSubmit} loading={loading} />
    </div>
  )
}
