import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import { TriangleAlert } from "lucide-react"

export function InlineError({
  title = "Something went wrong",
  description,
}: {
  title?: string
  description?: string
}) {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader className="flex flex-row items-center">
        <EmptyMedia variant="icon" className="m-0">
          <TriangleAlert />
        </EmptyMedia>
        <EmptyTitle className="capitalize">{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
    </Empty>
  )
}
