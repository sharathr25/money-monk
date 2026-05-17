import { type SubmitHandler } from "react-hook-form"
import { toast } from "sonner"
import { saveCashFlowTemplate } from "@workspace/api/db/index"
import type { Frequency, Type } from "@workspace/core/type/index"
import { amountToDouble } from "@workspace/ui/lib/utils"
import { CashFlowTemplateForm } from "@/components/CashFlowTemplateForm"
import { useNavigator } from "@/hooks/useNavigator"
import { NavBack } from "@/components/NavBack"
import { useAuth } from "@/hooks/useAuth"
import { useMutation } from "@tanstack/react-query"

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
  const user = useAuth()
  const { goBack } = useNavigator()

  const { mutate, isPending: saveApiLoading } = useMutation({
    mutationKey: ["add-goal"],
    mutationFn: saveCashFlowTemplate(user.uid),
    onSuccess: () =>
      toast.success("Save successful.", {
        onAutoClose: goBack,
      }),
    onError: () => toast.error("Save failed, Try again."),
  })

  const onSubmit: SubmitHandler<AddCashFlowFormInputs> = async (data) => {
    const { iconNameFilter, ...rest } = data
    mutate({
      ...rest,
      amount: amountToDouble(rest.amount),
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <NavBack />
      <div>
        <h1 className="text-xl font-bold">Add Cash Flow</h1>
        <p className="text-sm">Add your recurring/one-time income/expense</p>
      </div>
      <CashFlowTemplateForm onSubmit={onSubmit} loading={saveApiLoading} />
    </div>
  )
}
