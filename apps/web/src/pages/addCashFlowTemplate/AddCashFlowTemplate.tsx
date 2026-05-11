import { type SubmitHandler } from "react-hook-form"
import { saveCashFlowTemplate } from "@workspace/api/db/index"
import type { Frequency, Type } from "@workspace/core/type/index"
import { amountToDouble } from "@workspace/ui/lib/utils"
import { CashFlowTemplateForm } from "@/components/CashFlowTemplateForm"

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
  const onSubmit: SubmitHandler<AddCashFlowFormInputs> = async (data) => {
    try {
      const { iconNameFilter, ...rest } = data
      await saveCashFlowTemplate({
        ...rest,
        amount: amountToDouble(rest.amount),
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <div>
        <h1 className="text-xl font-bold">Add Cash Flow</h1>
        <p className="text-sm">Add your recurring/one-time income/expense</p>
      </div>
      <CashFlowTemplateForm onSubmit={onSubmit} />
    </div>
  )
}
