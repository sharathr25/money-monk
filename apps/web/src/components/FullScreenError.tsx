import { TriangleAlert } from "lucide-react"

export const FullScreenError = ({
  msg = "Something went wrong",
  children,
}: {
  msg?: string
  children?: React.ReactNode
}) => (
  <div className="flex min-h-svh flex-1 flex-col items-center justify-center gap-2">
    <TriangleAlert />
    <h1>{msg}</h1>
    {children}
  </div>
)
