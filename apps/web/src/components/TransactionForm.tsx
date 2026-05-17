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
import { Save, IndianRupee, Calendar as CalendarIcon } from "lucide-react"
import { DynamicIcon, iconNames, type IconName } from "lucide-react/dynamic"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { useForm, type SubmitHandler } from "react-hook-form"
import { formatAmount } from "@workspace/ui/lib/utils"
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
import type { Goal, GoalStage } from "@workspace/core/types/goals"
import type { TransactionType } from "@workspace/core/types/transactions"
import { GoalBadge } from "./GoalBadge"
import { useState } from "react"
import { Calendar } from "@workspace/ui/components/calendar"

const ICONS_PAGE_SIZE = 10

const DEFAULT_TRANSACTION = {
  name: "",
  estimatedAmount: "",
  iconNameFilter: "bank",
  icon: "banknote",
  date: new Date(),
}

export type TransactionFormInputs = {
  name: string
  iconNameFilter?: string
  description?: string
  icon: string
  amount: string
  type: TransactionType
  date?: Date
  goalId?: string
  goalStage?: GoalStage
  category?: string
  paidTo?: string
  templateId?: string
}

export const TransactionForm = ({
  formInputs,
  onSubmit,
  loading,
  goals,
}: {
  formInputs?: TransactionFormInputs
  goals: Goal[]
  onSubmit: SubmitHandler<TransactionFormInputs>
  loading: boolean
}) => {
  const isEdit = Boolean(formInputs)
  const defaultValues = formInputs || DEFAULT_TRANSACTION
  const { handleSubmit, register, setValue, watch } =
    useForm<TransactionFormInputs>({
      defaultValues,
    })

  const [calendarOpen, setCalenderOpen] = useState(false)

  const iconNameFilter = watch("iconNameFilter")
  const icon = watch("icon")
  const date = watch("date")

  const filteredIcons: IconName[] = iconNameFilter
    ? iconNames
        .filter((name) => name.includes(iconNameFilter.toLowerCase()))
        .slice(0, ICONS_PAGE_SIZE)
    : []

  return (
    <Card className="w-full">
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
              <FieldLabel htmlFor="amount">Amount</FieldLabel>
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
              <FieldLabel htmlFor="paidTo">Paid To</FieldLabel>
              <InputGroup className="h-11">
                <InputGroupInput id="paidTo" {...register("paidTo")} />
              </InputGroup>
            </Field>
          </div>
          <div className="flex gap-2">
            <Field>
              <FieldLabel htmlFor="type">Goal</FieldLabel>
              <Select
                defaultValue={formInputs?.goalId}
                onValueChange={(v) => setValue("goalId", v)}
              >
                <SelectTrigger id="type" className="!h-11 capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {goals.map((g) => (
                    <SelectItem value={g.id} key={g.id} className="capitalize">
                      {g.name}
                      <GoalBadge type={g.status} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div>
            <Field>
              <FieldLabel htmlFor="date-picker-simple">Date</FieldLabel>
              <Dialog open={calendarOpen} onOpenChange={setCalenderOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    id="date-picker-simple"
                    className="h-11 justify-start font-normal"
                  >
                    <CalendarIcon />
                    {date?.toLocaleDateString()}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader className="flex items-start">
                    <DialogTitle className="capitalize">
                      Date of the transaction
                    </DialogTitle>
                    <DialogDescription>
                      By default today's date will be selected
                    </DialogDescription>
                  </DialogHeader>
                  <Calendar
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
