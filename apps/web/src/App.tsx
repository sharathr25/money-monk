import { RouterProvider } from "react-router"
import { router } from "./routes"
import { onAuthStateChanged } from "@workspace/api/auth/index"
import { useEffect, useState } from "react"
import { Spinner } from "@workspace/ui/components/spinner"

export function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    onAuthStateChanged(() => {
      setLoading(false)
    })
  }, [])

  if (loading)
    return (
      <div className="flex min-h-svh flex-1 flex-col items-center justify-center gap-2">
        <Spinner className="size-8" />
        <h1>Loading, Please wait</h1>
      </div>
    )

  return <RouterProvider router={router()} />
}
