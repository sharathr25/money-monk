import { RouterProvider } from "react-router"
import { router } from "./routes"
// import { initializeFirebase } from "./firebase"
import { getCashFlowTemplates } from "@workspace/api/firebase/cashFlowTemplates"

// initializeFirebase()

console.log(await getCashFlowTemplates({ uid: "na" }))

export function App() {
  return <RouterProvider router={router} />
}
