import { BrowserRouter, Outlet, Route, Routes } from "react-router"
import { Home } from "@/pages/home"
import { CashFlow } from "@/pages/CashFlow"
import { Goals } from "@/pages/Goals"
import { AddGoal } from "@/pages/AddGoal"
import { Header } from "./components/Header"
import { Settings } from "./pages/settings"

const Layout = () => (
  <div className="flex min-h-svh flex-1 flex-col">
    <div className="my-2 px-6">
      <Header />
    </div>
    <div className="flex flex-1 flex-col px-6">
      <Outlet />
    </div>
  </div>
)

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} index />
          <Route path="cash-flow" element={<CashFlow />} />
          <Route path="goals" element={<Goals />} />
          <Route path="add-goal" element={<AddGoal />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
