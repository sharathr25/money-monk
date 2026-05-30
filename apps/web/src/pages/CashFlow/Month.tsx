import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Calendar } from "lucide-react"
import dayjs from "dayjs"

export function Month() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{dayjs().format("YYYY")}</CardTitle>
        <CardAction>
          <Calendar />
        </CardAction>
      </CardHeader>
      <CardContent className="mt-auto text-xl">
        {dayjs().format("MMMM")}
      </CardContent>
    </Card>
  )
}
