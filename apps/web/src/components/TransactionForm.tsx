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
import { formatAmount, isNumber } from "@workspace/ui/lib/utils"
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
import { useState } from "react"
import { Calendar } from "@workspace/ui/components/calendar"
import { TRANSACTION_TYPES } from "@workspace/ui/constants/transactions"

const ICONS_PAGE_SIZE = 10

const DEFAULT_TRANSACTION = {
  name: "",
  estimatedAmount: "",
  iconNameFilter: "bank",
  type: "EXPENSE" as TransactionType,
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

  const [calendarOpen, setCalenderOpen] = useState(false)

  const iconNameFilter = watch("iconNameFilter")
  const icon = watch("icon")
  const date = watch("date")
  const goalId = watch("goalId")
  const categoryId = watch("categoryId")
  const type = watch("type")

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
            <Field>
              <FieldLabel htmlFor="amount">
                Amount<span className="text-destructive">*</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="amount"
                  inputMode="numeric"
                  {...register("amount", { required: true })}
                  onChange={(e) =>
                    setValue(
                      "amount",
                      isNumber(e.target.value)
                        ? formatAmount(e.target.value)
                        : ""
                    )
                  }
                />
                <InputGroupAddon>
                  <IndianRupee />
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="goal">
                Type<span className="text-destructive">*</span>
              </FieldLabel>
              <Select
                required
                value={type}
                onValueChange={(v: TransactionType) => setValue("type", v)}
              >
                <SelectTrigger id="goal" className="!h-12 capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TRANSACTION_TYPES.map((t) => (
                    <SelectItem value={t} key={t} className="capitalize">
                      {t.toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="flex gap-2">
            <Field>
              <FieldLabel htmlFor="goal">
                Goal<span className="text-destructive">*</span>
              </FieldLabel>
              <Select
                value={goalId}
                required
                onValueChange={(v) => setValue("goalId", v)}
              >
                <SelectTrigger id="goal" className="!h-12 capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(goalsMap).map((g) => (
                    <SelectItem value={g.id} key={g.id} className="capitalize">
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="goal">Category</FieldLabel>
              <Select
                value={categoryId}
                onValueChange={(v) => setValue("categoryId", v)}
              >
                <SelectTrigger id="goal" className="!h-12 capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {goalsMap[goalId || ""]?.breakdown?.map((c) => (
                    <SelectItem value={c.id} key={c.id} className="capitalize">
                      {c.category}
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
                    className="justify-start border-(--foreground) font-normal text-(--foreground)"
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
          <Button type="submit" className="w-full">
            {loading ? <Spinner /> : <Save />}
            {isEdit ? "Update" : "Save"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
