import { RouterProvider } from "react-router"
import { router } from "./routes"
// import { initializeFirebase } from "./firebase"

// initializeFirebase()

export function App() {
  return <RouterProvider router={router} />
}
