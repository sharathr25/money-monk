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
  DialogFooter,
  DialogDescription,
  DialogClose,
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
import { DynamicIcon, iconNames, type IconName } from "lucide-react/dynamic"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { Calendar as CalendarInput } from "@workspace/ui/components/calendar"
import { useForm, type SubmitHandler } from "react-hook-form"
import type { Frequency, Type } from "@workspace/core/type/index"
import { daysOfMonth, formatAmount } from "@workspace/ui/lib/utils"
import { Spinner } from "@workspace/ui/components/spinner"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"

const ICONS_PAGE_SIZE = 10

const DEFAULT_CASH_TEMPLATE = {
  name: "",
  amount: "",
  date: new Date(),
  frequency: "MONTHLY" as Frequency,
  iconNameFilter: "bank",
  icon: "banknote",
  type: "INCOME" as Type,
  day: "1",
}

export type CashFlowTemplateFormInputs = {
  name: string
  iconNameFilter?: string
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

  const iconNameFilter = watch("iconNameFilter")
  const frequency = watch("frequency")
  const date = watch("date")
  const icon = watch("icon")
  const type = watch("type")

  const filteredIcons: IconName[] = iconNameFilter
    ? iconNames
        .filter((name) => name.includes(iconNameFilter.toLowerCase()))
        .slice(0, ICONS_PAGE_SIZE)
    : []

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
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" className="h-11" {...register("name")} />
            </Field>
            <Field className="basis-1/4">
              <FieldLabel htmlFor="name">Icon</FieldLabel>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-11">
                    <DynamicIcon name={icon as IconName} className="size-6" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader className="flex items-start">
                    <DialogTitle>Icon</DialogTitle>
                    <DialogDescription>Select an icon.</DialogDescription>
                    <Input
                      id="icon"
                      className="h-11"
                      placeholder="Search icons..."
                      {...register("iconNameFilter")}
                    />
                  </DialogHeader>
                  <DialogFooter>
                    <div className="flex h-11 flex-wrap gap-8">
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
            <Input id="desc" className="h-11" {...register("description")} />
          </Field>
          <div className="flex gap-2">
            <Field>
              <FieldLabel htmlFor="name">Amount</FieldLabel>
              <InputGroup className="h-11">
                <InputGroupInput
                  id="amount"
                  {...register("amount", { required: true })}
                  onChange={(e) =>
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
                <SelectTrigger id="type" className="!h-11">
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
                <SelectTrigger id="type" className="!h-11">
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      id="date-picker-simple"
                      className="h-11 justify-start font-normal"
                    >
                      <Calendar />
                      {date?.toLocaleDateString()}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader className="flex items-start">
                      <DialogTitle>Date</DialogTitle>
                      <DialogDescription>Select a date.</DialogDescription>
                    </DialogHeader>
                    <CalendarInput
                      required={frequency === "ONE_TIME"}
                      mode="single"
                      selected={date}
                      onSelect={(d: Date | undefined) => setValue("date", d)}
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
                  <SelectTrigger id="type" className="!h-11">
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
          <Button type="submit" className="h-13 w-full">
            {loading ? <Spinner /> : <Save />}
            {isEdit ? "Update" : "Save"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
