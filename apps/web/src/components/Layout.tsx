import { Outlet } from "react-router"
import { Toaster } from "@workspace/ui/components/sonner"

export const Layout = ({ children }: { children?: React.ReactElement }) => (
  <div className="flex min-h-svh flex-1 flex-col p-6">
    <Toaster position="top-center" richColors />
    {children ? children : <Outlet />}
  </div>
)
