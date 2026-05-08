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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerDescription,
  DrawerClose,
} from "@workspace/ui/components/drawer"
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group"
import {
  BanknoteArrowDown,
  MoveDown,
  MoveUp,
  Repeat,
  Save,
  Calendar,
} from "lucide-react"
import * as Icons from "lucide-react"
import { Field, FieldLabel, FieldTitle } from "@workspace/ui/components/field"
import { Calendar as CalendarInput } from "@workspace/ui/components/calendar"
import { useState, type SubmitEventHandler } from "react"

const ICON_NAMES = Object.keys(Icons) as Array<keyof typeof Icons>
const ICONS_PAGE_SIZE = 5

const Form = ({
  onSubmit,
  type,
}: {
  onSubmit: SubmitEventHandler<HTMLFormElement>
  type: string
}) => {
  const [icon, setIcon] = useState("home")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [frequency, setFrequency] = useState("MONTH")

  const filteredIcons = icon
    ? ICON_NAMES.filter((name) =>
        name.toLowerCase().includes(icon.toLowerCase())
      )
        .slice(0, ICONS_PAGE_SIZE)
        .map((name) => ({ Icon: Icons[name] as Icons.LucideIcon, name }))
    : []

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold capitalize">
          Add New {type.toLowerCase()}
        </CardTitle>
        <CardAction>{type === "INCOME" ? <MoveDown /> : <MoveUp />}</CardAction>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <InputGroup className="h-11">
              <InputGroupInput id="name" />
              <InputGroupAddon align="inline-end">
                <Drawer>
                  <DrawerTrigger asChild>
                    <BanknoteArrowDown />
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader className="flex items-start">
                      <DrawerTitle>Icon</DrawerTitle>
                      <DrawerDescription>Select an icon.</DrawerDescription>
                      <Input
                        id="icon"
                        onChange={(e) => setIcon(e.target.value)}
                        value={icon}
                        className="h-11"
                        placeholder="Search icons..."
                      />
                    </DrawerHeader>
                    <DrawerFooter>
                      <div className="flex h-11 gap-8">
                        {filteredIcons.map(({ Icon, name }) => (
                          <DrawerClose asChild key={name}>
                            <Icon />
                          </DrawerClose>
                        ))}
                      </div>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="name">Amount</FieldLabel>
            <Input id="amount" type="number" required className="h-11" />
          </Field>
          <Field>
            <FieldLabel>Frequency</FieldLabel>
            <RadioGroup
              defaultValue={frequency}
              value={frequency}
              className="flex flex-1"
            >
              <FieldLabel htmlFor="monthly">
                <Field
                  orientation="horizontal"
                  className="flex flex-1 justify-center"
                >
                  <Repeat />
                  <FieldTitle>Monthly</FieldTitle>
                  <RadioGroupItem
                    value="MONTH"
                    id="monthly"
                    onClick={() => setFrequency("MONTH")}
                  />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="one-time">
                <Field orientation="horizontal">
                  <Calendar />
                  <FieldTitle>One time</FieldTitle>
                  <RadioGroupItem
                    value="ONE_TIME"
                    id="one-time"
                    onClick={() => setFrequency("ONE_TIME")}
                  />
                </Field>
              </FieldLabel>
            </RadioGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="date-picker-simple">Date</FieldLabel>
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  disabled={frequency !== "ONE_TIME"}
                  variant="outline"
                  id="date-picker-simple"
                  className="h-11 justify-start font-normal"
                >
                  <Calendar />
                  {date?.toLocaleDateString()}
                </Button>
              </DrawerTrigger>
              <DrawerContent className="sm:max-w-sm">
                <DrawerHeader className="flex items-start">
                  <DrawerTitle>Date</DrawerTitle>
                  <DrawerDescription>Select a date.</DrawerDescription>
                </DrawerHeader>
                <CalendarInput
                  required={frequency === "ONE_TIME"}
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  defaultMonth={date}
                  captionLayout="dropdown"
                  className="w-full"
                />
              </DrawerContent>
            </Drawer>
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

export function AddCashFlowMovement() {
  const onSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    console.log("submitted")
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
          <Form onSubmit={onSubmit} type="INCOME" />
        </TabsContent>
        <TabsContent value="expense">
          <Form onSubmit={onSubmit} type="EXPENSE" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
