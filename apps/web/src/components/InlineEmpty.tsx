import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import { Wind } from "lucide-react"

export function InlineEmpty({
  title,
}: {
  title: string
  description?: string
}) {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader className="flex flex-row items-center">
        <EmptyMedia variant="icon" className="m-0">
          <Wind />
        </EmptyMedia>
        <EmptyTitle className="capitalize">{title}</EmptyTitle>
      </EmptyHeader>
    </Empty>
  )
}
