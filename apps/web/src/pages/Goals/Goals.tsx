import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { Progress } from "@workspace/ui/components/progress"
import {
  Car,
  Check,
  House,
  Info,
  Laptop,
  PlaneTakeoff,
  Plus,
} from "lucide-react"

export function Goals() {
  return (
    <div className="mb-16 flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-extrabold">Commitments</h1>
        <p>Your financial journeys and milestones.</p>
      </div>
      <div className="no-scrollbar flex w-full flex-1 gap-2 overflow-x-scroll">
        <Badge variant="default">All commitements</Badge>
        <Badge variant="secondary">Planned</Badge>
        <Badge variant="secondary">Started Saving</Badge>
        <Badge variant="secondary">Active</Badge>
        <Badge variant="secondary">Paused</Badge>
        <Badge variant="secondary">Completed</Badge>
      </div>
      <div className="flex flex-col gap-4">
        {/* Active card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col items-start">
              <div className="flex w-full justify-between">
                <Badge>Active</Badge>
                <House strokeWidth={1} />
              </div>
              <div className="flex w-full flex-col">
                <div className="text-lg font-bold capitalize">
                  Mortage repayment
                </div>
                <div className="text-sm">₹ 30,00,00,000</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <Field className="w-full max-w-sm">
              <FieldLabel htmlFor="progress-upload">
                <span>Completion progress</span>
                <span className="ml-auto">66%</span>
              </FieldLabel>
              <Progress value={66} id="progress-upload" />
            </Field>
            <p className="mt-1 text-right text-xs text-(--muted-foreground)">
              Started On Oct 12, 2024
            </p>
          </CardContent>
        </Card>
        {/* Started saving card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col items-start">
              <div className="flex w-full justify-between">
                <Badge variant="secondary">Started Saving</Badge>
                <PlaneTakeoff strokeWidth={1} />
              </div>
              <div className="flex w-full flex-col">
                <div className="text-lg font-bold capitalize">
                  Mortage repayment
                </div>
                <div className="text-sm">₹ 30,00,00,000</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <Field className="w-full max-w-sm">
              <FieldLabel htmlFor="progress-upload">
                <span>Completion progress</span>
                <span className="ml-auto">66%</span>
              </FieldLabel>
              <Progress value={66} id="progress-upload" />
            </Field>
            <p className="mt-1 text-right text-xs text-(--muted-foreground)">
              Started Saving On Oct 12, 2024
            </p>
          </CardContent>
        </Card>
        {/* Planned */}
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col items-start">
              <div className="flex w-full justify-between">
                <Badge variant="outline">Planned</Badge>
                <Car strokeWidth={1} />
              </div>
              <div className="flex w-full flex-col">
                <div className="text-lg font-bold capitalize">To Buy Car</div>
                <div className="text-sm">₹ 30,00,00,000</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <p className="mt-1 text-right text-xs text-(--muted-foreground)">
              Upcoming commitment
            </p>
          </CardContent>
        </Card>
        {/* Paused */}
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col items-start">
              <div className="flex w-full justify-between">
                <Badge variant="destructive">Paused</Badge>
                <Laptop strokeWidth={1} className="text-(--destructive)" />
              </div>
              <div className="flex w-full flex-col">
                <div className="text-lg font-bold capitalize">Laptop</div>
                <div className="text-sm">₹ 30,00,00,000</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <Alert variant="default" className="bg-(--primary)/10">
              <Info strokeWidth={1} />
              <AlertDescription>
                Paused due to budget rellocation
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
        {/* Done */}
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col items-start">
              <div className="flex w-full justify-between">
                <Badge>Done</Badge>
                <Check />
              </div>
              <div className="flex w-full flex-col">
                <div className="text-lg font-bold capitalize">Student Loan</div>
                <div className="text-sm">₹ 30,00,00,000</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <p className="mt-1 text-right text-xs text-(--muted-foreground)">
              Completed On Oct 12, 2024
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-linear-to-t from-background px-6 pb-20">
        <Button className="h-12 w-full">
          <Plus /> Add New Commitement
        </Button>
      </div>
    </div>
  )
}
