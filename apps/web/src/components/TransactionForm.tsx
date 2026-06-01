import { Card, CardContent } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Save } from "lucide-react"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Spinner } from "@workspace/ui/components/spinner"
import {
  InputGroup,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import type { Goal, GoalStage } from "@workspace/core/types/goals"
import type { TransactionType } from "@workspace/core/types/transactions"
import { TRANSACTION_TYPES } from "@workspace/ui/constants/transactions"
import { IconSelector } from "./IconSelector"
import { AmountTypeSelector } from "./AmountTypeSelector"
import { GoalSelector } from "./GoalSelector"
import { CategorySelector } from "./CategorySelector"
import { DateSelector } from "./DateSelector"
import { AmountInput } from "./AmountInput"

const DEFAULT_TRANSACTION = {
  name: "",
  type: "EXPENSE" as TransactionType,
  icon: "banknote",
  date: new Date(),
}

export type TransactionFormInputs = {
  name: string
  description?: string
  icon: string
  amount: string
  type: TransactionType
  date?: Date
  goalId?: string
  categoryId?: string
  goalStage?: GoalStage
  paidTo?: string
  templateId?: string
}

export const TransactionForm = ({
  formInputs,
  onSubmit,
  loading,
  goalsMap,
}: {
  formInputs?: TransactionFormInputs
  goalsMap: Record<string, Goal>
  onSubmit: SubmitHandler<TransactionFormInputs>
  loading: boolean
}) => {
  const isEdit = Boolean(formInputs)
  const defaultValues = formInputs || DEFAULT_TRANSACTION
  const { handleSubmit, register, setValue, watch } =
    useForm<TransactionFormInputs>({
      defaultValues,
    })

  const icon = watch("icon")
  const date = watch("date")
  const goalId = watch("goalId")
  const categoryId = watch("categoryId")
  const type = watch("type")

  return (
    <Card className="w-full">
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-2">
            <Field className="basis-3/4">
              <FieldLabel htmlFor="name">
                Name<span className="text-destructive">*</span>
              </FieldLabel>
              <Input id="name" {...register("name", { required: true })} />
            </Field>
            <IconSelector
              className="basis-1/4"
              icon={icon}
              setIcon={setValue.bind(null, "icon")}
            />
          </div>
          <div className="flex gap-2">
            <Field>
              <FieldLabel htmlFor="desc">Description</FieldLabel>
              <Input id="desc" {...register("description")} />
            </Field>
            <Field>
              <FieldLabel htmlFor="paidTo">Paid To</FieldLabel>
              <InputGroup>
                <InputGroupInput id="paidTo" {...register("paidTo")} />
              </InputGroup>
            </Field>
          </div>
          <div className="flex gap-2">
            <AmountInput
              {...register("amount", { required: true })}
              setAmount={setValue.bind(null, "amount")}
            />
            <AmountTypeSelector
              type={type}
              setType={setValue.bind(null, "type")}
              types={TRANSACTION_TYPES}
            />
          </div>
          <div className="flex gap-2">
            <GoalSelector
              required
              goalId={goalId}
              setGoalId={setValue.bind(null, "goalId")}
              goals={Object.values(goalsMap)}
            />
            <CategorySelector
              disabled={!goalId}
              breakdown={goalsMap[goalId || ""]?.breakdown || []}
              categoryId={categoryId}
              setCategoryId={setValue.bind(null, "categoryId")}
            />
          </div>
          <div>
            <DateSelector date={date} setDate={setValue.bind(null, "date")} />
          </div>
          <Button type="submit" className="w-full">
            {loading ? <Spinner /> : <Save />}
            {isEdit ? "Update" : "Save"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
