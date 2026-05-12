import { RouterProvider } from "react-router"
import { router } from "./routes"
import { onAuthStateChanged } from "@workspace/api/auth/index"
import { useEffect, useState } from "react"
import { FullScreenLoader } from "@/components/FullScreenLoader"

export function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    onAuthStateChanged(() => {
      setLoading(false)
    })
  }, [])

  if (loading) return <FullScreenLoader />

  return <RouterProvider router={router()} />
}
