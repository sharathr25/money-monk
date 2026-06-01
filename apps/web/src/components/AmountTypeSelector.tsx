import type { Type } from "@workspace/core/types"
import type { TransactionType } from "@workspace/core/types/transactions"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

export const AmountTypeSelector = ({
  type,
  setType,
  types,
  required = false,
}: {
  required?: boolean
  showAllOption?: boolean
  type: string
  setType: (value: string) => void
  types: (Type | TransactionType | "ALL")[]
}) => {
  return (
    <Field>
      <FieldLabel htmlFor="type">
        Type{required && <span className="text-destructive">*</span>}
      </FieldLabel>
      <Select defaultValue={type} onValueChange={setType} required={required}>
        <SelectTrigger id="type" className="!h-12 capitalize">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {types.map((t) => (
            <SelectItem key={t} value={t} className="capitalize">
              {t.toLowerCase().replaceAll("_", " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}
