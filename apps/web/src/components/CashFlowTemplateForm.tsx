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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@workspace/ui/components/dialog"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@workspace/ui/components/select"
import {
  MoveDown,
  MoveUp,
  Repeat,
  Save,
  Calendar,
  IndianRupee,
} from "lucide-react"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { Calendar as CalendarInput } from "@workspace/ui/components/calendar"
import { useForm, type SubmitHandler } from "react-hook-form"
import type { Frequency, Type } from "@workspace/core/type/index"
import { daysOfMonth, formatAmount, isNumber } from "@workspace/ui/lib/utils"
import { Spinner } from "@workspace/ui/components/spinner"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { useState } from "react"
import { IconSelector } from "./IconSelector"

const DEFAULT_CASH_TEMPLATE = {
  name: "",
  amount: "",
  date: new Date(),
  frequency: "MONTHLY" as Frequency,
  icon: "banknote",
  type: "INCOME" as Type,
  day: "1",
}

export type CashFlowTemplateFormInputs = {
  name: string
  icon: string
  description?: string
  amount: string
  frequency: Frequency
  type: Type
  date?: Date
  day?: string
}

export const CashFlowTemplateForm = ({
  formInputs,
  onSubmit,
  loading,
}: {
  formInputs?: CashFlowTemplateFormInputs
  onSubmit: SubmitHandler<CashFlowTemplateFormInputs>
  loading: boolean
}) => {
  const isEdit = Boolean(formInputs)
  const defaultValues = formInputs || DEFAULT_CASH_TEMPLATE
  const { handleSubmit, register, setValue, watch } =
    useForm<CashFlowTemplateFormInputs>({
      defaultValues,
    })

  const [calendarOpen, setCalenderOpen] = useState(false)

  const frequency = watch("frequency")
  const date = watch("date")
  const icon = watch("icon")
  const type = watch("type")

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
          <Field>
            <FieldLabel htmlFor="desc">Description</FieldLabel>
            <Input id="desc" {...register("description")} />
          </Field>
          <div className="flex gap-2">
            <Field>
              <FieldLabel htmlFor="name">
                Amount<span className="text-destructive">*</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="amount"
                  inputMode="numeric"
                  {...register("amount", { required: true })}
                  onChange={(e) =>
                    isNumber(e.target.value) &&
                    setValue("amount", formatAmount(e.target.value))
                  }
                />
                <InputGroupAddon>
                  <IndianRupee />
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="type">Type</FieldLabel>
              <Select
                defaultValue={defaultValues.type}
                onValueChange={(v: Type) => setValue("type", v)}
              >
                <SelectTrigger id="type" className="!h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INCOME">
                    <MoveDown />
                    Income
                  </SelectItem>
                  <SelectItem value="EXPENSE">
                    <MoveUp />
                    Expense
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="flex gap-2">
            <Field>
              <FieldLabel>Frequency</FieldLabel>
              <Select
                defaultValue={defaultValues.frequency}
                onValueChange={(v: Frequency) => setValue("frequency", v)}
              >
                <SelectTrigger id="type" className="!h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTHLY">
                    <Repeat />
                    Monthly
                  </SelectItem>
                  <SelectItem value="ONE_TIME">
                    <Calendar />
                    One time
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
            {frequency === "ONE_TIME" && (
              <Field>
                <FieldLabel htmlFor="date-picker-simple">Date</FieldLabel>
                <Dialog open={calendarOpen} onOpenChange={setCalenderOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      id="date-picker-simple"
                      className="justify-start border-(--foreground) font-normal text-(--foreground)"
                    >
                      <Calendar />
                      {date?.toLocaleDateString()}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader className="flex items-start">
                      <DialogTitle className="capitalize">
                        Date of the One Time {type.toLowerCase()}
                      </DialogTitle>
                      <DialogDescription>
                        If you don't know the exact day, just pick any date in
                        that month
                      </DialogDescription>
                    </DialogHeader>
                    <CalendarInput
                      required={frequency === "ONE_TIME"}
                      mode="single"
                      selected={date}
                      onSelect={(d: Date | undefined) => {
                        setValue("date", d)
                        setCalenderOpen(false)
                      }}
                      defaultMonth={date}
                      captionLayout="dropdown"
                      className="mx-auto"
                    />
                  </DialogContent>
                </Dialog>
              </Field>
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
          <Button type="submit" className="w-full">
            {loading ? <Spinner /> : <Save />}
            {isEdit ? "Update" : "Save"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
