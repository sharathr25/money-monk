import { Outlet } from "react-router"
import { Header } from "./Header"
import { Toaster } from "@workspace/ui/components/sonner"

export const Layout = () => (
  <div className="flex min-h-svh flex-1 flex-col">
    <Toaster position="top-center" richColors />
    <div className="fixed top-0 z-99 w-full bg-(--background) px-6">
      <Header />
    </div>
    <div className="mt-10 flex flex-1 flex-col px-6 py-2">
      <Outlet />
    </div>
    <div className="h-2" />
  </div>
)
