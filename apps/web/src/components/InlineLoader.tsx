import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import { Spinner } from "@workspace/ui/components/spinner"

export function InlineLoader() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader className="flex flex-row items-center">
        <EmptyMedia variant="icon" className="m-0">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle className="capitalize">Loading, Please Wait.</EmptyTitle>
      </EmptyHeader>
    </Empty>
  )
}
