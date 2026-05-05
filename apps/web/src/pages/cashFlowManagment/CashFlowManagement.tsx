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
import { Label } from "@workspace/ui/components/label"
import { Input } from "@workspace/ui/components/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group"
import {
  BanknoteArrowDown,
  Calendar,
  MoveDown,
  MoveUp,
  Repeat,
  Save,
} from "lucide-react"
import * as Icons from "lucide-react"
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@workspace/ui/components/field"
import { Calendar as CalendarInput } from "@workspace/ui/components/calendar"
import { useState, type SubmitEventHandler } from "react"

const ICON_NAMES = Object.keys(Icons) as Array<keyof typeof Icons>

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

  const filteredIcons = ICON_NAMES.filter((name) =>
    name.toLowerCase().includes(icon.toLowerCase())
  ).slice(0, 5)

  console.log(frequency)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold capitalize">
          Add New {type.toLowerCase()}
        </CardTitle>
        <CardAction>{type === "INCOME" ? <MoveDown /> : <MoveUp />}</CardAction>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <div className="flex flex-col gap-2">
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <InputGroup className="h-11">
                <InputGroupInput id="name" />
                <InputGroupAddon align="inline-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <BanknoteArrowDown />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Icon</DialogTitle>
                      </DialogHeader>
                      <Input
                        id="icon"
                        onChange={(e) => setIcon(e.target.value)}
                        value={icon}
                        className="h-11"
                        placeholder="Search icons..."
                      />
                      <div className="flex flex-wrap justify-start gap-4">
                        {icon &&
                          filteredIcons.map((name) => {
                            const Icon = Icons[name] as Icons.LucideIcon

                            if (!Icon) return

                            return (
                              <div
                                key={name}
                                className="flex flex-1 flex-col items-center text-sm"
                              >
                                <Icon />
                              </div>
                            )
                          })}
                      </div>
                    </DialogContent>
                  </Dialog>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" required className="h-11" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Frequency</Label>
            <RadioGroup
              defaultValue={frequency}
              value={frequency}
              className="flex flex-1"
            >
              <FieldLabel
                htmlFor="monthly"
                className="p-3"
                onClick={() => setFrequency("MONTH")}
              >
                <Field
                  orientation="horizontal"
                  className="flex flex-1 justify-center"
                >
                  <Repeat />
                  <FieldTitle>Monthly</FieldTitle>
                  <RadioGroupItem
                    value="MONTH"
                    id="monthly"
                    className="hidden"
                  />
                </Field>
              </FieldLabel>
              <FieldLabel
                htmlFor="one-time"
                className="p-3"
                onClick={() => setFrequency("ONE_TIME")}
              >
                <Field orientation="horizontal">
                  <Calendar />
                  <div>
                    <FieldTitle>One time</FieldTitle>
                    <FieldDescription className="flex gap-2">
                      {date?.toLocaleDateString()}
                    </FieldDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <RadioGroupItem
                        value="ONE_TIME"
                        id="one-time"
                        className="hidden"
                      />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Date</DialogTitle>
                        <DialogDescription>
                          If you don't select date, today's date will be taken
                          by default. Click 'One time' frequency again to change
                          date.
                        </DialogDescription>
                      </DialogHeader>
                      <CalendarInput
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        captionLayout="dropdown"
                        className="w-full rounded-lg border"
                      />
                    </DialogContent>
                  </Dialog>
                </Field>
              </FieldLabel>
            </RadioGroup>
          </div>
          <Button type="submit" className="h-13 w-full">
            <Save />
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export function CashFlowManagement() {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <div>
        <h1 className="text-xl font-bold">Manage Cash Flow</h1>
        <p className="text-sm">
          Configure your recurring/one time income or expense
        </p>
      </div>
      <Tabs defaultValue="income">
        <TabsList className="flex w-full flex-1">
          <TabsTrigger className="flex w-full flex-1 p-3" value="income">
            Income
          </TabsTrigger>
          <TabsTrigger className="flex w-full flex-1 p-3" value="expense">
            Expense
          </TabsTrigger>
        </TabsList>
        <TabsContent value="income">
          <Form onSubmit={console.log} type="INCOME" />
        </TabsContent>
        <TabsContent value="expense">
          <Form onSubmit={console.log} type="EXPENSE" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
