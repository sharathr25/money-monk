import type { Goal } from "@workspace/core/types/goals"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { InfoIcon } from "lucide-react"

export const GoalSelector = ({
  goalId,
  setGoalId,
  goals,
  required = false,
}: {
  goalId?: string
  setGoalId: (value: string) => void
  goals: Goal[]
  required?: boolean
  disabled?: boolean
}) => {
  return (
    <Field>
      <FieldLabel htmlFor="goal">
        Goal{required && <span className="text-destructive">*</span>}
        <Tooltip>
          <TooltipTrigger>
            <InfoIcon size={16} />
          </TooltipTrigger>
          <TooltipContent>
            Only active or savings goals can be selected.
          </TooltipContent>
        </Tooltip>
      </FieldLabel>
      <Select
        defaultValue={goalId}
        required={required}
        onValueChange={setGoalId}
      >
        <SelectTrigger id="goal" className="!h-12 capitalize">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {goals.map((g) => (
            <SelectItem value={g.id} key={g.id} className="capitalize">
              {g.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}
