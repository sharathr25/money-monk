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
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group"
import { Calendar, MoveDown, MoveUp, Repeat, Save } from "lucide-react"
import { Field, FieldLabel, FieldTitle } from "@workspace/ui/components/field"
import type { SubmitEventHandler } from "react"

const Form = ({
  onSubmit,
  type,
}: {
  onSubmit: SubmitEventHandler<HTMLFormElement>
  type: string
}) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold capitalize">
          Add New {type.toLowerCase()}
        </CardTitle>
        <CardAction>{type === "INCOME" ? <MoveDown /> : <MoveUp />}</CardAction>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" required className="h-11" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" required className="h-11" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Frequency</Label>
            <RadioGroup defaultValue="MONTH" className="flex">
              <FieldLabel htmlFor="monthly" className="p-3">
                <Field orientation="horizontal">
                  <Repeat />
                  <FieldTitle>Monthly</FieldTitle>
                  <RadioGroupItem
                    value="MONTH"
                    id="monthly"
                    className="hidden"
                  />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="one-time" className="p-3">
                <Field orientation="horizontal">
                  <Calendar />
                  <FieldTitle>One time</FieldTitle>
                  <RadioGroupItem
                    value="ONE_TIME"
                    id="one-time"
                    className="hidden"
                  />
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
          <TabsTrigger className="flex w-full flex-1 p-2" value="income">
            Income
          </TabsTrigger>
          <TabsTrigger className="flex w-full flex-1 p-2" value="expense">
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
