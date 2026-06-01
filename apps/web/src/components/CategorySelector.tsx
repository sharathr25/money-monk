import type { GoalBreakdown } from "@workspace/core/types/goals"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

export const CategorySelector = ({
  categoryId,
  setCategoryId,
  breakdown,
  disabled,
}: {
  categoryId?: string
  setCategoryId: (value: string) => void
  breakdown: GoalBreakdown[]
  required?: boolean
  disabled?: boolean
}) => {
  return (
    <Field>
      <FieldLabel htmlFor="goal">Category</FieldLabel>
      <Select
        disabled={disabled}
        defaultValue={categoryId}
        onValueChange={setCategoryId}
      >
        <SelectTrigger id="goal" className="!h-12 capitalize">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {breakdown?.map((c) => (
            <SelectItem value={c.id} key={c.id} className="capitalize">
              {c.category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}
