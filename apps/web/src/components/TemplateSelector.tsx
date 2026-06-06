import type { CashFlowTemplate } from "@workspace/core/types"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

export const TemplateSelector = ({
  templateId,
  setTemplateId,
  templates,
  disabled = false,
  required = false,
}: {
  templateId?: string
  setTemplateId: (value: string) => void
  templates: CashFlowTemplate[]
  required?: boolean
  disabled?: boolean
}) => {
  return (
    <Field>
      <FieldLabel htmlFor="goal">
        Template{required && <span className="text-destructive">*</span>}
      </FieldLabel>
      <Select
        disabled={disabled}
        defaultValue={templateId}
        required={required}
        onValueChange={setTemplateId}
      >
        <SelectTrigger id="goal" className="!h-12 capitalize">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {templates.map((g) => (
            <SelectItem value={g.id} key={g.id} className="capitalize">
              {g.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}
