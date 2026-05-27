import { Card, CardContent } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@workspace/ui/components/dialog"
import { Save, IndianRupee, Plus, Minus } from "lucide-react"
import { DynamicIcon, iconNames, type IconName } from "lucide-react/dynamic"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/field"
import {
  useFieldArray,
  useForm,
  type FieldArrayWithId,
  type SubmitHandler,
} from "react-hook-form"
import { amountToDouble, formatAmount, isNumber } from "@workspace/ui/lib/utils"
import { Spinner } from "@workspace/ui/components/spinner"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { GOAL_STATUSES } from "@workspace/ui/constants/goals"
import type { GoalStatus } from "@workspace/core/types/goals"

const ICONS_PAGE_SIZE = 10

const DEFAULT_GOAL = {
  name: "",
  estimatedAmount: "",
  iconNameFilter: "bank",
  icon: "banknote",
  status: "PLANNED" as GoalStatus,
}

export type GoalFormInputs = {
  name: string
  iconNameFilter?: string
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

  const iconNameFilter = watch("iconNameFilter")
  const icon = watch("icon")
  const totalBreakdownAmount = watch("breakdown")?.reduce(
    (acc, cur) => acc + amountToDouble(cur.amount),
    0
  )

  const filteredIcons: IconName[] = iconNameFilter
    ? iconNames
        .filter((name) => name.includes(iconNameFilter.toLowerCase()))
        .slice(0, ICONS_PAGE_SIZE)
    : []

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
        <Field>
          <FieldLabel htmlFor="estimatedAmount">
            Amount<span className="text-destructive">*</span>
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="amount"
              inputMode="numeric"
              {...register(`breakdown.${index}.amount`, { required: true })}
              onChange={(e) =>
                setValue(
                  `breakdown.${index}.amount`,
                  formatAmount(isNumber(e.target.value) ? e.target.value : "")
                )
              }
            />
            <InputGroupAddon>
              <IndianRupee />
            </InputGroupAddon>
          </InputGroup>
        </Field>
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
            <Field className="basis-1/4">
              <FieldLabel htmlFor="name">Icon</FieldLabel>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-(--foreground) text-(--foreground)"
                  >
                    <DynamicIcon name={icon as IconName} className="size-6" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader className="flex items-start">
                    <DialogTitle>Icon</DialogTitle>
                    <DialogDescription>Select an icon.</DialogDescription>
                    <Input
                      id="icon"
                      placeholder="Search icons..."
                      {...register("iconNameFilter")}
                    />
                  </DialogHeader>
                  <DialogFooter>
                    <div className="flex h-12 flex-wrap gap-8">
                      {filteredIcons.map((name) => (
                        <DialogClose asChild key={name}>
                          <Button
                            variant="ghost"
                            size="icon-lg"
                            onClick={() => setValue("icon", name)}
                          >
                            <DynamicIcon name={name} />
                          </Button>
                        </DialogClose>
                      ))}
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Field>
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
            <Field>
              <FieldLabel htmlFor="amount">
                Estimated Amount
                <span className="text-destructive">*</span>
              </FieldLabel>
              {!!totalBreakdownAmount && (
                <FieldDescription>
                  Total breakdown amount is {formatAmount(totalBreakdownAmount)}
                </FieldDescription>
              )}
              <InputGroup>
                <InputGroupInput
                  id="amount"
                  inputMode="numeric"
                  {...register("estimatedAmount", { required: true })}
                  onChange={(e) =>
                    setValue(
                      "estimatedAmount",
                      formatAmount(
                        isNumber(e.target.value) ? e.target.value : ""
                      )
                    )
                  }
                />
                <InputGroupAddon>
                  <IndianRupee />
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </div>
          {fields.map(renderBreakdownFields)}
          <Button
            variant="outline"
            onClick={() => append({ category: "", amount: "", id: "" })}
          >
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
