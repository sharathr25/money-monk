import { Outlet } from "react-router"
import { Toaster } from "@workspace/ui/components/sonner"

export const Layout = () => (
  <div className="flex min-h-svh flex-1 flex-col p-6">
    <Toaster position="top-center" richColors />
    <Outlet />
  </div>
)
