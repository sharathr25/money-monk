import { createBrowserRouter } from "react-router"
import { Home } from "@/pages/home"
import { CashFlow } from "@/pages/cashFlow"
import { Goals } from "@/pages/goals"
import { AddGoal } from "@/pages/addGoal"
import { Settings } from "./pages/settings"
import { CashFlowManagement } from "./pages/cashFlowManagment"
import { CashFlowProjection } from "./pages/cashFlowProjection"
import { AddCashFlowMovement } from "./pages/addCashFlowMovement"
import { Layout } from "./components/Layout"

export const ROUTE_NAMES = {
  ROOT: "/",
  CASH_FLOW_PRJECTION: "/cash-flow-projection",
  GOALS: "/goals",
  CASH_FLOW_MANAGEMENT: "/manage-cash-flow",
  ADD_CASH_FLOW_MOVEMENT: "/add-cash-flow-movement",
  ADD_GOAL: "/add-goal",
  SETTINGS: "/settings",
} as const

export type RouteName = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES]

const routes = [
  {
    path: ROUTE_NAMES.ROOT,
    Component: Layout,
    children: [
      {
        path: ROUTE_NAMES.ROOT,
        Component: Home,
        children: [
          {
            index: true,
            Component: CashFlow,
          },
          {
            path: ROUTE_NAMES.CASH_FLOW_PRJECTION,
            Component: CashFlowProjection,
          },
          {
            path: ROUTE_NAMES.GOALS,
            Component: Goals,
          },
        ],
      },
      {
        path: ROUTE_NAMES.CASH_FLOW_MANAGEMENT,
        Component: CashFlowManagement,
      },
      {
        path: ROUTE_NAMES.ADD_CASH_FLOW_MOVEMENT,
        Component: AddCashFlowMovement,
      },
      {
        path: ROUTE_NAMES.GOALS,
        Component: AddGoal,
      },
      {
        path: ROUTE_NAMES.SETTINGS,
        Component: Settings,
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
