import { RouterProvider } from "react-router"
import { router } from "./routes"
// import { initializeFirebase } from "./firebase"
import { getCashFlowTemplates } from "@workspace/api/firebase/cashFlowTemplates"

// initializeFirebase()

console.log(getCashFlowTemplates())

export function App() {
  return <RouterProvider router={router} />
}
