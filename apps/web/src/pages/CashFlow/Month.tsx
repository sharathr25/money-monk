import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Calendar } from "lucide-react"
import dayjs from "dayjs"

export function Month() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="font-bold capitalize">{dayjs().format("MMMM")}</div>
          <Calendar />
        </CardTitle>
        <CardDescription>{dayjs().format("YYYY")}</CardDescription>
      </CardHeader>
    </Card>
  )
}
