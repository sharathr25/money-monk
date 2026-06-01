import type { Frequency } from "@workspace/core/types"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

export const FrequencySelector = ({
  frequency,
  setFrequency,
  frequencies,
}: {
  frequencies: (Frequency | "ALL")[]
  frequency: string
  setFrequency: (value: string) => void
}) => {
  return (
    <Field>
      <FieldLabel>Frequency</FieldLabel>
      <Select defaultValue={frequency} onValueChange={setFrequency}>
        <SelectTrigger id="type" className="!h-12 capitalize">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {frequencies.map((f) => (
            <SelectItem key={f} value={f} className="capitalize">
              {f.toLowerCase().replaceAll("_", " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}
