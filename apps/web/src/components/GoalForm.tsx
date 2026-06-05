import { Card, CardContent } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Save, Plus, Minus } from "lucide-react"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import {
  useFieldArray,
  useForm,
  type FieldArrayWithId,
  type SubmitHandler,
} from "react-hook-form"
import { amountToDouble, formatAmount } from "@workspace/ui/lib/utils"
import { Spinner } from "@workspace/ui/components/spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { GOAL_STATUSES } from "@workspace/ui/constants/goals"
import type { GoalStatus } from "@workspace/core/types/goals"
import { IconSelector } from "./IconSelector"
import { AmountInput } from "./AmountInput"

const DEFAULT_GOAL = {
  name: "",
  estimatedAmount: "",
  icon: "banknote",
  status: "PLANNED" as GoalStatus,
}

const DEFAULT_BREAKDOWN = { category: "", amount: "", id: "" }

export type GoalFormInputs = {
  name: string
  icon: string
  description?: string
  estimatedAmount: string
  status: GoalStatus
  breakdown: { category: string; amount: string; id: string }[]
}

export const GoalForm = ({
  formInputs,
  onSubmit,
  loading,
}: {
  formInputs?: GoalFormInputs
  onSubmit: SubmitHandler<GoalFormInputs>
  loading: boolean
}) => {
  const isEdit = Boolean(formInputs)
  const defaultValues = formInputs || DEFAULT_GOAL
  const { handleSubmit, register, setValue, watch, control } =
    useForm<GoalFormInputs>({
      defaultValues,
    })
  const { fields, append, remove } = useFieldArray({
    control,
    name: "breakdown",
  })

  const icon = watch("icon")
  const totalBreakdownAmount = watch("breakdown")?.reduce(
    (acc, cur) => acc + amountToDouble(cur.amount),
    0
  )

  const renderBreakdownFields = (
    field: FieldArrayWithId<GoalFormInputs, "breakdown", "id">,
    index: number
  ) => {
    return (
      <div key={field.id} className="flex items-end gap-2">
        <Field>
          <FieldLabel htmlFor="category">
            Category<span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="category"
            {...register(`breakdown.${index}.category`, {
              required: true,
            })}
          />
        </Field>
        <AmountInput
          {...register(`breakdown.${index}.amount`, { required: true })}
          setAmount={setValue.bind(null, `breakdown.${index}.amount`)}
        />
        <Button variant="outline" onClick={() => remove(index)}>
          <Minus />
        </Button>
      </div>
    )
  }

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
              icon={icon}
              setIcon={setValue.bind(null, "icon")}
              className="basis-1/4"
            />
          </div>
          <Field>
            <FieldLabel htmlFor="desc">Description</FieldLabel>
            <Input id="desc" {...register("description")} />
          </Field>
          <div className="flex gap-2">
            <Field>
              <FieldLabel htmlFor="type">Status</FieldLabel>
              <Select
                defaultValue={defaultValues.status}
                onValueChange={(v: GoalStatus) => setValue("status", v)}
              >
                <SelectTrigger id="type" className="!h-12 capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GOAL_STATUSES.map((t) => (
                    <SelectItem value={t} key={t} className="capitalize">
                      {t.toLowerCase().replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="flex gap-2">
            <AmountInput
              label="Estimated Amount"
              {...register("estimatedAmount", { required: true })}
              setAmount={setValue.bind(null, "estimatedAmount")}
              description={
                totalBreakdownAmount
                  ? `Total breakdown amount is ${formatAmount(totalBreakdownAmount)}`
                  : ""
              }
            />
          </div>
          {fields.map(renderBreakdownFields)}
          <Button variant="outline" onClick={() => append(DEFAULT_BREAKDOWN)}>
            <Plus />
            Add Breakdown
          </Button>
          <Button type="submit" className="w-full">
            {loading ? <Spinner /> : <Save />}
            {isEdit ? "Update" : "Save"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
