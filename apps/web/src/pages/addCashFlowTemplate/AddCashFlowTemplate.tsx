import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

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
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group"
import { MoveDown, MoveUp, Repeat, Save, Calendar } from "lucide-react"
import * as Icons from "lucide-react"
import { Field, FieldLabel, FieldTitle } from "@workspace/ui/components/field"
import { Calendar as CalendarInput } from "@workspace/ui/components/calendar"
import { useForm, type SubmitHandler } from "react-hook-form"
import { saveCashFlowTemplate } from "@workspace/api/db/index"
import type { Frequency, Type } from "@workspace/core/type/index"
import { amountToDouble, formatAmount } from "@workspace/ui/lib/utils"

const ICON_NAMES = Object.keys(Icons) as Array<keyof typeof Icons>
const ICONS_PAGE_SIZE = 10

type AddCashFlowFormInputs = {
  name: string
  iconNameFilter?: string
  icon?: string
  description?: string
  amount: string
  frequency: Frequency
  type: Type
  date?: Date
}

const Form = ({ type }: { type: Type }) => {
  const { handleSubmit, register, setValue, watch, reset } =
    useForm<AddCashFlowFormInputs>({
      defaultValues: {
        date: new Date(),
        frequency: "MONTHLY",
        iconNameFilter: "bank",
        icon: "Banknote",
        type,
      },
    })

  const onSubmit: SubmitHandler<AddCashFlowFormInputs> = async (data) => {
    try {
      const { iconNameFilter, ...rest } = data
      await saveCashFlowTemplate({
        ...rest,
        amount: amountToDouble(rest.amount),
      })
      reset()
    } catch (error) {
      console.error(error)
    }
  }

  const iconNameFilter = watch("iconNameFilter")
  const frequency = watch("frequency")
  const date = watch("date")
  const icon = watch("icon")

  const filteredIcons = iconNameFilter
    ? ICON_NAMES.filter((name) =>
        name.toLowerCase().includes(iconNameFilter.toLowerCase())
      )
        .slice(0, ICONS_PAGE_SIZE)
        .map((name) => ({ Icon: Icons[name] as Icons.LucideIcon, name }))
    : []

  const Icon = (
    icon ? Icons[icon as keyof typeof Icons] : <Icons.Banknote />
  ) as Icons.LucideIcon

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold capitalize">
          Add New {type.toLowerCase()}
        </CardTitle>
        <CardAction>{type === "INCOME" ? <MoveDown /> : <MoveUp />}</CardAction>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-2">
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" className="h-11" {...register("name")} />
            </Field>
            <Field>
              <FieldLabel htmlFor="name">Amount</FieldLabel>
              <Input
                id="amount"
                className="h-11"
                {...register("amount", { required: true })}
                onChange={(e) =>
                  setValue("amount", formatAmount(e.target.value))
                }
              />
            </Field>
          </div>
          <div className="flex gap-2">
            <Field className="basis-3/4">
              <FieldLabel htmlFor="desc">Description</FieldLabel>
              <Input id="desc" className="h-11" {...register("description")} />
            </Field>
            <Field className="basis-1/4">
              <FieldLabel htmlFor="name">Icon</FieldLabel>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-11">
                    <Icon className="size-6" />
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
                      {filteredIcons.map(({ Icon, name }) => (
                        <DialogClose asChild key={name}>
                          <Button
                            variant="ghost"
                            size="icon-lg"
                            onClick={() => setValue("icon", name)}
                          >
                            <Icon />
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
            <FieldLabel>Frequency</FieldLabel>
            <RadioGroup
              onValueChange={(v: Frequency) => setValue("frequency", v)}
              className="flex flex-1"
            >
              <FieldLabel htmlFor="monthly">
                <Field
                  orientation="horizontal"
                  className="flex flex-1 justify-center"
                >
                  <Repeat />
                  <FieldTitle>Monthly</FieldTitle>
                  <RadioGroupItem value="MONTH" id="monthly" />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="one-time">
                <Field orientation="horizontal">
                  <Calendar />
                  <FieldTitle>One time</FieldTitle>
                  <RadioGroupItem value="ONE_TIME" id="one-time" />
                </Field>
              </FieldLabel>
            </RadioGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="date-picker-simple">Date</FieldLabel>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  disabled={frequency !== "ONE_TIME"}
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
          <Button type="submit" className="h-13 w-full">
            <Save />
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export function AddCashFlowTemplate() {
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
          <Form type="INCOME" />
        </TabsContent>
        <TabsContent value="expense">
          <Form type="EXPENSE" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
