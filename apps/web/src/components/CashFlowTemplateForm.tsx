import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@workspace/ui/components/select"
import { MoveDown, MoveUp, Save } from "lucide-react"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { useForm, type SubmitHandler } from "react-hook-form"
import type { Frequency } from "@workspace/core/type/index"
import { daysOfMonth } from "@workspace/ui/lib/utils"
import { Spinner } from "@workspace/ui/components/spinner"
import { IconSelector } from "./IconSelector"
import { FrequencySelector } from "./FrequencySelector"
import { AmountTypeSelector } from "./AmountTypeSelector"
import { AmountInput } from "./AmountInput"
import { DateSelector } from "./DateSelector"
import { GoalSelector } from "./GoalSelector"
import { CategorySelector } from "./CategorySelector"
import type { Goal } from "@workspace/core/types/goals"
import { useEffect } from "react"
import type { TransactionType } from "@workspace/core/types/transactions"

const DEFAULT_CASH_TEMPLATE = {
  name: "",
  amount: "",
  date: new Date(),
  frequency: "MONTHLY" as Frequency,
  icon: "banknote",
  type: "INCOME" as TransactionType,
  day: "1",
}

export type CashFlowTemplateFormInputs = {
  name: string
  icon: string
  description?: string
  amount: string
  frequency: Frequency
  type: TransactionType
  date?: Date
  day?: string
  counterParty?: string
  goalId?: string
  categoryId?: string
}

export const CashFlowTemplateForm = ({
  formInputs,
  onSubmit,
  loading,
  goalsMap,
}: {
  formInputs?: CashFlowTemplateFormInputs
  onSubmit: SubmitHandler<CashFlowTemplateFormInputs>
  goalsMap: Record<string, Goal>
  loading: boolean
}) => {
  const isEdit = Boolean(formInputs)
  const defaultValues = formInputs || DEFAULT_CASH_TEMPLATE
  const { handleSubmit, register, setValue, watch } =
    useForm<CashFlowTemplateFormInputs>({
      defaultValues,
    })

  const frequency = watch("frequency")
  const date = watch("date")
  const icon = watch("icon")
  const type = watch("type")
  const categoryId = watch("categoryId")
  const goalId = watch("goalId")

  useEffect(() => {
    if (frequency === "ONE_TIME") {
      setValue("date", new Date())
    }
  }, [frequency])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold capitalize">
          {isEdit ? "Edit" : "Add New"} {type.toLowerCase()}
        </CardTitle>
        <CardAction>{type === "INCOME" ? <MoveDown /> : <MoveUp />}</CardAction>
      </CardHeader>
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
              <FieldLabel htmlFor="counterParty">
                {type === "EXPENSE" ? "Pay to" : "Receive From"}
              </FieldLabel>
              <Input id="counterParty" {...register("counterParty")} />
            </Field>
          </div>
          <div className="flex gap-2">
            <AmountInput
              required
              {...register("amount", { required: true })}
              setAmount={setValue.bind(null, "amount")}
            />
            <AmountTypeSelector
              types={["INCOME", "EXPENSE"] as TransactionType[]}
              type={type}
              setType={setValue.bind(null, "type")}
            />
          </div>
          <div className="flex gap-2">
            <FrequencySelector
              frequencies={["MONTHLY", "ONE_TIME"]}
              frequency={frequency}
              setFrequency={setValue.bind(null, "frequency")}
            />
            {frequency === "ONE_TIME" && (
              <DateSelector date={date} setDate={setValue.bind(null, "date")} />
            )}
            {frequency === "MONTHLY" && (
              <Field>
                <FieldLabel>Day</FieldLabel>
                <Select
                  defaultValue={defaultValues.day}
                  onValueChange={(v) => setValue("day", v)}
                >
                  <SelectTrigger id="type" className="!h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfMonth().map((day) => (
                      <SelectItem value={`${day}`} key={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          </div>
          {type === "EXPENSE" && (
            <div className="flex gap-2">
              <GoalSelector
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
          )}
          <Button type="submit" className="w-full">
            {loading ? <Spinner /> : <Save />}
            {isEdit ? "Update" : "Save"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
