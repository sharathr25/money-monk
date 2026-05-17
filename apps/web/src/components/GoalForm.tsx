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
import { Save, IndianRupee } from "lucide-react"
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
  const { handleSubmit, register, setValue, watch } = useForm<GoalFormInputs>({
    defaultValues,
  })

  const iconNameFilter = watch("iconNameFilter")
  const icon = watch("icon")

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
              <FieldLabel htmlFor="name">Estimated Amount</FieldLabel>
              <InputGroup className="h-11">
                <InputGroupInput
                  id="amount"
                  {...register("estimatedAmount", { required: true })}
                  onChange={(e) =>
                    setValue("estimatedAmount", formatAmount(e.target.value))
                  }
                />
                <InputGroupAddon>
                  <IndianRupee />
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </div>
          <div className="flex gap-2">
            <Field>
              <FieldLabel htmlFor="type">Status</FieldLabel>
              <Select
                defaultValue={defaultValues.status}
                onValueChange={(v: GoalStatus) => setValue("status", v)}
              >
                <SelectTrigger id="type" className="!h-11 capitalize">
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
          <Button type="submit" className="h-13 w-full">
            {loading ? <Spinner /> : <Save />}
            {isEdit ? "Update" : "Save"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
