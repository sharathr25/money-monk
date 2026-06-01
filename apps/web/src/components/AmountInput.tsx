import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { formatAmount, isNumber } from "@workspace/ui/lib/utils"
import { IndianRupee } from "lucide-react"

export const AmountInput = ({
  setAmount,
  description,
  label = "Amount",
  ...rest
}: {
  label?: string
  setAmount: Function
  required?: boolean
  description?: string
}) => {
  return (
    <Field>
      <FieldLabel htmlFor="amount">
        {label}
        {rest.required && <span className="text-destructive">*</span>}
      </FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}
      <InputGroup>
        <InputGroupInput
          id="amount"
          inputMode="numeric"
          {...rest}
          onChange={(e) =>
            setAmount(
              isNumber(e.target.value) ? formatAmount(e.target.value) : ""
            )
          }
        />
        <InputGroupAddon>
          <IndianRupee />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
