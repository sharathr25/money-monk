import { RouterProvider } from "react-router"
import { router } from "./routes"
import { onAuthStateChanged } from "@workspace/api/auth/index"
import { Suspense, useEffect, useState } from "react"
import { FullScreenLoader } from "@/components/FullScreenLoader"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Layout } from "./components/Layout"
import { TooltipProvider } from "@workspace/ui/components/tooltip"

export function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    onAuthStateChanged(() => {
      setLoading(false)
    })
  }, [])

  if (loading)
    return (
      <Layout>
        <FullScreenLoader />
      </Layout>
    )

  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Suspense
          fallback={
            <Layout>
              <FullScreenLoader />
            </Layout>
          }
        >
          <RouterProvider router={router()} />
        </Suspense>
      </TooltipProvider>
    </QueryClientProvider>
  )
}
