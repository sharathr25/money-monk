import { Button } from "@workspace/ui/components/button"
import { Calendar } from "@workspace/ui/components/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"

export const DateSelector = ({
  date,
  setDate,
}: {
  date?: Date
  setDate: (d: Date | undefined) => void
}) => {
  const [calendarOpen, setCalenderOpen] = useState(false)

  return (
    <Field>
      <FieldLabel htmlFor="date-picker-simple">Date</FieldLabel>
      <Dialog open={calendarOpen} onOpenChange={setCalenderOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-simple"
            className="justify-start border-(--foreground) font-normal text-(--foreground)"
          >
            <CalendarIcon />
            {date?.toLocaleDateString()}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="flex items-start">
            <DialogTitle className="capitalize">
              Date of the transaction
            </DialogTitle>
            <DialogDescription>
              By default today's date will be selected
            </DialogDescription>
          </DialogHeader>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d: Date | undefined) => {
              setDate(d)
              setCalenderOpen(false)
            }}
            defaultMonth={date}
            captionLayout="dropdown"
            className="mx-auto"
          />
        </DialogContent>
      </Dialog>
    </Field>
  )
}
