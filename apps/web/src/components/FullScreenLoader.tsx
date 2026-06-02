import { Spinner } from "@workspace/ui/components/spinner"

export const FullScreenLoader = () => (
  <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-2">
    <Spinner className="size-8" />
    <h1>Loading, Please wait</h1>
  </div>
)
