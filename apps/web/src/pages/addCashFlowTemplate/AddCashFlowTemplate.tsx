import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

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
      <Tabs defaultValue="income">
        <TabsList className="flex w-full flex-1">
          <TabsTrigger className="flex w-full flex-1" value="income">
            Income
          </TabsTrigger>
          <TabsTrigger className="flex w-full flex-1" value="expense">
            Expense
          </TabsTrigger>
        </TabsList>
        <TabsContent value="income">
          <CashFlowTemplateForm
            defaultValues={{
              name: "",
              amount: "",
              date: new Date(),
              frequency: "MONTHLY",
              iconNameFilter: "bank",
              icon: "banknote",
              type: "INCOME",
            }}
            onSubmit={onSubmit}
          />
        </TabsContent>
        <TabsContent value="expense">
          <CashFlowTemplateForm
            defaultValues={{
              name: "",
              amount: "",
              date: new Date(),
              frequency: "MONTHLY",
              iconNameFilter: "bank",
              icon: "banknote",
              type: "EXPENSE",
            }}
            onSubmit={onSubmit}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
